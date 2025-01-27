package com.example.taskmanagementapplication.Service;

import com.example.taskmanagementapplication.Repository.TasksRepository;
import com.example.taskmanagementapplication.entity.Task;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TaskServiceIml implements TaskService {
    @Autowired
    TasksRepository tasksRepository;
    @Override
    public Task AddTask(Task task) {
        return tasksRepository.save(task);
    }

    @Override
    public void deleteTaskById(Long id) {
        tasksRepository.deleteById(id);

    }

    @Override
    public Task findById(Long id) {
        return tasksRepository.findById(id).orElse(null);
    }

    @Override
    public List<Task> retrieveAllTasks() {
        return tasksRepository.findAll();
    }

    @Override
    public Task updateTask(Task task, Long id) {

        Task existingTask = tasksRepository.findById(id).orElseThrow(() ->
                new IllegalArgumentException("Task with ID " + id + " not found.")
        );


        if (task.getName() != null && !task.getName().isEmpty()) {
            existingTask.setName(task.getName());
        }
        existingTask.setCompleted(task.isCompleted());

        return tasksRepository.save(existingTask);
    }
}
