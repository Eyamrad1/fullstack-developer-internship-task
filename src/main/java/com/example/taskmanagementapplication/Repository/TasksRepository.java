package com.example.taskmanagementapplication.Repository;

import com.example.taskmanagementapplication.entity.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TasksRepository extends JpaRepository<Task,Long> {
}
