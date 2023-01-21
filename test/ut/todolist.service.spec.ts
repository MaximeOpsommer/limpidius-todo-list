import { TodolistService } from '../../src/todolist/todolist.service';
import { Test, TestingModule } from '@nestjs/testing';
import { TodolistPayload } from '../../src/todolist/todolist.payload';
import { TodoListDTO } from '../../src/todolist/todolist.dto';
import { Model } from 'mongoose';
import { TodoListDocument } from '../../src/todolist/todolist.schema';

describe('TodolistService', () => {
  let todolistService: TodolistService;
  let todolistModel: Model<TodoListDocument>;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [TodolistService, Model],
    }).compile();
    todolistService = app.get<TodolistService>(TodolistService);
    todolistModel = app.get<Model<TodoListDocument>>(Model<TodoListDocument>);
  });

  describe('create', () => {
    const payload =
      require('../payload/create-todolist-payload.json') as TodolistPayload;

    it('Should create todolist', () => {
      const expected =
        require('../expected/created-todolist.json') as TodoListDTO;
      return todolistService.create(payload).then((result) => {
        expect(Model).toHaveBeenCalledWith(payload);
        expect(result).toEqual(expected);
        // https://github.com/nestjsx/automapper/blob/master/test/automapper.test.ts
      });
    });
  });
});
