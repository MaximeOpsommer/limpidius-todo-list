import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { TodolistService } from './todolist.service';
import { TodoListDTO } from './todolist.dto';
import { TodolistPayload } from './todolist.payload';
import { TodolistAuthGuard } from './todolist.auth.guard';

@Controller('/todolist')
export class TodolistController {
  constructor(private readonly todolistService: TodolistService) {}

  @UseGuards(TodolistAuthGuard)
  @Post('/')
  public create(
    @Body() todolistPayload: TodolistPayload,
  ): Promise<TodoListDTO> {
    return this.todolistService.create(todolistPayload);
  }
}
