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
    ])
  ]
})
export class TaskListComponent implements OnInit {

  tasks: Task[] = [];
  taskDialog: boolean = false;
  task: Task = this.createEmptyTask();
  displayConfirmDialog: boolean = false;
  selectedTask: Task = this.createEmptyTask();
  totalRecords: number = 0; // Total number of tasks
  first: number = 0; // Tracks the current page
  filteredTasks: Task[] = [];
  filterStatus: string = ''; // To store filter status value (e.g., 'Completed', 'Pending')

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
        this.filteredTasks = [...this.tasks]; // Initialize filtered tasks
      },
      error: () => this.showMessage('error', 'Error', 'Failed to load tasks'),
    });
  }

  // Filter tasks based on input field and status
  onFilter(event: any, field: keyof Task) {
    const filterValue = event.target.value.trim().toLowerCase();
    this.filteredTasks = this.tasks.filter((task) => {
      if (field === 'completed') {
        return task[field] === (filterValue === 'completed'); // Handle 'completed' status filtering
      } else {
        return task[field]?.toString().toLowerCase().includes(filterValue);
      }
    });
  }

  // Sorting the tasks by status (Completed/Pending)
  sortByStatus() {
    this.filteredTasks.sort((a, b) => {
      if (a.completed === b.completed) return 0;
      return a.completed ? -1 : 1; // Sorting completed tasks first
    });
  }


  // Replace toggleCompletion with onStatusChange
  onStatusChange(task: Task, newStatus: boolean): void {
    const originalStatus = task.completed;
    task.completed = newStatus;

    this.taskService.updateTask(task.id!, task).subscribe({
      next: () => {
        this.showMessage('success', 'Success', `Task marked as ${newStatus ? 'completed' : 'pending'}`);
      },
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
      this.taskService.updateTask(this.task.id, this.task).subscribe({
        next: () => {
          this.loadTasks();
          this.taskDialog = false;
          this.showMessage('success', 'Success', 'Task updated successfully');
        },
        error: () => this.showMessage('error', 'Error', 'Failed to update task'),
      });
    } else {
      this.taskService.createTask(this.task).subscribe({
        next: (newTask) => {
          this.tasks.push(newTask);
          this.taskDialog = false;
          this.showMessage('success', 'Success', 'Task created successfully');
        },
        error: () => this.showMessage('error', 'Error', 'Failed to create task'),
      });
    }
  }

  openNewTaskDialog() {
    this.task = this.createEmptyTask();
    this.taskDialog = true;
  }

  editTask(task: Task) {
    this.task = { ...task };
    this.taskDialog = true;
  }

  confirmDelete(task: Task) {
    this.selectedTask = task; // Ensure selected task is assigned
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
    this.displayConfirmDialog = false; // Close dialog after confirming
  }

  onDeleteCancelled() {
    this.displayConfirmDialog = false; // Close dialog if rejected
  }

  deleteTask(task: Task) {
    if (task.id) {
      console.log('Deleting task ID:', task.id, typeof task.id); // Debug log

      this.taskService.deleteTaskById(task.id).subscribe({
        next: () => {
          // Filter out the deleted task IMMEDIATELY
          this.tasks = this.tasks.filter((t) => t.id !== task.id);
          this.showMessage('success', 'Success', 'Task deleted successfully');
        },
        error: (err) => {
          console.error('Delete error:', err);
          this.showMessage('error', 'Error', 'Failed to delete task');

          // Reload tasks as fallback
          this.loadTasks();
        }
      });
    } else {
      this.showMessage('error', 'Error', 'Task ID is missing');
    }
  }
  showMessage(severity: string, summary: string, detail: string) {
    this.messageService.add({ severity, summary, detail });
  }

  createEmptyTask(): Task {
    return {
      id: undefined,
      name: '',
      completed: false,
    };
  }


}
