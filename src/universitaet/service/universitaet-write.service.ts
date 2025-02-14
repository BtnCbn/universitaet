// Copyright (C) 2016 - present Juergen Zimmermann, Hochschule Karlsruhe
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
import { Universitaet } from '../entity/universitaet.entity.js';
import { NameExistsException } from './exceptions.js';

/**
 * Die Klasse `UniversitaetWriteService` stellt die Geschäftslogik
 * für das Schreiben von Universitäten bereit und greift mittels TypeORM aud die Datenbank zu.
 */
@Injectable()
export class UniversitaetWriteService {
    readonly #repo: Repository<Universitaet>;

    readonly #logger = getLogger(UniversitaetWriteService.name);

    constructor(
        @InjectRepository(Universitaet) repo: Repository<Universitaet>,
    ) {
        this.#repo = repo;
    }

    /**
     * Eine neue Universität anlegen.
     * @param universitaet - Die anzulegende Universität.
     * @returns Die ID der angelegten Universität.
     * @throws NameExistsException - Wenn der Name der Universität bereits existiert.
     */
    async create(universitaet: Universitaet): Promise<number> {
        this.#logger.debug(`create: universitaet=%o`, universitaet);
        await this.#validateCreate(universitaet);

        const universitaetDb = await this.#repo.save(universitaet);
        this.#logger.debug(`create: UniversitaetDb=%o`, universitaetDb);

        return universitaetDb.id!;
    }

    async #validateCreate({ name }: Universitaet): Promise<void> {
        this.#logger.debug(`#validateCreation: name=%s`, name);
        if (await this.#repo.existsBy({ name })) {
            throw new NameExistsException(
                `Universität ${name} existiert bereits`,
            );
        }
    }
}
