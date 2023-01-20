import { Body, Controller, Post } from '@nestjs/common';
import { TodoListService } from './todolist.service';
import { TodoListDTO } from './todolist.dto';
import { TodolistPayload } from './todolist.payload';

@Controller('/todolist')
export class TodolistController {
  constructor(private readonly todolistService: TodoListService) {}

  @Post('/')
  public create(@Body() todolistPayload: TodolistPayload): Promise<TodoListDTO> {
    return this.todolistService.create(todolistPayload);
  }
}
