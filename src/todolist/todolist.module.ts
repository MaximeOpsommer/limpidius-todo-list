import { Module } from '@nestjs/common';
import { getConnectionToken, MongooseModule } from '@nestjs/mongoose';
import {
  TodoList,
  TodoListItem,
  TodoListItemSchema,
  TodoListSchema,
} from './todolist.schema';
import { TodolistController } from './todolist.controller';
import { TodolistService } from './todolist.service';
import { Connection } from 'mongoose';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { HeaderInterceptor } from '../app.header.interceptor';
import { TodolistAuthGuard } from './todolist.auth.guard';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: TodoList.name,
        useFactory: async (connection: Connection) => {
          const schema = TodoListSchema;
          const autoIncrement = require('mongoose-sequence')(connection);
          schema.plugin(autoIncrement, {
            id: 'todolist-sequence',
            inc_field: 'id',
          });
          return schema;
        },
        inject: [getConnectionToken()],
      },
      {
        name: TodoListItem.name,
        useFactory: async (connection: Connection) => {
          const schema = TodoListItemSchema;
          const autoIncrement = require('mongoose-sequence')(connection);
          schema.plugin(autoIncrement, {
            id: 'todolistitem-sequence',
            inc_field: 'id',
          });
          return schema;
        },
        inject: [getConnectionToken()],
      },
    ]),
  ],
  controllers: [TodolistController],
  providers: [
    TodolistService,
    {
      provide: APP_INTERCEPTOR,
      useClass: HeaderInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: TodolistAuthGuard,
    },
  ],
})
export class TodolistModule {}
