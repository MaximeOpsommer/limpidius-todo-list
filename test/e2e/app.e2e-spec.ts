import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { BEARER } from '../../src/app.constants';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRootAsync({
          useFactory: async () => {
            const mongoMS = await MongoMemoryServer.create();
            return {
              uri: mongoMS.getUri(),
            };
          },
        }),
        AppModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .set('Authorization', BEARER)
      .expect(200)
      .expect('Hello World!');
  });

  it('Should return 403 when Bearer is not valid', () => {
    return request(app.getHttpServer())
      .get('/')
      .set('Authorization', 'Bearer limpidius_invalid_secret_api_key')
      .expect(403);
  });
});
