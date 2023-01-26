import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TodolistModule } from './todolist/todolist.module';

@Module({
  imports: [
    TodolistModule,
    MongooseModule.forRoot('mongodb://localhost/todolist'),
  ],
})
export class AppModule {}
