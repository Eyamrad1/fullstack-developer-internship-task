export interface Task {
  id?: number;
  name: string;
  completed: boolean;
  createdDate?:  Date;
  isNew?: boolean;
}
