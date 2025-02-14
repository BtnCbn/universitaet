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

import { afterAll, beforeAll, describe, expect, test } from '@jest/globals';
import { HttpStatus } from '@nestjs/common';
import axios, { type AxiosInstance, type AxiosResponse } from 'axios';
import type { UniversitaetModel } from '../../src/universitaet/controller/universitaet-get.controller.js';
import {
    host,
    httpsAgent,
    port,
    shutdownServer,
    startServer,
} from '../testserver.js';
import type { ErrorResponse } from './error-response.js';

// -----------------------------------------------------------------------------
// T e s t d a t e n
// -----------------------------------------------------------------------------
const idVorhanden = '1000';
const idNichtVorhanden = '999';
const idVorhandenETag = '1000';
const idFalsch = 'abc';

// -----------------------------------------------------------------------------
// T e s t s
// -----------------------------------------------------------------------------
// Test-Suite
// eslint-disable-next-line max-lines-per-function
describe('GET /rest/:id', () => {
    let client: AxiosInstance;

    // Testserver starten und dabei mit der DB verbinden
    beforeAll(async () => {
        await startServer();
        const baseURL = `https://${host}:${port}/rest`;
        client = axios.create({
            baseURL,
            httpsAgent,
            validateStatus: (status) => status < 500, // eslint-disable-line @typescript-eslint/no-magic-numbers
        });
    });

    afterAll(async () => {
        await shutdownServer();
    });

    test(`Universitaet zu vorhandener Id`, async () => {
        // given
        const url = `/${idVorhanden}`;

        // when
        const { status, headers, data }: AxiosResponse<UniversitaetModel> =
            await client.get(url);

        // then
        expect(status).toBe(HttpStatus.OK);
        expect(headers['content-type']).toMatch(/json/iu);

        // eslint-disable-next-line no-underscore-dangle
        const selfLink = data._links.self.href;

        // eslint-disable-next-line security-node/non-literal-reg-expr
        expect(selfLink).toMatch(new RegExp(`${url}$`, 'u'));
    });

    test(`Keine Universitaet zu nicht vorhandener Id`, async () => {
        // given
        const url = `/${idNichtVorhanden}`;

        // when
        const { status, data }: AxiosResponse<ErrorResponse> =
            await client.get(url);

        // then
        expect(status).toBe(HttpStatus.NOT_FOUND);

        const { error, message, statusCode } = data;

        expect(error).toBe(`Not Found`);
        expect(message).toEqual(expect.stringContaining(message));
        expect(statusCode).toBe(HttpStatus.NOT_FOUND);
    });

    test(`Keine Universitaet zu falscher Id`, async () => {
        // given
        const url = `/${idFalsch}`;

        // when
        const { status, data }: AxiosResponse<ErrorResponse> =
            await client.get(url);

        // then
        expect(status).toBe(HttpStatus.NOT_FOUND);

        const { error, statusCode } = data;

        expect(error).toBe(`Not Found`);
        expect(statusCode).toBe(HttpStatus.NOT_FOUND);
    });

    test('Universitaet zu vorhandener ID mit ETag', async () => {
        // given
        const url = `/${idVorhandenETag}`;

        // when
        const { status, data }: AxiosResponse<string> = await client.get(url, {
            headers: { 'If-None-Match': '"1"' }, // eslint-disable-line @typescript-eslint/naming-convention
        });

        // then
        expect(status).toBe(HttpStatus.NOT_MODIFIED);
        expect(data).toBe('');
    });
});
