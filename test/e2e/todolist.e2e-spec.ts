import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { BEARER } from '../../src/app.constants';
import { TodoListCreatePayload } from '../../src/todolist/todolist.payload';
import { TodoListDTO } from '../../src/todolist/todolist.dto';
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
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Create a todolist', () => {
    const url = '/todolist';

    it('Should create a valid todolist', async () => {
      const payload =
        require('../payload/create-todolist-payload.json') as TodoListCreatePayload;
      const expected =
        require('../expected/created-todolist.json') as TodoListDTO;

      return request(app.getHttpServer())
        .post(url)
        .set('Authorization', BEARER)
        .send(payload)
        .expect((res) => {
          expect(res.status).toBe(201);
          expect(res.body.items).toHaveLength(2);
          expect(res.body).toEqual(expected);
        });
    });

    it('Should throw a 400 error when todolist title is null', () => {
      const payload = {
        title: null,
        items: [],
      };

      return request(app.getHttpServer())
        .post(url)
        .set('Authorization', BEARER)
        .send(payload)
        .expect(400);
    });

    it('Should throw a 400 error when todolist title is undefined', () => {
      const payload = {
        title: undefined,
        items: [],
      };

      return request(app.getHttpServer())
        .post(url)
        .set('Authorization', BEARER)
        .send(payload)
        .expect(400);
    });

    it('Should throw a 400 error when todolist title is empty', () => {
      const payload = {
        title: ' ',
        items: [],
      };

      return request(app.getHttpServer())
        .post(url)
        .set('Authorization', BEARER)
        .send(payload)
        .expect(400);
    });

    it('Should throw a 400 error when todolist item label is null', () => {
      const payload = {
        title: 'test',
        items: [
          {
            label: null,
            status: 'DONE',
          },
        ],
      };

      return request(app.getHttpServer())
        .post(url)
        .set('Authorization', BEARER)
        .send(payload)
        .expect(400);
    });

    it('Should throw a 400 error when todolist item label is undefined', () => {
      const payload = {
        title: 'test',
        items: [
          {
            label: undefined,
            status: 'DONE',
          },
        ],
      };

      return request(app.getHttpServer())
        .post(url)
        .set('Authorization', BEARER)
        .send(payload)
        .expect(400);
    });

    it('Should throw a 400 error when todolist item label is empty', () => {
      const payload = {
        title: 'test',
        items: [
          {
            label: ' ',
            status: 'DONE',
          },
        ],
      };

      return request(app.getHttpServer())
        .post(url)
        .set('Authorization', BEARER)
        .send(payload)
        .expect(400);
    });
  });
});
