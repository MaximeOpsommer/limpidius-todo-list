import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { TodolistService } from './todolist.service';
import { TodoListDTO, TodoListItemDTO } from './todolist.dto';
import {
  TodoListCreatePayload,
  TodoListItemStatusPayload,
  TodoListUpdatePayload,
} from './todolist.payload';
import { TodoListAuthGuard } from './todolist.auth.guard';

@Controller('/todolist')
export class TodolistController {
  constructor(private readonly todolistService: TodolistService) {}

  @UseGuards(TodoListAuthGuard)
  @Post('/')
  public create(
    @Body() todolistPayload: TodoListCreatePayload,
  ): Promise<TodoListDTO> {
    return this.todolistService.create(todolistPayload);
  }

  @UseGuards(TodoListAuthGuard)
  @Patch('/:id')
  public update(
    @Param('id') todoListId: string,
    @Body() todoListUpdatePayload: TodoListUpdatePayload,
  ): Promise<TodoListDTO> {
    const id: number = parseInt(todoListId);
    if (isNaN(id)) {
      throw new BadRequestException(`Given todolist ID is not a number`);
    }
    return this.todolistService.update(id, todoListUpdatePayload);
  }

  @UseGuards()
  @Get('/')
  public list(): Promise<TodoListDTO[]> {
    return this.todolistService.list();
  }

  @UseGuards(TodoListAuthGuard)
  @Get('/:id')
  public getById(@Param('id') todoListId: string): Promise<TodoListDTO> {
    const id: number = parseInt(todoListId);
    if (isNaN(id)) {
      throw new BadRequestException(`Given todolist ID is not a number`);
    }
    return this.todolistService.getById(id);
  }

  @UseGuards(TodoListAuthGuard)
  @Delete('/:id')
  public delete(@Param('id') todolistId: string): Promise<TodoListDTO> {
    const id: number = parseInt(todolistId);
    if (isNaN(id)) {
      throw new BadRequestException(`Given todolist ID is not a number`);
    }
    return this.todolistService.delete(id);
  }

  @UseGuards(TodoListAuthGuard)
  @Patch('/:todoListId/item/:todoListItemId')
  public updateItemStatus(
    @Param('todoListId') todoListId: string,
    @Param('todoListItemId') todoListItemId: string,
    @Body() todoListItemStatusPayload: TodoListItemStatusPayload,
  ): Promise<TodoListItemDTO> {
    const tlId: number = parseInt(todoListId);
    if (isNaN(tlId)) {
      throw new BadRequestException(`Given todolist ID is not a number`);
    }
    const tliId: number = parseInt(todoListItemId);
    if (isNaN(tliId)) {
      throw new BadRequestException(`Given todolist item ID is not a number`);
    }
    return this.todolistService.updateItemStatus(
      tlId,
      tliId,
      todoListItemStatusPayload,
    );
  }
}
