// Copyright (C) 2016 - present Juergen Zimmermann, Hochschule Karlsruhe
// Copyright (C) 2024 - present Botan Coban

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

import { type INestApplication, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
    DocumentBuilder,
    type SwaggerCustomOptions,
    SwaggerModule,
} from '@nestjs/swagger';
import compression from 'compression';
import { AppModule } from './app.module.js';
import { corsOptions } from './config/cors.js';
import { nodeConfig } from './config/node.js';
import { paths } from './config/paths.js';
import { helmetHandlers } from './security/http/helmet.handler.js';

const { httpsOptions, port } = nodeConfig;

const setupSwagger = (app: INestApplication) => {
    const config = new DocumentBuilder()
        .setTitle('Universität')
        .setDescription('Universität REST API Gruppe 1')
        .setVersion('2024.11.1')
        .addBearerAuth()
        .build();
    const document = SwaggerModule.createDocument(app, config);
    const options: SwaggerCustomOptions = { customSiteTitle: 'SWE 24/25' };
    SwaggerModule.setup(paths.swagger, app, document, options);
};

const bootstrap = async () => {
    const app = await NestFactory.create(AppModule, { httpsOptions });
    app.use(helmetHandlers, compression());
    app.useGlobalPipes(new ValidationPipe());
    setupSwagger(app);
    app.enableCors(corsOptions);
    await app.listen(port);
};

await bootstrap();
