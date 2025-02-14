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

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { getLogger } from '../../logger/logger.js';
import { Bibliothek } from '../entity/bibliothek.entity.js';
import { Kurs } from '../entity/kurs.entity.js';
import { Universitaet } from '../entity/universitaet.entity.js';

// TODO überprüfen, ob richtig eingestellt für TypeORM

/**
 * Das Modul besteht aus der Klasse {@linkcode QueryBuilder}.
 * @packageDocumentation
 */

/**
 * Typefinition für Suche mit Universitaet-ID
 */
export type BuildIdParams = {
    /**
     * Id der gesuchten Universitaet
     */
    readonly id: number;
    /**
     * Sollen die Kurse mitgeladen werden?
     */
    readonly mitKursen?: boolean;
};

/**
 * Implementiert das Lesen der Universitaeten und greift mit _TypeORM_ auf die Datenbank zu.
 */
@Injectable()
export class QueryBuilder {
    readonly #universiaetAlias = `${Universitaet.name.charAt(0).toLowerCase()}${Universitaet.name.slice(1)}`;

    readonly #bibliothekAlias = `${Bibliothek.name.charAt(0).toLowerCase()}${Bibliothek.name.slice(1)}`;

    readonly #logger = getLogger(QueryBuilder.name);

    readonly #kursAlias = `${Kurs.name.charAt(0).toLowerCase()}${Kurs.name.slice(1)}`;

    readonly #repo: Repository<Universitaet>;

    constructor(
        @InjectRepository(Universitaet) repo: Repository<Universitaet>,
    ) {
        this.#repo = repo;
    }

    /**
     * Eine Universitaet mit der gegebenen Id suchen.
     * @param id Id der gesuchten Universitaet
     * @returns
     */
    buildId({ id, mitKursen = false }: BuildIdParams) {
        // QueryBuilder "universitaet" fuer Repository<Universitaet> erstellen
        const queryBuilder = this.#repo.createQueryBuilder(
            this.#universiaetAlias,
        );

        // Fetch-Join: aus QueryBuilder "universitaet" die Property "bibliothek" laden (Tabelle bibliothek)
        queryBuilder.innerJoinAndSelect(
            `${this.#universiaetAlias}.bibliothek`,
            this.#bibliothekAlias,
        );

        if (mitKursen) {
            queryBuilder.leftJoinAndSelect(
                `${this.#universiaetAlias}.kurse`,
                this.#kursAlias,
            );
        }

        // eslint-disable-next-line object-shorthand
        queryBuilder.where(`${this.#universiaetAlias}.id = :id`, { id: id });
        // .getOne() wird nicht gebruacht, da die ID der Primärschlüssel ist
        return queryBuilder;
    }

    /**
     * Universitäten asynchron suchen.
     * @returns QueryBuilder
     */
    // TODO für Suche mögliche fehlende Implementierung ergänzen
    // FIXME bei Suche Alle wird diese Methode aufgerufen, somit muss diese auch implementiert werden
    build() {
        const queryBuilder = this.#repo.createQueryBuilder(
            this.#universiaetAlias,
        );
        queryBuilder.innerJoinAndSelect(
            `${this.#universiaetAlias}.bibliothek`,
            `bibliothek`,
        );
        this.#logger.debug('build: sql=%s', queryBuilder.getSql());
        return queryBuilder;
    }
}
