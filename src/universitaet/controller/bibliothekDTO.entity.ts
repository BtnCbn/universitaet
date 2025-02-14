// Copyright (C) 2023 - present Juergen Zimmermann, Hochschule Karlsruhe
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
import { IsOptional } from 'class-validator';

export class BibliothekDTO {
    @ApiProperty({ example: 'Universitaetsbibliothek', type: String })
    readonly name!: string;

    @IsOptional()
    @ApiProperty({ example: 'DE-Mun1', type: String })
    readonly isil: string | undefined;
}
