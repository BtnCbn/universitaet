// Copyright (C) 2021 - present Juergen Zimmermann, Hochschule Karlsruhe
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

import {
    Body,
    Controller,
    Post,
    Req,
    Res,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import {
    ApiBadRequestResponse,
    ApiBearerAuth,
    ApiCreatedResponse,
    ApiForbiddenResponse,
    ApiOperation,
    ApiTags,
} from '@nestjs/swagger';
import { Request, Response } from 'express';
import { AuthGuard, Roles } from 'nest-keycloak-connect';
import { paths } from '../../config/paths.js';
import { getLogger } from '../../logger/logger.js';
import { ResponseTimeInterceptor } from '../../logger/response-time.interceptor.js';
import { type Bibliothek } from '../entity/bibliothek.entity.js';
import { type Kurs } from '../entity/kurs.entity.js';
import { type Universitaet } from '../entity/universitaet.entity';
import { UniversitaetWriteService } from '../service/universitaet-write.service.js';
import { getBaseUri } from './getBaseUri.js';
import { UniversitaetDTO } from './universitaetDTO.entity.js';

const MSG_FORBIDDEN = 'Kein Token mit ausreichender Berechtigung vorhanden';

/**
 * Controller für die REST-API zum Anlegen von Universitäten.
 */
@Controller(paths.rest)
@UseGuards(AuthGuard)
@UseInterceptors(ResponseTimeInterceptor)
@ApiTags('Universitaet REST-API')
@ApiBearerAuth()
export class UniversitaetWriteController {
    readonly #service: UniversitaetWriteService;

    readonly #logger = getLogger(UniversitaetWriteController.name);

    constructor(service: UniversitaetWriteService) {
        this.#service = service;
    }

    /**
     * Eine neue Universität wird asynchron angelegt.
     *
     * @param buchDTO JSON-Daten für eine Universität im Request-Body.
     * @param res Leeres Response-Objekt von Express.
     * @returns Leeres Promise-Objekt.
     */
    @Post()
    @Roles({ roles: ['admin', 'user'] })
    @ApiOperation({ summary: 'Eine neue Universität anlegen' })
    @ApiCreatedResponse({ description: 'Erfolgreich neu angelegt' })
    @ApiBadRequestResponse({ description: 'Fehlerhafte Universitätsdaten' })
    @ApiForbiddenResponse({ description: MSG_FORBIDDEN })
    async post(
        @Body() universtitaetDTO: UniversitaetDTO,
        @Req() req: Request,
        @Res() res: Response,
    ): Promise<Response> {
        this.#logger.debug('post: universitaetDTO=%o', universtitaetDTO);

        const universitaet =
            this.#universitaetDtoToUniversitaet(universtitaetDTO);
        const id = await this.#service.create(universitaet);

        const location = `${getBaseUri(req)}/${id}`;
        this.#logger.debug('post: location=%s', location);
        return res.location(location).send();
    }

    #universitaetDtoToUniversitaet(
        universitaetDTO: UniversitaetDTO,
    ): Universitaet {
        const bibliothekDTO = universitaetDTO.bibliothek;
        const bibliothek: Bibliothek = {
            id: undefined,
            name: bibliothekDTO.name,
            isil: bibliothekDTO.isil,
            universitaet: undefined,
        };
        const kurse = universitaetDTO.kurse?.map((kursDTO) => {
            const kurs: Kurs = {
                id: undefined,
                titel: kursDTO.titel,
                startDatum: kursDTO.startDatum,
                universitaet: undefined,
            };
            return kurs;
        });
        const universitaet = {
            id: undefined,
            version: undefined,
            name: universitaetDTO.name,
            standort: universitaetDTO.standort,
            anzahlStudierende: universitaetDTO.anzahlStudierende,
            homepage: universitaetDTO.homepage,
            gegruendet: universitaetDTO.gegruendet,
            fakultaeten: universitaetDTO.fakultaeten,
            ranking: universitaetDTO.ranking,
            bibliothek,
            kurse,
            erzeugt: new Date(),
            aktualisiert: new Date(),
        };

        // Rueckwaertsverweise
        universitaet.bibliothek.universitaet = universitaet;
        universitaet.kurse?.forEach((kurs) => {
            kurs.universitaet = universitaet;
        });
        return universitaet;
    }
}
