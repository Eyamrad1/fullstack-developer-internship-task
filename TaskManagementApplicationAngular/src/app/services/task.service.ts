import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import { Task } from '../models/task';
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  readonly apiUrl = 'http://localhost:8080/tasks'
  constructor(readonly http:HttpClient) { }

  createTask(task: Task): Observable<Task> {
    return this.http.post<Task>(`${this.apiUrl}/addTask`, task);
  }

  getAllTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.apiUrl}/retrieveAllTasks`);
  }

  getTaskById(id: number): Observable<Task> {
    return this.http.get<Task>(`${this.apiUrl}/retrievetaskbyId/${id}`);
  }


  updateTask(id: number, task: Task): Observable<Task> {
    return this.http.put<Task>(`${this.apiUrl}/UpdateTask/${id}`, task);
  }



  deleteTaskById(id: number): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/deleteTask/${id}`,
      { responseType: 'text' as 'json' } // Handle empty responses
    );
  }

}
