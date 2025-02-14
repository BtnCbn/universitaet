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
 * Das Modul besteht aus der Klasse {@linkcode UniversitaetReadService}
 * @packageDocumentation
 */
import { Injectable, NotFoundException } from '@nestjs/common';
import { getLogger } from '../../logger/logger.js';
import { QueryBuilder } from './query-builder.js';

@Injectable()
export class UniversitaetReadService {
    static readonly ID_PATTERN = /^[1-9]\d{0,10}$/u;

    readonly #queryBuilder: QueryBuilder;

    readonly #logger = getLogger(UniversitaetReadService.name);

    constructor(queryBuilder: QueryBuilder) {
        this.#queryBuilder = queryBuilder;
    }

    /**
     * Alle Universitaeten asynchron suchen.
     * @returns Alle Universitaeten oder ein leeres Array
     */
    async findAll() {
        this.#logger.debug('findAll()');

        const universitaeten = await this.#queryBuilder.build().getMany();
        if (universitaeten.length === 0) {
            this.#logger.debug('find: Keine Universitaeten gefunden');
            throw new NotFoundException(`Keine Universitaeten gefunden`);
        }
        universitaeten.forEach((universitaet) => {
            if (universitaet.fakultaeten === null) {
                universitaet.fakultaeten = [];
            }
        });
        this.#logger.debug('find: universitaeten=%o', universitaeten);
        return universitaeten;
    }

    /**
     * Eine Universität asynchron anhand der Id suchen.
     * @param id die ID der Universität
     * @returns Die gefundene Universität in einem Promise
     * @throws NotFoundException wenn die Universität nicht gefunden wurde
     */
    async findByID(id: number) {
        this.#logger.debug('FindByID(%d)', id);

        const universitaet = await this.#queryBuilder.buildId({ id }).getOne();
        if (universitaet === null) {
            throw new NotFoundException(
                `Es gibt keine Universitaet mit der ID ${id}.`,
            );
        }
        if (universitaet.fakultaeten === null) {
            universitaet.fakultaeten = [];
        }

        if (this.#logger.isLevelEnabled('debug')) {
            this.#logger.debug(
                'findById: universitaet=%s, titel=%o',
                universitaet.toString(),
                universitaet.name,
            );
        }
        return universitaet;
    }
}
