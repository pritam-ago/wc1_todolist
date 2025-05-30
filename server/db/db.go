package db

import (
	"database/sql"
	"log"
	"os"

	_ "github.com/lib/pq"
)

var DB *sql.DB

func Init() {
	// Get database URL from environment variable
	dbURL := os.Getenv("DB_URL")
	if dbURL == "" {
		log.Fatal("DB_URL environment variable is not set")
	}

	// Open database connection
	var err error
	DB, err = sql.Open("postgres", dbURL)
	if err != nil {
		log.Fatal("Error connecting to the database:", err)
	}

	// Test the connection
	err = DB.Ping()
	if err != nil {
		log.Fatal("Error pinging the database:", err)
	}

	// Create tables if they don't exist
	createTables()
}

func createTables() {
	// Create users table
	_, err := DB.Exec(`
		CREATE TABLE IF NOT EXISTS users (
			id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
			email VARCHAR(255) UNIQUE NOT NULL,
			password VARCHAR(255) NOT NULL,
			created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
			updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
		)
	`)
	if err != nil {
		log.Fatal("Error creating users table:", err)
	}

	// Create tasks table
	_, err = DB.Exec(`
		CREATE TABLE IF NOT EXISTS tasks (
			id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
			user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
			title VARCHAR(255) NOT NULL,
			description TEXT,
			status VARCHAR(50) DEFAULT 'pending',
			created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
			updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
		)
	`)
	if err != nil {
		log.Fatal("Error creating tasks table:", err)
	}
}
