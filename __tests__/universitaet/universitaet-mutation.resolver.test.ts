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

import { type GraphQLRequest } from '@apollo/server';
import { afterAll, beforeAll, describe, expect, test } from '@jest/globals';
import { HttpStatus } from '@nestjs/common';
import axios, { type AxiosInstance, type AxiosResponse } from 'axios';
import {
    host,
    httpsAgent,
    port,
    shutdownServer,
    startServer,
} from '../testserver.js';
import { tokenGraphQL } from '../token.js';
import { type GraphQLResponseBody } from './universitaet-query.resolver.test.js';

export type GraphQLQuery = Pick<GraphQLRequest, 'query'>;

// -----------------------------------------------------------------------------
// T e s t s
// -----------------------------------------------------------------------------
// Test-Suite
describe('GraphQL Mutations', () => {
    let client: AxiosInstance;
    const graphqlPath = 'graphql';

    beforeAll(async () => {
        await startServer();
        const baseURL = `https://${host}:${port}/`;
        client = axios.create({
            baseURL,
            httpsAgent,
        });
    });

    afterAll(async () => {
        await shutdownServer();
    });

    // -------------------------------------------------------------------------
    test('Neue Universität', async () => {
        // given
        const token = await tokenGraphQL(client);
        // eslint-disable-next-line @typescript-eslint/naming-convention
        const authorization = { Authorization: `Bearer ${token}` };
        const body: GraphQLQuery = {
            query: `
                mutation {
                    create(
                        input: {
                            name: "Technische Universitaet Berlin",
                            standort: "Berlin",
                            anzahlStudierende: 35000,
                            homepage: "https://www.tu-berlin.de",
                            gegruendet: 1879,
                            fakultaeten: ["Informatik", "Maschinenbau", "Elektrotechnik"],
                            ranking: 2,
                            bibliothek: {
                                name: "Universitaetsbibliothek",
                                isil: "DE-Ber1"
                            },
                            kurse: [
                                {
                                    titel: "Einführung in die Informatik",
                                    startDatum: "2023-04-01"
                                },
                                {
                                    titel: "Maschinelles Lernen",
                                    startDatum: "2023-04-01"
                                }
                            ]
                        }
                    ) {
                        id
                    }
                }
            `,
        };

        // when
        const { status, headers, data }: AxiosResponse<GraphQLResponseBody> =
            await client.post(graphqlPath, body, { headers: authorization });

        // then
        expect(status).toBe(HttpStatus.OK);
        expect(headers['content-type']).toMatch(/json/iu);
        expect(data.data).toBeDefined();

        const { create } = data.data!;

        expect(create).toBeDefined();
        expect(create.id).toBeGreaterThan(0);
    });
});
