package com.example.taskmanagementapplication.Controller;

import com.example.taskmanagementapplication.Service.TaskService;
import com.example.taskmanagementapplication.entity.Task;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/tasks")
public class TasksController {
    @Autowired
    TaskService taskService;

    @PostMapping("/addTask")
    public ResponseEntity<Task> createTask(@Valid @RequestBody Task task) {
        Task createdTask = taskService.AddTask(task);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdTask);
    }
    @GetMapping("/retrieveAllTasks")
    public List<Task> retrieveAllTasks() {
        return taskService.retrieveAllTasks();
    }

    @GetMapping("/retrievetaskbyId/{id}")
    public Task findById (@PathVariable Long id){
        return taskService.findById(id);
    }

    @PutMapping("/UpdateTask/{id}")
    public Task updateTask (@PathVariable Long id , @RequestBody Task task){
        return taskService.updateTask(task,id);
    }

    @DeleteMapping("/deleteTask/{id}")
    public String deleteTaskById(@PathVariable Long id) {
        taskService.deleteTaskById(id);
        return "Task deleted successfully";
    }
}
