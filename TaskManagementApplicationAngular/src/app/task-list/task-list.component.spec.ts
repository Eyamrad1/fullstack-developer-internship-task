import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { TaskListComponent } from './task-list.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TaskService } from '../services/task.service';
import { Task } from '../models/task';
import { of, throwError } from 'rxjs';
import { MessageService } from 'primeng/api';

describe('TaskListComponent', () => {
  let component: TaskListComponent;
  let fixture: ComponentFixture<TaskListComponent>;
  let httpMock: HttpTestingController;
  let taskService: TaskService;
  let messageService: MessageService;

  const mockTasks: Task[] = [
    { id: 1, name: 'Task 1', completed: false },
    { id: 2, name: 'Task 2', completed: true }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TaskListComponent,
        HttpClientTestingModule
      ],
      providers: [
        TaskService,
        MessageService
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(TaskListComponent);
    component = fixture.componentInstance;
    taskService = TestBed.inject(TaskService);
    messageService = TestBed.inject(MessageService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load tasks on initialization', fakeAsync(() => {
    spyOn(taskService, 'getAllTasks').and.returnValue(of(mockTasks));

    component.ngOnInit();
    tick();

    expect(taskService.getAllTasks).toHaveBeenCalled();
    expect(component.tasks).toEqual(mockTasks);
    expect(component.filteredTasks).toEqual(mockTasks);
  }));

  it('should filter tasks based on status and search text', () => {
    component.tasks = mockTasks;

    // Test completed filter
    component.selectedStatus = true;
    component.filterTasks();
    expect(component.filteredTasks.length).toBe(1);
    expect(component.filteredTasks[0].completed).toBe(true);

    // Test pending filter
    component.selectedStatus = false;
    component.filterTasks();
    expect(component.filteredTasks.length).toBe(1);
    expect(component.filteredTasks[0].completed).toBe(false);

    // Test search filter
    component.searchText = 'Task 1';
    component.filterTasks();
    expect(component.filteredTasks.length).toBe(1);
    expect(component.filteredTasks[0].name).toBe('Task 1');
  });

  it('should update task status', fakeAsync(() => {
    const task = mockTasks[0];
    spyOn(taskService, 'updateTask').and.returnValue(of(task));
    spyOn(messageService, 'add');

    component.onStatusChange(task, true);
    tick();
    expect(taskService.deleteTaskById).toHaveBeenCalledWith(task.id as number);
    expect(messageService.add).toHaveBeenCalled();
  }));

  it('should handle error when updating task status', fakeAsync(() => {
    const task = mockTasks[0];
    spyOn(taskService, 'updateTask').and.returnValue(throwError(() => new Error('Error')));
    spyOn(messageService, 'add');

    component.onStatusChange(task, true);
    tick();

    expect(messageService.add).toHaveBeenCalledWith(jasmine.objectContaining({
      severity: 'error'
    }));
  }));

  it('should save new task', fakeAsync(() => {
    const newTask: Task = { name: 'New Task', completed: false };
    spyOn(taskService, 'createTask').and.returnValue(of(newTask));
    spyOn(messageService, 'add');

    component.task = newTask;
    component.saveTask();
    tick();

    expect(taskService.createTask).toHaveBeenCalledWith(newTask);
    expect(messageService.add).toHaveBeenCalledWith(jasmine.objectContaining({
      severity: 'success'
    }));
    expect(component.taskDialog).toBeFalse();
  }));

  it('should delete task', fakeAsync(() => {
    const task = mockTasks[0];
    spyOn(taskService, 'deleteTaskById').and.returnValue(of(undefined));
    spyOn(messageService, 'add');

    component.deleteTask(task);
    tick();

    // Add type assertion to tell TypeScript we know the ID exists
    expect(taskService.deleteTaskById).toHaveBeenCalledWith(task.id as number);
    expect(messageService.add).toHaveBeenCalledWith(jasmine.objectContaining({
      severity: 'success'
    }));
    expect(component.tasks.some(t => t.id === task.id)).toBeFalse();
  }));

  it('should open new task dialog with empty task', () => {
    component.openNewTaskDialog();
    expect(component.task).toEqual(jasmine.objectContaining({
      id: undefined,
      name: '',
      completed: false
    }));
    expect(component.taskDialog).toBeTrue();
  });

  it('should open edit task dialog with task copy', () => {
    const task = mockTasks[0];
    component.editTask(task);
    expect(component.task).toEqual({ ...task });
    expect(component.taskDialog).toBeTrue();
  });

  it('should show error message when saving invalid task', () => {
    spyOn(messageService, 'add');
    component.task.name = '';
    component.saveTask();
    expect(messageService.add).toHaveBeenCalledWith(jasmine.objectContaining({
      severity: 'warn'
    }));
  });
});
