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

import { ApiProperty } from '@nestjs/swagger';
import {
    Column,
    Entity,
    JoinColumn,
    OneToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Universitaet } from './universitaet.entity.js';

// Bibliothek Entity
@Entity()
export class Bibliothek {
    @PrimaryGeneratedColumn()
    id: number | undefined;

    @Column()
    @ApiProperty({ example: 'Universitaetsbibliothek', type: String })
    readonly name!: string;

    @Column('varchar')
    @ApiProperty({ example: 'DE-Mun1', type: String })
    readonly isil: string | undefined;

    @OneToOne(() => Universitaet, (universitaet) => universitaet.bibliothek)
    @JoinColumn({ name: 'universitaet_id' })
    universitaet: Universitaet | undefined;

    public toString = (): string =>
        JSON.stringify({
            id: this.id,
            name: this.name,
            isil: this.isil,
        });
}
