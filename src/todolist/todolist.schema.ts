import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { AutoMap } from '@automapper/classes';

export type TodoListDocument = HydratedDocument<TodoList>;

@Schema()
export class TodoList {
  @Prop()
  @AutoMap()
  id: number;

  @Prop({ type: String, trim: true })
  @AutoMap()
  title: string;

  @Prop()
  @AutoMap(() => TodoListItem)
  items: TodoListItem[];

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export class TodoListItem {
  @Prop({ type: String, trim: true })
  @AutoMap()
  label: string;

  @Prop()
  @AutoMap()
  status: TodoListItemStatus;
}

export type TodoListItemStatus = 'TODO' | 'DONE';

export const TodoListSchema = SchemaFactory.createForClass(TodoList);
