import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AutoMap } from '@automapper/classes';
import { HydratedDocument } from 'mongoose';

export type TodoListDocument = HydratedDocument<TodoList>;

@Schema({ collection: 'todolist' })
export class TodoListItem {
  @Prop(Number)
  @AutoMap()
  id: number;

  @Prop({ type: String, trim: true })
  @AutoMap()
  label: string;

  @Prop(String)
  @AutoMap()
  status: TodoListItemStatus;
}

export const TodoListItemSchema = SchemaFactory.createForClass(TodoListItem);

@Schema({ collection: 'todolist' })
export class TodoList {
  @Prop(Number)
  @AutoMap()
  id: number;

  @Prop({ type: String, trim: true })
  @AutoMap()
  title: string;

  @Prop({
    type: [TodoListItemSchema],
  })
  @AutoMap(() => TodoListItem)
  items: TodoListItem[];

  @Prop(Date)
  createdAt: Date;

  @Prop(Date)
  updatedAt: Date;
}

export type TodoListItemStatus = 'TODO' | 'DONE';

export const TodoListSchema = SchemaFactory.createForClass(TodoList);
