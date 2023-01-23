import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { BEARER } from '../../src/app.constants';
import {
  TodoListCreatePayload,
  TodoListItemStatusPayload,
  TodoListUpdatePayload,
} from '../../src/todolist/todolist.payload';
import { TodoListDTO, TodoListItemDTO } from '../../src/todolist/todolist.dto';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import setTimeout = jest.setTimeout;

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
        .expect(HttpStatus.CREATED)
        .expect(expected);
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
        .expect(HttpStatus.BAD_REQUEST);
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
        .expect(HttpStatus.BAD_REQUEST);
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
        .expect(HttpStatus.BAD_REQUEST);
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
        .expect(HttpStatus.BAD_REQUEST);
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
        .expect(HttpStatus.BAD_REQUEST);
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
        .expect(HttpStatus.BAD_REQUEST);
    });
  });

  describe('Update a todolist', () => {
    const todoListId = 1;
    const url = `/todolist/${todoListId}`;

    it('Should update a todolist', async () => {
      const payload =
        require('../payload/update-todolist-payload.json') as TodoListUpdatePayload;
      const expected =
        require('../expected/updated-todolist.json') as TodoListDTO;

      return request(app.getHttpServer())
        .patch(url)
        .set('Authorization', BEARER)
        .send(payload)
        .expect(HttpStatus.OK)
        .expect(expected);
    });

    it('Should throw a 400 error when todolist title is null', () => {
      const payload = {
        title: null,
        items: [],
      };

      return request(app.getHttpServer())
        .patch(url)
        .set('Authorization', BEARER)
        .send(payload)
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('Should throw a 400 error when todolist title is undefined', () => {
      const payload = {
        title: undefined,
        items: [],
      };

      return request(app.getHttpServer())
        .patch(url)
        .set('Authorization', BEARER)
        .send(payload)
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('Should throw a 400 error when todolist title is empty', () => {
      const payload = {
        title: ' ',
        items: [],
      };

      return request(app.getHttpServer())
        .patch(url)
        .set('Authorization', BEARER)
        .send(payload)
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('Should throw a 400 error when given ID is not a number', () => {
      const payload = {
        title: 'test',
        items: [],
      };

      return request(app.getHttpServer())
        .patch('/todolist/invalid-id')
        .set('Authorization', BEARER)
        .send(payload)
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('Should throw a 404 error when given ID does not exist', () => {
      const payload = {
        title: 'test',
        items: [],
      };

      return request(app.getHttpServer())
        .patch('/todolist/10')
        .set('Authorization', BEARER)
        .send(payload)
        .expect(HttpStatus.NOT_FOUND);
    });
  });

  describe('List all todolists', () => {
    const url = '/todolist';

    it('Should list all todolists', async () => {
      const expected =
        require('../expected/updated-todolist.json') as TodoListDTO;

      return request(app.getHttpServer())
        .get(url)
        .set('Authorization', BEARER)
        .expect(HttpStatus.OK)
        .expect([expected]);
    });
  });

  describe('Get todolist by ID', () => {
    const todoListId = 1;
    const url = `/todolist/${todoListId}`;

    it('Should retrieve todolist', async () => {
      const expected =
        require('../expected/updated-todolist.json') as TodoListDTO;

      return request(app.getHttpServer())
        .get(url)
        .set('Authorization', BEARER)
        .expect(HttpStatus.OK)
        .expect(expected);
    });

    it('Should throw a 400 error when given ID is not a number', () => {
      return request(app.getHttpServer())
        .get('/todolist/invalid-id')
        .set('Authorization', BEARER)
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('Should throw a 404 error when given ID does not exist', () => {
      return request(app.getHttpServer())
        .get('/todolist/10')
        .set('Authorization', BEARER)
        .expect(HttpStatus.NOT_FOUND);
    });
  });

  describe('Update item status', () => {
    const todoListId = 1;
    const todoListItemId = 2;
    const url = `/todolist/${todoListId}/item/${todoListItemId}`;
    const payload =
      require('../payload/update-todolist-item-status-payload.json') as TodoListItemStatusPayload;

    it('Should update todolist item status', async () => {
      const expected =
        require('../expected/updated-todolist-item-status.json') as TodoListItemDTO;

      return request(app.getHttpServer())
        .patch(url)
        .set('Authorization', BEARER)
        .send(payload)
        .expect(HttpStatus.OK)
        .expect(expected);
    });

    it('Should throw a 400 error when given todolist ID is not a number', () => {
      return request(app.getHttpServer())
        .patch('/todolist/invalid-id/item/1')
        .set('Authorization', BEARER)
        .send(payload)
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('Should throw a 400 error when given todolist item ID is not a number', () => {
      return request(app.getHttpServer())
        .patch('/todolist/1/item/invalid-item')
        .set('Authorization', BEARER)
        .send(payload)
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('Should throw a 400 error when given status is invalid', () => {
      return request(app.getHttpServer())
        .patch('/todolist/1/item/1')
        .set('Authorization', BEARER)
        .send({ status: 'INVALID' })
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('Should throw a 404 error when given todolist ID does not exist', () => {
      return request(app.getHttpServer())
        .patch('/todolist/10/item/1')
        .set('Authorization', BEARER)
        .send(payload)
        .expect(HttpStatus.NOT_FOUND);
    });

    it('Should throw a 404 error when given todolist item ID does not exist', () => {
      return request(app.getHttpServer())
        .patch('/todolist/1/item/10')
        .set('Authorization', BEARER)
        .send(payload)
        .expect(HttpStatus.NOT_FOUND);
    });
  });

  describe('Delete todolist', () => {
    it('Should delete a todolist', async () => {
      const expected =
        require('../expected/deleted-todolist.json') as TodoListDTO;

      const createPayload = require('../payload/create-todolist-to-delete-payload.json');
      await request(app.getHttpServer())
        .post('/todolist')
        .set('Authorization', BEARER)
        .send(createPayload);

      setTimeout(2000);

      return request(app.getHttpServer())
        .delete('/todolist/2')
        .set('Authorization', BEARER)
        .expect(HttpStatus.OK)
        .expect(expected);
    });

    it('Should throw a 400 error when given ID is not a number', () => {
      return request(app.getHttpServer())
        .delete('/todolist/invalid-id')
        .set('Authorization', BEARER)
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('Should throw a 404 error when given ID does not exist', () => {
      return request(app.getHttpServer())
        .delete('/todolist/10')
        .set('Authorization', BEARER)
        .expect(HttpStatus.NOT_FOUND);
    });
  });
});
