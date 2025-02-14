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

import { UseFilters, UseInterceptors } from '@nestjs/common';
import { Args, Query, Resolver } from '@nestjs/graphql';
import { Public } from 'nest-keycloak-connect';
import { getLogger } from '../../logger/logger.js';
import { ResponseTimeInterceptor } from '../../logger/response-time.interceptor.js';
import { UniversitaetReadService } from '../service/universitaet-read.service.js';
import { HttpExceptionFilter } from './http-exception.filter.js';

export type IdInput = {
    readonly id: number;
};

@Resolver('Universitaet')
@UseFilters(HttpExceptionFilter)
@UseInterceptors(ResponseTimeInterceptor)
export class UniversitaetQueryResolver {
    readonly #service: UniversitaetReadService;

    readonly #logger = getLogger(UniversitaetQueryResolver.name);

    constructor(service: UniversitaetReadService) {
        this.#service = service;
    }

    @Query('universitaet')
    @Public()
    async findById(@Args() { id }: IdInput) {
        this.#logger.debug('findById: id=%d', id);

        const universitaet = await this.#service.findByID(id);

        if (this.#logger.isLevelEnabled('debug')) {
            this.#logger.debug(
                'findById: universitaet=%s, name=%o',
                universitaet.toString(),
                universitaet.name,
            );
        }
        return universitaet;
    }

    @Query('universitaeten')
    @Public()
    async find() {
        this.#logger.debug('find: findAll');
        const universitaeten = await this.#service.findAll();
        this.#logger.debug('find: universitaeten=%o', universitaeten);
        return universitaeten;
    }
}
