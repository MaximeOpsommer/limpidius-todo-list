import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import {
  TodoList,
  TodoListDocument,
  TodoListItem,
  TodoListItemDocument,
} from './todolist.schema';
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
    @InjectModel(TodoListItem.name)
    private todoListItemModel: Model<TodoListItemDocument>,
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
    todoListCreatePayload.items = await Promise.all(
      todoListCreatePayload.items.map(async (todoListItemPayload) => {
        const createdTodoListItem = await this.todoListItemModel.create(
          todoListItemPayload,
        );
        createdTodoListItem.status = 'TODO';
        await createdTodoListItem.save();
        return createdTodoListItem._id;
      }),
    );
    const createdTodolist = await this.todoListModel.create(
      todoListCreatePayload,
    );
    const date = new Date();
    createdTodolist.createdAt = date;
    createdTodolist.updatedAt = date;
    await createdTodolist.save();
    return this.getById(createdTodolist.id);
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
    const updatedTodoList = await this.todoListModel
      .findOneAndUpdate({ id: todoListId }, todoListUpdatePayload)
      .exec();
    if (!updatedTodoList) {
      throw new NotFoundException(
        `TodoList with ID ${todoListId} does not exist`,
      );
    }
    return this.getById(todoListId);
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
      throw new NotFoundException(
        `TodoList with ID ${todoListId} does not exist`,
      );
    }
    return mapper.map(
      (await todoList.populate('items')).toObject(),
      TodoList,
      TodoListDTO,
    );
  }

  async delete(todoListId: number): Promise<TodoListDTO> {
    this.logger.debug(`Request to delete todolist with ID ${todoListId}`);
    const deletedTodoList = await this.todoListModel
      .findOneAndDelete({
        id: todoListId,
      })
      .exec();
    if (!deletedTodoList) {
      throw new NotFoundException(
        `TodoList with ID ${todoListId} does not exist`,
      );
    }
    const result = mapper.map(
      (await deletedTodoList.populate('items')).toObject(),
      TodoList,
      TodoListDTO,
    );
    deletedTodoList.items.forEach((item) => {
      this.todoListItemModel.findByIdAndDelete(item).exec();
    });
    return result;
  }

  async updateItemStatus(
    todoListId: number,
    todoListItemId: number,
    todoListItemStatusPayload: TodoListItemStatusPayload,
  ): Promise<TodoListItemDTO> {
    this.logger.debug(
      `Request to update todolist with ID ${todoListId} item with ID ${todoListItemId} status with payload ${JSON.stringify(
        todoListItemStatusPayload,
      )}`,
    );
    const todoList = await this.todoListModel
      .findOne({ id: todoListId })
      .populate('items')
      .exec();
    if (!todoList) {
      throw new NotFoundException(
        `TodoList with ID ${todoListId} does not exist`,
      );
    }
    if (!todoList.items.map((item) => item.id).includes(todoListItemId)) {
      throw new NotFoundException(
        `There is no item with ID ${todoListItemId} for todolist with ID ${todoListId}`,
      );
    }
    await this.todoListItemModel
      .updateOne(
        {
          id: todoListItemId,
        },
        todoListItemStatusPayload,
      )
      .exec();
    const updatedItem = await this.todoListItemModel
      .findOne({ id: todoListItemId })
      .exec();
    if (!updatedItem) {
      throw new NotFoundException(
        `TodoList item with ID ${todoListItemId} does not exist`,
      );
    }
    return mapper.map(updatedItem.toObject(), TodoListItem, TodoListItemDTO);
  }
}
