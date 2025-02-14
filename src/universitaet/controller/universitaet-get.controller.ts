// Copyright (C) 2016 - present Juergen Zimmermann, Hochschule Karlsruhe
// Copyright (C) 2024 - present Botan Coban
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program. If not, see <https://www.gnu.org/licenses/>.

/**
 * Modul für REST-Controller zum Lesen der REST-Schnittstelle.
 * @packageDocumentation
 */
import {
    Controller,
    Get,
    Headers,
    HttpStatus,
    NotFoundException,
    Param,
    Req,
    Res,
    UseInterceptors,
} from '@nestjs/common';
import {
    ApiHeader,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiOperation,
    ApiParam,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';
import { Request, Response } from 'express';
import { Public } from 'nest-keycloak-connect';
import { paths } from '../../config/paths.js';
import { getLogger } from '../../logger/logger.js';
import { ResponseTimeInterceptor } from '../../logger/response-time.interceptor.js';
import { type Bibliothek } from '../entity/bibliothek.entity';
import { type Universitaet } from '../entity/universitaet.entity.js';
import { UniversitaetReadService } from '../service/universitaet-read.service.js';
import { getBaseUri } from './getBaseUri.js';

/** href-Link für HATEOAS */
export type Link = {
    /** href-Link für HATEOAS-Links */
    readonly href: string;
};

/** Links für HATEOAS */
export type Links = {
    /** self-Link */
    readonly self: Link;
    /** Optionaler Linke für list */
    readonly list?: Link;
    /** Optionaler Linke für add */
    readonly add?: Link;
    // /** Optionaler Linke für update */
    // readonly update?: Link;
    // /** Optionaler Linke für remove */
    // readonly remove?: Link;
};

/**
 * Typdefinition eines Bibliothek-Objektes ohne Rückwärtsverweis zur Universitaet
 */
export type BibliothekModel = Omit<Bibliothek, 'universitaet' | 'id'>;

/**
 * Universitaet Objekt mit HATEOAS-Links.
 */
export type UniversitaetModel = Omit<
    Universitaet,
    'id' | 'version' | 'erzeugt' | 'aktualisiert' | 'kurse' | 'bibliothek'
> & {
    bibliothek: BibliothekModel;
    // eslint-disable-next-line @typescript-eslint/naming-convention
    _links: Links;
};

export type UniversitaetenModel = {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    _embedded: {
        universitaeten: UniversitaetModel[];
    };
};

const MIMETYPE = 'application/hal+json';

/**
 * REST-Controller-Klasse für das Lesen von Universitäten.
 */
@Controller(paths.rest)
@UseInterceptors(ResponseTimeInterceptor)
@ApiTags(`Universität REST API`)
export class UniversitaetGetController {
    readonly #service: UniversitaetReadService;
    readonly #logger = getLogger(UniversitaetGetController.name);

    // Wird für Dependency Injection gebraucht
    constructor(service: UniversitaetReadService) {
        this.#service = service;
    }

    @Get()
    @Public()
    @ApiOperation({ summary: 'Suche aller Universitäten' })
    @ApiOkResponse({
        description: 'Eine evtl. leeres Json Array mit Universitäten',
    })
    async get(
        @Req() req: Request,
        @Res() res: Response,
    ): Promise<Response<UniversitaetModel | undefined>> {
        if (req.accepts([MIMETYPE, 'json', 'html']) === false) {
            this.#logger.debug('get: accepted=%o', req.accepted);
            return res.sendStatus(HttpStatus.NOT_ACCEPTABLE);
        }

        const universitaeten = await this.#service.findAll();
        this.#logger.debug('get: universitaeten=%o', universitaeten);

        const universitaetenModel = universitaeten.map((universitaet) =>
            this.#toModel(universitaet, req, false),
        );
        this.#logger.debug(`get: universitaetenModel=%0`, universitaetenModel);
        const result: UniversitaetenModel = {
            _embedded: { universitaeten: universitaetenModel },
        };
        return res.contentType(MIMETYPE).json(result).send();
    }

    @Get(':id')
    @Public()
    @ApiOperation({ summary: `Suche mit id` })
    @ApiParam({
        name: 'id',
        description: 'Z.B. 1',
    })
    @ApiHeader({
        name: 'If-None-Match',
        description: 'Header für bedingte GET-Requests, z.B. "0"',
        required: false,
    })
    @ApiOkResponse({ description: `Die Universität wurde gefunden` })
    @ApiNotFoundResponse({
        description: `Die Universität wurde nicht gefunden`,
    })
    @ApiResponse({
        status: HttpStatus.NOT_MODIFIED,
        description: `Die Universität wurde bereits heruntergeladen`,
    })
    async getById(
        @Param('id') idString: string,
        @Req() req: Request,
        @Headers(`If-None-Match`) version: string | undefined,
        @Res() res: Response,
    ): Promise<Response<UniversitaetModel | undefined>> {
        this.#logger.debug(`getById(id=%s)`, idString);
        const id = Number(idString);
        if (!Number.isInteger(id)) {
            this.#logger.debug('getById(): ID %s ist kein integer', idString);
            throw new NotFoundException(`ID ${idString} ist ungültig`);
        }

        if (req.accepts([MIMETYPE, 'json', 'html']) === false) {
            this.#logger.debug('getById: accepted=%o', req.accepted);
            return res.sendStatus(HttpStatus.NOT_ACCEPTABLE);
        }

        const universitaet = await this.#service.findByID(id);
        if (this.#logger.isLevelEnabled('debug')) {
            this.#logger.debug(
                'getById(): Universität=%s',
                universitaet.toString(),
            );
            this.#logger.debug(`get-ById(): name=%s`, universitaet.name);
        }

        // ETags
        const versionDb = universitaet.version;
        if (version === `"${versionDb}"`) {
            this.#logger.debug('getById: NOT_MODIFIED');
            return res.sendStatus(HttpStatus.NOT_MODIFIED);
        }
        this.#logger.debug('getById: versionDb=%s', versionDb);
        res.header('ETag', `"${versionDb}"`);

        const universitaetModel = this.#toModel(universitaet, req);
        this.#logger.debug(`getById: universitaetModel=%o`, universitaetModel);
        return res.contentType(MIMETYPE).json(universitaetModel);
    }

    #toModel(universitaet: Universitaet, req: Request, all = true) {
        const baseUri = getBaseUri(req);
        this.#logger.debug('#toModel: baseUri=%s', baseUri);
        const { id } = universitaet;
        const links = all
            ? {
                  self: { href: `${baseUri}/${id}` },
                  list: { href: `${baseUri}` },
                  add: { href: `${baseUri}` },
                  update: { href: `${baseUri}/${id}` },
                  remove: { href: `${baseUri}/${id}` },
              }
            : { self: { href: `${baseUri}/${id}` } };
        this.#logger.debug(
            '#toModel: universitaet=%o,links=%o',
            universitaet,
            links,
        );
        const bibliothekModel: BibliothekModel = {
            name: universitaet.bibliothek?.name ?? `N/A`,
            isil: universitaet.bibliothek?.isil ?? `n/a`,
        };
        const universitaetModel: UniversitaetModel = {
            name: universitaet.name,
            standort: universitaet.standort,
            anzahlStudierende: universitaet.anzahlStudierende,
            homepage: universitaet.homepage,
            gegruendet: universitaet.gegruendet,
            fakultaeten: universitaet.fakultaeten,
            ranking: universitaet.ranking,
            bibliothek: bibliothekModel,
            _links: links,
        };

        return universitaetModel;
    }
}
