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

/* eslint-disable @eslint-community/eslint-comments/disable-enable-pair */
/* eslint-disable max-lines-per-function */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { type GraphQLRequest } from '@apollo/server';
import { afterAll, beforeAll, describe, expect, test } from '@jest/globals';
import { HttpStatus } from '@nestjs/common';
import axios, { type AxiosInstance, type AxiosResponse } from 'axios';
import { type GraphQLFormattedError } from 'graphql';
import { type Universitaet } from '../../src/universitaet/entity/universitaet.entity.js';
import {
    host,
    httpsAgent,
    port,
    shutdownServer,
    startServer,
} from '../testserver.js';

export type GraphQLResponseBody = {
    data?: Record<string, any> | null;
    errors?: readonly [GraphQLFormattedError];
};

type UniversitaetDTO = Omit<Universitaet, 'kurse' | 'aktualisiert' | 'erzeugt'>;

// -----------------------------------------------------------------------------
// T e s t d a t e n
// -----------------------------------------------------------------------------
const idVorhanden = '1000';
const idNichtVorhanden = '999999';

// -----------------------------------------------------------------------------
// T e s t s
// -----------------------------------------------------------------------------
// Test-Suite
describe('GraphQL Queries', () => {
    let client: AxiosInstance;
    const graphqlPath = 'graphql';

    beforeAll(async () => {
        await startServer();
        const baseURL = `https://${host}:${port}/`;
        client = axios.create({
            baseURL,
            httpsAgent,
            validateStatus: () => true,
        });
    });

    afterAll(async () => {
        await shutdownServer();
    });

    test('Universitaet zu vorhandener ID', async () => {
        // given
        const body: GraphQLRequest = {
            query: `
                query {
                    universitaet(id: ${idVorhanden}) {
                        version
                        name
                        standort
                        anzahlStudierende
                        homepage
                        gegruendet
                        fakultaeten
                        ranking
                        bibliothek {
                            name
                        }
                    }
                }
            `,
        };

        // when
        const { status, headers, data }: AxiosResponse<GraphQLResponseBody> =
            await client.post(graphqlPath, body);

        // then
        expect(status).toBe(HttpStatus.OK);
        expect(headers['content-type']).toMatch(/json/iu);
        expect(data.errors).toBeUndefined();
        expect(data.data).toBeDefined();

        const { universitaet } = data.data!;
        const result: UniversitaetDTO = universitaet;

        expect(result.bibliothek?.name).toMatch(/^\w/u);
        expect(result.version).toBeGreaterThan(-1);
        expect(result.id).toBeUndefined();
    });

    test('Universitaet zu nicht-vorhandener ID', async () => {
        // given
        const body: GraphQLRequest = {
            query: `
                {
                    universitaet(id: "${idNichtVorhanden}") {
                        bibliothek {
                            name
                        }
                    }
                }
            `,
        };

        // when
        const { status, headers, data }: AxiosResponse<GraphQLResponseBody> =
            await client.post(graphqlPath, body);

        // then
        expect(status).toBe(HttpStatus.OK);
        expect(headers['content-type']).toMatch(/json/iu);
        expect(data.data!.universitaet).toBeNull();

        const { errors } = data;

        expect(errors).toHaveLength(1);

        const [error] = errors!;
        const { message, path, extensions } = error;

        expect(message).toBe(
            `Es gibt keine Universitaet mit der ID ${idNichtVorhanden}.`,
        );
        expect(path).toBeDefined();
        expect(path![0]).toBe('universitaet');
        expect(extensions).toBeDefined();
        expect(extensions!.code).toBe('BAD_USER_INPUT');
    });
});
