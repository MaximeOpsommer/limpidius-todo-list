import {
  IsArray,
  IsDefined,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TodoListItemStatus } from './todolist.schema';
import { Type } from 'class-transformer';

export class TodolistPayload {
  @IsDefined()
  @IsString()
  @ApiProperty()
  title: string;

  @IsDefined()
  @IsArray()
  @IsNotEmpty()
  @Type(() => TodoListPayloadItem)
  @ValidateNested()
  items: TodoListPayloadItem[];
}

export class TodoListPayloadItem {
  @IsDefined()
  @IsString()
  @ApiProperty({
    name: 'label',
    description: 'The todolist item label',
    type: String,
    required: true,
  })
  label: string;

  @IsDefined()
  @IsString()
  @ApiProperty({
    name: 'status',
    description: 'The todolist item status',
    type: String,
    required: true,
  })
  status: TodoListItemStatus;
}
