package com.example.taskmanagementapplication.Service;

import com.example.taskmanagementapplication.entity.Task;

import java.util.List;

public interface TaskService {
    public Task AddTask(Task task);
    public void deleteTaskById(Long id);
    public Task findById(Long id);

    public List<Task> retrieveAllTasks();

    public Task updateTask(Task task, Long id );
}
