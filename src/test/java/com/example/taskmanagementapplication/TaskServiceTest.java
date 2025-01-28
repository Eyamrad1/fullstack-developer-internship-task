package com.example.taskmanagementapplication;

import com.example.taskmanagementapplication.Service.TaskService;
import com.example.taskmanagementapplication.entity.Task;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.*;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(SpringExtension.class)
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
@SpringBootTest
@Slf4j
@Transactional
@ActiveProfiles("test")
 class TaskServiceTest {

    @Autowired
    TaskService taskService;

    private static Task testTask;

    @BeforeEach
    void setUp() {

        testTask = new Task();
        testTask.setName("Test Task");
        testTask.setCompleted(false);
    }

    @Test
    @Order(1)
    void testAddTask() {

        Task savedTask = taskService.AddTask(testTask);


        assertNotNull(savedTask.getId());
        assertEquals("Test Task", savedTask.getName());
        assertFalse(savedTask.isCompleted());
    }

    @Test
    @Order(2)
    void testRetrieveAllTasks() {

        taskService.AddTask(testTask);


        List<Task> tasks = taskService.retrieveAllTasks();


        assertFalse(tasks.isEmpty());
        assertEquals(1, tasks.size());
        assertEquals("Test Task", tasks.get(0).getName());
    }

    @Test
    @Order(3)
    void testFindById() {

        Task savedTask = taskService.AddTask(testTask);


        Task retrievedTask = taskService.findById(savedTask.getId());


        assertNotNull(retrievedTask);
        assertEquals(savedTask.getId(), retrievedTask.getId());
        assertEquals("Test Task", retrievedTask.getName());
    }

    @Test
    @Order(4)
    void testUpdateTask() {

        Task savedTask = taskService.AddTask(testTask);


        Task updatedTaskData = new Task();
        updatedTaskData.setName("Updated Task");
        updatedTaskData.setCompleted(true);

        Task updatedTask = taskService.updateTask(updatedTaskData, savedTask.getId());


        assertNotNull(updatedTask);
        assertEquals("Updated Task", updatedTask.getName());
        assertTrue(updatedTask.isCompleted());
    }

    @Test
    @Order(5)
    void testDeleteTaskById() {

        Task savedTask = taskService.AddTask(testTask);


        taskService.deleteTaskById(savedTask.getId());


        Task deletedTask = taskService.findById(savedTask.getId());
        assertNull(deletedTask);
    }
}
