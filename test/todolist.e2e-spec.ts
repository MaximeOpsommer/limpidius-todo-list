import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { BEARER } from '../src/app.constants';
import { TodolistPayload } from '../src/todolist/todolist.payload';
import { TodoListDTO } from '../src/todolist/todolist.dto';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

describe('TodoListController (e2e)', () => {
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

  describe('Create a todolist', () => {
    const url = '/todolist';

    it('Create a valid todolist', () => {
      const payload =
        require('./payload/create-todolist-payload.json') as TodolistPayload;
      const expected =
        require('./expected/created-todolist.json') as TodoListDTO;

      return request(app.getHttpServer())
        .post(url)
        .set('Authorization', BEARER)
        .send(payload)
        .expect(201)
        .expect(expected);
    });
  });
});
