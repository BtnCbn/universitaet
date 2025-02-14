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

/* eslint-disable max-classes-per-file */

import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
    ArrayUnique,
    IsArray,
    IsInt,
    IsOptional,
    IsUrl,
    Min,
    ValidateNested,
} from 'class-validator';
import { BibliothekDTO } from './bibliothekDTO.entity.js';
import { KursDTO } from './kursDTO.entity.js';

export class UniversitaetDtoOhneRef {
    @ApiProperty({ example: 'Technische Universitaet Muenchen', type: String })
    readonly name!: string;

    @ApiProperty({ example: 'Muenchen', type: String })
    readonly standort: string | undefined;

    @IsOptional()
    @Min(0)
    @ApiProperty({ example: 42_000, type: Number })
    readonly anzahlStudierende: number | undefined;

    @IsOptional()
    @IsUrl()
    @ApiProperty({ example: 'https://www.tum.de', type: String })
    readonly homepage: string | undefined;

    @IsOptional()
    @ApiProperty({ example: 1868, type: Number })
    readonly gegruendet: number | undefined;

    @IsOptional()
    @ArrayUnique()
    @ApiProperty({
        example: ['Informatik', 'Maschinenbau', 'Elektrotechnik'],
        type: [String],
    })
    readonly fakultaeten: string[] | null | undefined;

    @IsOptional()
    @IsInt()
    @ApiProperty({ example: 1, type: Number })
    readonly ranking: number | undefined;
}

export class UniversitaetDTO extends UniversitaetDtoOhneRef {
    @ValidateNested()
    @Type(() => BibliothekDTO)
    @ApiProperty({ type: BibliothekDTO })
    readonly bibliothek!: BibliothekDTO; // NOSONAR

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => KursDTO)
    @ApiProperty({ type: [KursDTO] })
    readonly kurse: KursDTO[] | undefined;
}
/* eslint-enable max-classes-per-file */
