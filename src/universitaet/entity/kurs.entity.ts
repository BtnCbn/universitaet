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
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Universitaet } from './universitaet.entity.js';

// Kurs Entity
@Entity()
export class Kurs {
    @PrimaryGeneratedColumn()
    id: number | undefined;

    @Column()
    @ApiProperty({ example: 'Einfuehrung in die Informatik', type: String })
    readonly titel!: string;

    @Column('date')
    @ApiProperty({ example: '2023-04-01', type: String })
    readonly startDatum: Date | undefined;

    @ManyToOne(() => Universitaet, (universitaet) => universitaet.kurse)
    @JoinColumn({ name: 'universitaet_id' })
    universitaet: Universitaet | undefined;

    public toString = (): string =>
        JSON.stringify({
            id: this.id,
            titel: this.titel,
            startDatum: this.startDatum,
        });
}
