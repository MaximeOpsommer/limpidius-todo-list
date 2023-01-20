import { IsArray, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TodoListItemStatus } from './todolist.schema';
import { Transform, TransformFnParams, Type } from 'class-transformer';

export class TodolistPayload {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    name: 'title',
    description: 'The todolist title',
    type: String,
    required: true,
  })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  title: string;

  @IsArray()
  @Type(() => TodoListPayloadItem)
  @ValidateNested()
  items: TodoListPayloadItem[];
}

export class TodoListPayloadItem {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    name: 'label',
    description: 'The todolist item label',
    type: String,
    required: true,
  })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  label: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    name: 'status',
    description: 'The todolist item status',
    type: String,
    required: true,
  })
  status: TodoListItemStatus;
}
