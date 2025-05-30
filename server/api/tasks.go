package api

import (
	"net/http"

	"todolist/db"
	"todolist/models"

	"github.com/gin-gonic/gin"
)

func CreateTask(c *gin.Context) {
	var req models.CreateTaskRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	userID := c.GetString("user_id")
	if userID == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
		return
	}

	var task models.Task
	err := db.DB.QueryRow(
		`INSERT INTO tasks (user_id, title, description, status) 
		 VALUES ($1, $2, $3, 'pending') 
		 RETURNING id, user_id, title, description, status, created_at, updated_at`,
		userID, req.Title, req.Description,
	).Scan(&task.ID, &task.UserID, &task.Title, &task.Description, &task.Status, &task.CreatedAt, &task.UpdatedAt)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error creating task"})
		return
	}

	c.JSON(http.StatusCreated, task)
}

func GetTasks(c *gin.Context) {
	userID := c.GetString("user_id")
	if userID == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
		return
	}

	rows, err := db.DB.Query(
		`SELECT id, user_id, title, description, status, created_at, updated_at 
		 FROM tasks 
		 WHERE user_id = $1 
		 ORDER BY created_at DESC`,
		userID,
	)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error fetching tasks"})
		return
	}
	defer rows.Close()

	var tasks []models.Task
	for rows.Next() {
		var task models.Task
		err := rows.Scan(&task.ID, &task.UserID, &task.Title, &task.Description, &task.Status, &task.CreatedAt, &task.UpdatedAt)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Error scanning tasks"})
			return
		}
		tasks = append(tasks, task)
	}

	c.JSON(http.StatusOK, tasks)
}

func UpdateTask(c *gin.Context) {
	taskID := c.Param("id")
	userID := c.GetString("user_id")
	if userID == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
		return
	}

	var req models.UpdateTaskRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var task models.Task
	err := db.DB.QueryRow(
		`UPDATE tasks 
		 SET title = COALESCE($1, title), 
		     description = COALESCE($2, description), 
		     status = COALESCE($3, status),
		     updated_at = CURRENT_TIMESTAMP
		 WHERE id = $4 AND user_id = $5
		 RETURNING id, user_id, title, description, status, created_at, updated_at`,
		req.Title, req.Description, req.Status, taskID, userID,
	).Scan(&task.ID, &task.UserID, &task.Title, &task.Description, &task.Status, &task.CreatedAt, &task.UpdatedAt)

	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Task not found"})
		return
	}

	c.JSON(http.StatusOK, task)
}

func DeleteTask(c *gin.Context) {
	taskID := c.Param("id")
	userID := c.GetString("user_id")
	if userID == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
		return
	}

	result, err := db.DB.Exec(
		"DELETE FROM tasks WHERE id = $1 AND user_id = $2",
		taskID, userID,
	)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error deleting task"})
		return
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error checking affected rows"})
		return
	}

	if rowsAffected == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Task not found"})
		return
	}

	c.Status(http.StatusNoContent)
}
