import { TodoListItemStatus } from './todolist.schema';
import { AutoMap } from '@automapper/classes';

export class TodoListDTO {
  @AutoMap()
  id: number;

  @AutoMap()
  title: string;

  @AutoMap(() => TodoListItemDTO)
  items: TodoListItemDTO[];
}

export class TodoListItemDTO {
  @AutoMap()
  label: string;

  @AutoMap()
  status: TodoListItemStatus;
}
