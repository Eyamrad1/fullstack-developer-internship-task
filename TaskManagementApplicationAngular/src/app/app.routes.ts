import { Routes } from '@angular/router';
import {TaskListComponent} from "./task-list/task-list.component";

export const routes: Routes = [ { path: 'tasks', component: TaskListComponent },
  { path: '', redirectTo: '/tasks', pathMatch: 'full' }];
