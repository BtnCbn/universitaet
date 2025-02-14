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
/* eslint-disable max-lines-per-function */

import { afterAll, beforeAll, describe, expect, test } from '@jest/globals';
import { HttpStatus } from '@nestjs/common';
import axios, { type AxiosInstance, type AxiosResponse } from 'axios';
import type { UniversitaetDTO } from '../../src/universitaet/controller/universitaetDTO.entity.js';
import { UniversitaetReadService } from '../../src/universitaet/service/universitaet-read.service';
import {
    host,
    httpsAgent,
    port,
    shutdownServer,
    startServer,
} from '../testserver.js';
import { tokenRest } from '../token.js';

// -----------------------------------------------------------------------------
// T e s t d a t e n
// -----------------------------------------------------------------------------
const neueUniversitaet: UniversitaetDTO = {
    name: 'Technische Universitaet Berlin',
    standort: 'Berlin',
    anzahlStudierende: 35_000,
    homepage: 'https://www.tu-berlin.de',
    gegruendet: 1879,
    fakultaeten: ['Informatik', 'Maschinenbau', 'Elektrotechnik'],
    ranking: 2,
    bibliothek: {
        name: 'Universitaetsbibliothek',
        isil: 'DE-Ber1',
    },
    kurse: [
        {
            titel: 'Einführung in die Informatik',
            startDatum: new Date(`2023-04-01`),
        },
        {
            titel: 'Maschinelles Lernen',
            startDatum: new Date(`2023-04-01`),
        },
    ],
};

const neueUniversitaetInvalid: UniversitaetDTO = {
    name: '', // Leerer Name - sollte nicht erlaubt sein
    standort: 'Berlin',
    anzahlStudierende: -1000, // Verletzt @Min(0)
    homepage: 'keine-gueltige-url', // Verletzt @IsUrl
    gegruendet: 1879,
    fakultaeten: ['Informatik', 'Maschinenbau', 'Elektrotechnik'],
    ranking: 2.5, // Verletzt @IsInt
    bibliothek: {
        name: '', // Leerer Name - sollte nicht erlaubt sein
        isil: '', // Leerer ISIL
    },
    kurse: [
        {
            titel: '', // Leerer Titel
            startDatum: new Date('invalid-date'), // Ungültiges Datum
        },
    ],
};

// -----------------------------------------------------------------------------
// T e s t s
// -----------------------------------------------------------------------------
// Test-Suite
describe('POST /rest', () => {
    let client: AxiosInstance;
    const headers: Record<string, string> = {
        'Content-Type': 'application/json', // eslint-disable-line @typescript-eslint/naming-convention
    };

    // Testserver starten und dabei mit der DB verbinden
    beforeAll(async () => {
        await startServer();
        const baseURL = `https://${host}:${port}`;
        client = axios.create({
            baseURL,
            httpsAgent,
            validateStatus: (status) => status < 500, // eslint-disable-line @typescript-eslint/no-magic-numbers
        });
    });

    afterAll(async () => {
        await shutdownServer();
    });

    test('Neue Universitaet anlegen', async () => {
        // given
        const token = await tokenRest(client);
        headers.Authorization = `Bearer ${token}`;

        // when
        const response: AxiosResponse<string> = await client.post(
            '/rest',
            neueUniversitaet,
            { headers },
        );

        // then
        const { status, data } = response;

        expect(status).toBe(HttpStatus.CREATED);

        const { location } = response.headers as { location: string };

        expect(location).toBeDefined();

        // ID nach dem letzten "/"
        const indexLastSlash: number = location.lastIndexOf('/');

        expect(indexLastSlash).not.toBe(-1);

        const idStr = location.slice(indexLastSlash + 1);

        expect(idStr).toBeDefined();
        expect(UniversitaetReadService.ID_PATTERN.test(idStr)).toBe(true);

        expect(data).toBe('');
    });

    test('Neue Universitaet anlegen - ungueltige Daten', async () => {
        // given
        const token = await tokenRest(client);
        headers.Authorization = `Bearer ${token}`;

        const expectedMsg = [
            expect.stringMatching(/^anzahlStudierende /u),
            expect.stringMatching(/^homepage /u),
            expect.stringMatching(/^ranking /u),
        ];

        // when
        const response: AxiosResponse<Record<string, any>> = await client.post(
            '/rest',
            neueUniversitaetInvalid,
            { headers },
        );

        // then
        const { status, data } = response;

        expect(status).toBe(HttpStatus.UNPROCESSABLE_ENTITY);

        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const messages: string[] = data.message;

        expect(messages).toBeDefined();
        expect(messages).toHaveLength(expectedMsg.length);
        expect(messages).toEqual(expect.arrayContaining(expectedMsg));
    });
});
