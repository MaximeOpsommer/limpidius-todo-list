import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AutoMap } from '@automapper/classes';
import mongoose, { HydratedDocument } from 'mongoose';

export type TodoListDocument = HydratedDocument<TodoList>;
export type TodoListItemDocument = HydratedDocument<TodoListItem>;

@Schema()
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

@Schema()
export class TodoList {
  @Prop(Number)
  @AutoMap()
  id: number;

  @Prop({ type: String, trim: true })
  @AutoMap()
  title: string;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'TodoListItem' }],
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
export const TodoListItemSchema = SchemaFactory.createForClass(TodoListItem);
