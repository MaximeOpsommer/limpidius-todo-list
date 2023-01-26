import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { TodoList, TodoListDocument, TodoListItem } from './todolist.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  TodoListCreatePayload,
  TodoListItemStatusPayload,
  TodoListUpdatePayload,
} from './todolist.payload';
import { TodoListDTO, TodoListItemDTO } from './todolist.dto';
import { createMap } from '@automapper/core';
import { mapper } from './todolist.mapper';

@Injectable()
export class TodolistService {
  private readonly logger = new Logger(TodolistService.name);

  constructor(
    @InjectModel(TodoList.name)
    private todoListModel: Model<TodoListDocument>,
  ) {
    createMap(mapper, TodoList, TodoListDTO);
    createMap(mapper, TodoListItem, TodoListItemDTO);
  }

  async create(
    todoListCreatePayload: TodoListCreatePayload,
  ): Promise<TodoListDTO> {
    this.logger.debug(
      `Request to create todolist with payload ${JSON.stringify(
        todoListCreatePayload,
      )}`,
    );
    const createdTodolist = await this.todoListModel.create(
      todoListCreatePayload,
    );
    createdTodolist.items.forEach((item) => {
      item.status = 'TODO';
    });
    const date = new Date();
    createdTodolist.createdAt = date;
    createdTodolist.updatedAt = date;
    await createdTodolist.save();
    return mapper.map(createdTodolist.toObject(), TodoList, TodoListDTO);
  }

  async update(
    todoListId: number,
    todoListUpdatePayload: TodoListUpdatePayload,
  ): Promise<TodoListDTO> {
    this.logger.debug(
      `Request to update todolist with payload ${JSON.stringify(
        todoListUpdatePayload,
      )}`,
    );
    const todoList = await this.todoListModel
      .findOne({ id: todoListId })
      .exec();
    if (!todoList) {
      this.logger.error(
        `Tried to update todolist with ID ${todoListId} but it doesn't exist`,
      );
      throw new NotFoundException(
        `TodoList with ID ${todoListId} does not exist`,
      );
    }
    const itemIds = todoList.items.map((item) => item.id);
    const itemPayloadIds = todoListUpdatePayload.items
      .map((item) => item.id)
      .filter((itemId) => itemId !== undefined);
    const notExistingItemIds = itemPayloadIds.filter(
      (i) => !itemIds.includes(i!),
    );

    if (notExistingItemIds.length) {
      this.logger.error(
        `Tried to update todolist with ID ${todoListId} and given payload ${JSON.stringify(
          todoListUpdatePayload,
        )}, but following item ids doesn't exist ${notExistingItemIds}`,
      );
      throw new NotFoundException(
        `TodoList with ID ${todoListId} does not contain item with ID ${notExistingItemIds}`,
      );
    }

    todoListUpdatePayload.items.forEach((itemPayload) => {
      const item = todoList.items.find((item) => item.id === itemPayload.id);
      item!.label = itemPayload.label;
    });

    todoList.title = todoListUpdatePayload.title;
    todoList.updatedAt = new Date();
    await todoList.save();
    return mapper.map(todoList.toObject(), TodoList, TodoListDTO);
  }

  async list(): Promise<TodoListDTO[]> {
    this.logger.debug(`Request to fetch todolists`);
    const list = await this.todoListModel.find().exec();
    return await Promise.all(
      list.map(async (todolist) => {
        return mapper.map(
          (await todolist.populate('items')).toObject(),
          TodoList,
          TodoListDTO,
        );
      }),
    );
  }

  async getById(todoListId: number): Promise<TodoListDTO> {
    this.logger.debug(`Request to get todolist by ID ${todoListId}`);
    const todoList = await this.todoListModel
      .findOne({ id: todoListId })
      .exec();
    if (!todoList) {
      this.logger.error(
        `Tried to get todolist with ID ${todoListId} but it doesn't exist`,
      );
      throw new NotFoundException(
        `TodoList with ID ${todoListId} does not exist`,
      );
    }
    return mapper.map(todoList.toObject(), TodoList, TodoListDTO);
  }

  async delete(todoListId: number): Promise<TodoListDTO> {
    this.logger.debug(`Request to delete todolist with ID ${todoListId}`);
    const deletedTodoList = await this.todoListModel
      .findOneAndDelete({ id: todoListId })
      .exec();
    if (!deletedTodoList) {
      this.logger.error(
        `Tried to delete todolist with ID ${todoListId} but it doesn't exist`,
      );
      throw new NotFoundException(
        `TodoList with ID ${todoListId} does not exist`,
      );
    }
    return mapper.map(deletedTodoList.toObject(), TodoList, TodoListDTO);
  }

  async updateItemStatus(
    todoListId: number,
    todoListItemId: number,
    todoListItemStatusPayload: TodoListItemStatusPayload,
  ): Promise<TodoListDTO> {
    this.logger.debug(
      `Request to update todolist with ID ${todoListId} item with ID ${todoListItemId} status with payload ${JSON.stringify(
        todoListItemStatusPayload,
      )}`,
    );
    const todoList = await this.todoListModel
      .findOne({ id: todoListId, 'items.id': todoListItemId })
      .exec();
    if (!todoList) {
      this.logger.error(
        `Tried to update todolist item status with ID ${todoListId} but todoList with ID ${todoListId} does not exist`,
      );
      throw new NotFoundException(
        `TodoList with ID ${todoListId} does not exist`,
      );
    }
    const todoListItem = todoList.items.find(
      (item) => item.id === todoListItemId,
    );
    if (!todoListItem) {
      this.logger.error(
        `Tried to update todolist item status with ID ${todoListItemId} but it doesn't exist`,
      );
      throw new NotFoundException(
        `There is no item with ID ${todoListItemId} for todolist with ID ${todoListId}`,
      );
    }
    todoListItem!.status = todoListItemStatusPayload.status;
    await todoList.save();
    return mapper.map(todoList.toObject(), TodoList, TodoListDTO);
  }
}
