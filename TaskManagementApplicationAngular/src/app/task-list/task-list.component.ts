import {Component, OnInit, ViewChild} from '@angular/core';
import { Task } from '../models/task';
import { TaskService } from "../services/task.service";
import { ConfirmationService, MessageService } from "primeng/api";
import { DialogModule } from "primeng/dialog";
import { TableModule } from "primeng/table";
import { ButtonModule } from "primeng/button";
import { DropdownModule } from "primeng/dropdown";
import { CheckboxModule } from "primeng/checkbox";

import { ToastModule } from "primeng/toast";
import { FormsModule } from "@angular/forms";
import {CommonModule, DatePipe} from "@angular/common";



import {animate, style, transition, trigger} from "@angular/animations";
import {CardModule} from "primeng/card";
import { ConfirmDialogModule } from 'primeng/confirmdialog';
@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [
    TableModule,
    DialogModule,
    ButtonModule,
    DropdownModule,
    CheckboxModule,
    ConfirmDialogModule,
    ToastModule,
    FormsModule,
    CardModule,
    CommonModule,

  ],
  providers: [ConfirmationService, MessageService,DatePipe],
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css'],
  animations: [
    trigger('taskDialogAnimation', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('200ms', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        style({ opacity: 1 }),
        animate('200ms', style({ opacity: 0 }))
      ])
    ]),

    trigger('newTask', [
      transition('void => new', [
        style({ transform: 'scale(0.95)' }),
        animate('0.3s ease',
          style({ transform: 'scale(1.05)' })),
        animate('0.2s ease',
          style({ transform: 'scale(1)' }))
      ])
    ])
  ]
})
export class TaskListComponent implements OnInit {

  tasks: Task[] = [];
  taskDialog: boolean = false;
  task: Task = this.createEmptyTask();
  displayConfirmDialog: boolean = false;
  selectedTask: Task = this.createEmptyTask();
  totalRecords: number = 0;
  first: number = 0;
  filteredTasks: Task[] = [];

  statusOptions = [
    { label: 'All', value: null },
    { label: 'Completed', value: true },
    { label: 'Pending', value: false }
  ];
  selectedStatus: any = null;
  searchText: string = '';
  @ViewChild('cd') confirmDialog: any;

  constructor(
    private taskService: TaskService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks() {
    this.taskService.getAllTasks().subscribe({
      next: (data) => {
        this.tasks = data;
        this.filterTasks();
      },
      error: () => this.showMessage('error', 'Error', 'Failed to load tasks'),
    });
  }

  filterTasks() {
    this.filteredTasks = this.tasks.filter(task => {
      const matchesStatus = this.selectedStatus === null ||
        task.completed === this.selectedStatus;
      const matchesSearch = task.name.toLowerCase().includes(this.searchText.toLowerCase());
      return matchesStatus && matchesSearch;
    });

    this.totalRecords = this.filteredTasks.length;
  }

  onSearch(event: Event) {
    this.searchText = (event.target as HTMLInputElement).value;
    this.filterTasks();
  }

  onStatusChange(task: Task, newStatus: boolean): void {
    const originalStatus = task.completed;
    task.completed = newStatus;
    this.taskService.updateTask(task.id!, task).subscribe({
      next: () => this.showMessage('success', 'Success', `Task marked as ${newStatus ? 'completed' : 'pending'}`),
      error: () => {
        task.completed = originalStatus;
        this.showMessage('error', 'Error', 'Failed to update task status');
      },
    });
  }

  saveTask() {
    if (!this.task.name.trim()) {
      this.showMessage('warn', 'Warning', 'Task name is required');
      return;
    }

    if (this.task.id) {
      // Update existing task
      this.taskService.updateTask(this.task.id, this.task).subscribe({
        next: () => {
          this.loadTasks();
          this.taskDialog = false;
          this.showMessage('success', 'Success', 'Task updated successfully');
        },
        error: () => this.showMessage('error', 'Error', 'Failed to update task'),
      });
    } else {
      // Create new task
      this.taskService.createTask(this.task).subscribe({
        next: () => {
          this.loadTasks();
          this.taskDialog = false;
          this.showMessage('success', 'Success', 'Task created successfully');
        },
        error: () => this.showMessage('error', 'Error', 'Failed to create task'),
      });

    }
    if (this.task.id) {
      delete this.task.isNew;}
  }


  openNewTaskDialog() {
    this.task = this.createEmptyTask();
    this.taskDialog = true;
  }


  //the ...task is creating a copy for the selected task until the user save the changes
  editTask(task: Task) {
    this.task = { ...task };
    this.taskDialog = true;
  }


  //confirmDialog for the delete task
  confirmDelete(task: Task) {
    this.selectedTask = task;
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this task?',
      accept: () => {
        this.onDeleteConfirmed();
      },
      reject: () => {
        this.onDeleteCancelled();
      }
    });
  }



  onDeleteConfirmed() {
    if (this.selectedTask?.id) {
      this.deleteTask(this.selectedTask);
    } else {
      this.showMessage('error', 'Error', 'No task selected');
    }
    this.displayConfirmDialog = false;
  }

  onDeleteCancelled() {
    this.displayConfirmDialog = false;
  }

  deleteTask(task: Task) {
    if (task.id) {
      this.taskService.deleteTaskById(task.id).subscribe({
        next: () => {
          // Update both main and filtered tasks
          this.tasks = this.tasks.filter((t) => t.id !== task.id);
          this.filterTasks();

          this.showMessage('success', 'Success', 'Task deleted successfully');
        },
        error: (err) => {
          console.error('Delete error:', err);
          this.showMessage('error', 'Error', 'Failed to delete task');
          this.loadTasks(); // Fallback refresh
        }
      });
    } else {
      this.showMessage('error', 'Error', 'Task ID is missing');
    }
  }


  showMessage(severity: string, summary: string, detail: string) {
    this.messageService.add({ severity, summary, detail });
  }



//display a form that's not pre-populated with any existing task data
  createEmptyTask(): Task {
    return {
      id: undefined,
      name: '',
      completed: false,
      isNew: true
    };
  }


}
