import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TaskService } from './task.service';
import { Task } from '../models/task';

describe('TaskService', () => {
  let service: TaskService;
  let httpMock: HttpTestingController;

  const dummyTasks: Task[] = [
    { id: 1, name: 'Task 1', completed: false },
    { id: 2, name: 'Task 2', completed: true }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule,
      ],
      providers: [TaskService]
    });
    service = TestBed.inject(TaskService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch all tasks', () => {
    service.getAllTasks().subscribe(tasks => {
      expect(tasks.length).toBe(2);
      expect(tasks).toEqual(dummyTasks);
    });

    const req = httpMock.expectOne(`${service.apiUrl}/retrieveAllTasks`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyTasks);
  });

  it('should fetch a task by ID', () => {
    const taskId = 1;
    service.getTaskById(taskId).subscribe(task => {
      expect(task.id).toBe(taskId);
      expect(task).toEqual(dummyTasks[0]);
    });

    const req = httpMock.expectOne(`${service.apiUrl}/retrievetaskbyId/${taskId}`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyTasks[0]);
  });

  it('should create a task', () => {
    const newTask: Task = { id: 3, name: 'New Task', completed: false };
    service.createTask(newTask).subscribe(task => {
      expect(task).toEqual(newTask);
    });

    const req = httpMock.expectOne(`${service.apiUrl}/addTask`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newTask);
    req.flush(newTask);
  });

  it('should update a task', () => {
    const updatedTask: Task = { id: 1, name: 'Updated Task', completed: true };
    service.updateTask(1, updatedTask).subscribe(task => {
      expect(task).toEqual(updatedTask);
    });

    const req = httpMock.expectOne(`${service.apiUrl}/UpdateTask/1`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(updatedTask);
    req.flush(updatedTask);
  });

  it('should delete a task by id', () => {
    service.deleteTaskById(1).subscribe(
      () => {
        expect(true).toBe(true); // Success callback
      },
      () => {
        fail('Deletion should not fail');
      }
    );

    const req = httpMock.expectOne(`${service.apiUrl}/deleteTask/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(''); // Simulate empty response
  });

  afterEach(() => {
    httpMock.verify();
  });
});
