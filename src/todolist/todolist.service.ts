import { Injectable } from '@nestjs/common';
import { TodoList, TodoListDocument, TodoListItem } from './todolist.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TodolistPayload } from './todolist.payload';
import { TodoListDTO, TodoListItemDTO } from './todolist.dto';
import { createMap } from '@automapper/core';
import { mapper } from './todolist.mapper';

@Injectable()
export class TodoListService {
  constructor(
    @InjectModel(TodoList.name) private todolistModel: Model<TodoListDocument>,
  ) {
    createMap(mapper, TodoList, TodoListDTO);
    createMap(mapper, TodoListItem, TodoListItemDTO);
  }

  async create(todoListPayload: TodolistPayload): Promise<TodoListDTO> {
    const createdTodolist = new this.todolistModel(todoListPayload);
    const date = new Date();
    createdTodolist.createdAt = date;
    createdTodolist.updatedAt = date;
    await createdTodolist.save();
    return mapper.map(createdTodolist.toObject(), TodoList, TodoListDTO);
  }
}
