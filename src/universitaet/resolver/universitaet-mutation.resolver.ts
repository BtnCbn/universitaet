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

import { UseFilters, UseGuards, UseInterceptors } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthGuard, Roles } from 'nest-keycloak-connect';
import { getLogger } from '../../logger/logger.js';
import { ResponseTimeInterceptor } from '../../logger/response-time.interceptor.js';
import { UniversitaetDTO } from '../controller/universitaetDTO.entity.js';
import { type Bibliothek } from '../entity/bibliothek.entity.js';
import { type Kurs } from '../entity/kurs.entity.js';
import { type Universitaet } from '../entity/universitaet.entity.js';
import { UniversitaetWriteService } from '../service/universitaet-write.service.js';
import { HttpExceptionFilter } from './http-exception.filter.js';

export type CreatePayload = {
    readonly id: number;
};

@Resolver('Universitaet')
@UseGuards(AuthGuard)
@UseFilters(HttpExceptionFilter)
@UseInterceptors(ResponseTimeInterceptor)
export class UniversitaetMutationResolver {
    readonly #service: UniversitaetWriteService;

    readonly #logger = getLogger(UniversitaetMutationResolver.name);

    constructor(service: UniversitaetWriteService) {
        this.#service = service;
    }

    @Mutation()
    @Roles({ roles: ['admin', 'user'] })
    async create(@Args('input') universitaetDTO: UniversitaetDTO) {
        this.#logger.debug('create: universitaetDTO=%o', universitaetDTO);

        const universitaet =
            this.#universitaetDtoToUniversitaet(universitaetDTO);
        const id = await this.#service.create(universitaet);
        this.#logger.debug('createUniversitaet: id=%d', id);
        const payload: CreatePayload = { id };
        return payload;
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
        return universitaet;
    }
}
