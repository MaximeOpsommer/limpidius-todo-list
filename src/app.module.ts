import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TodolistModule } from './todolist/todolist.module';

@Module({
  imports: [
    TodolistModule,
    MongooseModule.forRoot('mongodb://localhost/todolist'),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
