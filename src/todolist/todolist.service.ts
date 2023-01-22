import { Injectable } from '@nestjs/common';
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
    return mapper.map(
      (await createdTodolist.populate('items')).toObject(),
      TodoList,
      TodoListDTO,
    );
  }
}
