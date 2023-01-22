import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
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

  @UseGuards(TodolistAuthGuard)
  @Get('/:id')
  public getById(@Param('id') todolistId: string): Promise<TodoListDTO> {
    const id: number = parseInt(todolistId);
    if (isNaN(id)) {
      throw new BadRequestException(`Given todolist ID is not a number`);
    }
    return this.todolistService.getById(id);
  }

  @UseGuards(TodolistAuthGuard)
  @Delete('/:id')
  public delete(@Param('id') todolistId: string): Promise<TodoListDTO> {
    const id: number = parseInt(todolistId);
    if (isNaN(id)) {
      throw new BadRequestException(`Given todolist ID is not a number`);
    }
    return this.todolistService.delete(id);
  }
}
