import {
  IsArray,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TodoListItemStatus } from './todolist.schema';
import { Transform, TransformFnParams, Type } from 'class-transformer';
import { Types } from 'mongoose';

export class TodoListCreatePayload {
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
  @Type(() => TodoListItemCreatePayload)
  @ValidateNested()
  items: TodoListItemCreatePayload[] | Types.ObjectId[];
}

export class TodoListUpdatePayload {
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
}

export class TodoListItemCreatePayload {
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
}

export class TodoListItemUpdatedPayload extends TodoListItemCreatePayload {
  @IsOptional()
  @IsPositive()
  @ApiPropertyOptional({
    name: 'id',
    description: 'The todolist item id',
    type: Number,
    required: false,
  })
  id: number;
}

export class TodoListItemStatusPayload {
  @IsIn(['TODO', 'DONE'])
  @ApiProperty({
    name: 'status',
    description: 'The todolist item status',
    type: String,
    required: true,
  })
  status: TodoListItemStatus;
}
