import { Module } from '@nestjs/common';
import { getConnectionToken, MongooseModule } from '@nestjs/mongoose';
import { TodoList, TodoListSchema } from './todolist.schema';
import { TodolistController } from './todolist.controller';
import { TodoListService } from './todolist.service';
import { Connection } from 'mongoose';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { HeaderInterceptor } from '../app.header.interceptor';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: TodoList.name,
        useFactory: async (connection: Connection) => {
          const schema = TodoListSchema;
          // eslint-disable-next-line @typescript-eslint/no-var-requires
          const autoIncrement = require('mongoose-sequence')(connection);
          schema.plugin(autoIncrement, { inc_field: 'id' });
          return schema;
        },
        inject: [getConnectionToken()],
      },
    ]),
  ],
  controllers: [TodolistController],
  providers: [
    TodoListService,
    {
      provide: APP_INTERCEPTOR,
      useClass: HeaderInterceptor,
    },
  ],
})
export class TodolistModule {}
