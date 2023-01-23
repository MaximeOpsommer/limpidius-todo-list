import { TodolistController } from '../../src/todolist/todolist.controller';
import { Test, TestingModule } from '@nestjs/testing';
import { TodolistService } from '../../src/todolist/todolist.service';
import { TodoListCreatePayload } from '../../src/todolist/todolist.payload';
import { TodoListDTO } from '../../src/todolist/todolist.dto';

describe('TodolistController', () => {
  let todolistController: TodolistController;
  const fakeTodolistService = {
    create: (todoListPayload: TodoListCreatePayload): Promise<TodoListDTO> => {
      const todolist =
        require('../expected/created-todolist.json') as TodoListDTO;
      return Promise.resolve(todolist);
    },
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [TodolistController],
      providers: [TodolistService],
    })
      .overrideProvider(TodolistService)
      .useValue(fakeTodolistService)
      .compile();

    todolistController = app.get<TodolistController>(TodolistController);
  });

  describe('create', () => {
    const payload =
      require('../payload/create-todolist-payload.json') as TodoListCreatePayload;

    it('Should call todolist service', () => {
      const expected =
        require('../expected/created-todolist.json') as TodoListDTO;
      const serviceSpy = jest.spyOn(fakeTodolistService, 'create');
      return todolistController.create(payload).then((result) => {
        expect(serviceSpy).toHaveBeenCalledWith(payload);
        expect(result).toEqual(expected);
      });
    });
  });
});
