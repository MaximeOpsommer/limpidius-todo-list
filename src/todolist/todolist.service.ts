import { Injectable, NotFoundException } from '@nestjs/common';
import {
  TodoList,
  TodoListDocument,
  TodoListItem,
  TodoListItemDocument,
} from './todolist.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TodolistPayload } from './todolist.payload';
import { TodoListDTO, TodoListItemDTO } from './todolist.dto';
import { createMap } from '@automapper/core';
import { mapper } from './todolist.mapper';

@Injectable()
export class TodolistService {
  constructor(
    @InjectModel(TodoList.name)
    private todoListModel: Model<TodoListDocument>,
    @InjectModel(TodoListItem.name)
    private todoListItemModel: Model<TodoListItemDocument>,
  ) {
    createMap(mapper, TodoList, TodoListDTO);
    createMap(mapper, TodoListItem, TodoListItemDTO);
  }

  async create(todoListPayload: TodolistPayload): Promise<TodoListDTO> {
    todoListPayload.items = todoListPayload.items.map((todoListItemPayload) => {
      const createdTodoListItem = new this.todoListItemModel(
        todoListItemPayload,
      );
      createdTodoListItem.save();
      return createdTodoListItem._id;
    });
    const createdTodolist = new this.todoListModel(todoListPayload);
    const date = new Date();
    createdTodolist.createdAt = date;
    createdTodolist.updatedAt = date;
    await createdTodolist.save();
    return this.getById(createdTodolist.id);
  }

  async list(): Promise<TodoListDTO[]> {
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
    const todoList = await this.todoListModel.findOne({ id: todoListId });
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
}
