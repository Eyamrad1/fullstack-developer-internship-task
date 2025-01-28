# Use a specific version of OpenJDK as the base image
FROM openjdk:17-jdk-slim

# Set the working directory
WORKDIR /app


COPY target/TaskManagementApplication-0.0.1-SNAPSHOT.jar /app/taskmanagementapplication.jar



EXPOSE 8080

# Run the JAR file when the container starts
ENTRYPOINT ["java", "-jar", "/app/taskmanagementapplication.jar"]
