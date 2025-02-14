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

// eslint-disable-next-line @eslint-community/eslint-comments/disable-enable-pair
/* eslint-disable max-classes-per-file */
import { HttpException, HttpStatus } from '@nestjs/common';

/**
 * Das Modul besteht aus Klassen für die Fehlerbehandlung von universitäten.
 * @packageDocumentation
 */

/**
 * Exception, die geworfen wird, wenn eine Universität mit einem bestimmten Namen bereits existiert.
 */
export class NameExistsException extends HttpException {
    constructor(readonly universityName: string) {
        super(
            `Universität ${universityName} existiert bereits`,
            HttpStatus.UNPROCESSABLE_ENTITY,
        );
    }
}

/**
 * Exception-Klasse für eine ungültige Versionsnummer beim Ändern.
 */
export class VersionInvalidException extends HttpException {
    constructor(readonly version: string | undefined) {
        super(
            `Die Versionsnummer ${version} ist ungueltig.`,
            HttpStatus.PRECONDITION_FAILED,
        );
    }
}

/**
 * Exception-Klasse für eine veraltete Versionsnummer beim Ändern.
 */
export class VersionOutdatedException extends HttpException {
    constructor(readonly version: number) {
        super(
            `Die Versionsnummer ${version} ist nicht aktuell.`,
            HttpStatus.PRECONDITION_FAILED,
        );
    }
}
