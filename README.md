# Task App


## Table of Contents

- [Task App](#task-app)
  - [Table of Contents](#table-of-contents)
  - [Getting Started](#getting-started)
  - [Database Setup](#database-setup)
  - [Installation](#installation)
  - [Built With](#built-with)

## Getting Started

To get started with the project, follow these steps:

    Clone the repository to your local machine.
    Install the dependencies using npm install.
    Set up a PostgreSQL database.
    Run the database migrations using npm run migrate:up.
    Start the backend server using npm start.
    Navigate to http://localhost:3000 in your web browser.

## Database Setup

1. Create a new PostgreSQL database named `task_app`.
   - `CREATE DATABASE task_app;`
2. Run the following commands to create a new PostgreSQL user:
   - `CREATE ROLE admin WITH LOGIN PASSWORD 'admin';`
   - `ALTER ROLE admin SUPERUSER CREATEROLE CREATEDB;`
   - `GRANT ALL PRIVILEGES ON DATABASE task_app TO admin;`

## Installation

1. Clone the repository to your local machine.
2. Navigate to the project directory and run `npm install` or `yarn` to install dependencies.
3. Start the API in dev mode with `npm run dev` or `yarn dev`.

**Note:** The `.env.example` file contains environment variables that are used by the application to connect to the database and Redis server, as well as the session secret key. Please review the file carefully before using it, and make any necessary changes to ensure that it works with your specific environment.

To ensure that your application functions correctly, please follow these steps:

1. Rename the `.env.example` file to `.env`. The `.env` file is where you will store your actual environment-specific configuration.

2. Open the newly renamed `.env` file in a text editor.

3. Go through each environment variable defined in the `.env` file and review its value. Modify the values as needed to match your database connection details, Redis server configuration, and session secret key requirements.

4. Take special care to ensure that the database connection details, such as the host, port, database name, username, and password, are correctly set according to your database setup. Make sure these values accurately reflect your database configuration to establish a successful connection.

5. Save the changes to the `.env` file.

## Built With

- [Node.js](https://nodejs.org) - JavaScript Runtime
- [Express](https://expressjs.com/) - JavaScript API Framework
- [PostgreSQL](https://www.postgresql.org/) - Open Source Relational Database
