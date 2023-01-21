import {
  IsArray,
  IsIn,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TodoListItemStatus } from './todolist.schema';
import { Transform, TransformFnParams, Type } from 'class-transformer';
import { Types } from 'mongoose';

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
  @Type(() => TodoListItemPayload)
  @ValidateNested()
  items: TodoListItemPayload[] | Types.ObjectId[];
}

export class TodoListItemPayload {
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

  @IsIn(['TODO', 'DONE'])
  @ApiProperty({
    name: 'status',
    description: 'The todolist item status',
    type: String,
    required: true,
  })
  status: TodoListItemStatus;
}
