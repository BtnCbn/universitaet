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

export class KursDTO {
    @ApiProperty({ example: 'Einfuehrung in die Informatik', type: String })
    readonly titel!: string;

    @IsOptional()
    @ApiProperty({ example: '2023-04-01', type: String })
    readonly startDatum: Date | undefined;
}
