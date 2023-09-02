-- SET client_min_messages = warning;
-- -------------------------
-- Database task
-- -------------------------
DROP DATABASE IF EXISTS task;
--
--
CREATE DATABASE task;
-- -------------------------
-- Database task_test
-- -------------------------
DROP DATABASE IF EXISTS task_test;
--
--
CREATE DATABASE task_test;
-- -------------------------
-- Role admin
-- -------------------------
-- DROP ROLE IF EXISTS admin;
--
--
CREATE ROLE admin WITH PASSWORD 'admin';
-- -------------------------
-- Alter Role admin
-- -------------------------
-- ALTER ROLE admin WITH SUPERUSER CREATEROLE CREATEDB LOGIN;
-- -------------------------
-- Database GRANT PRIVILEGES
-- -------------------------
GRANT ALL PRIVILEGES ON DATABASE task TO admin;
GRANT ALL PRIVILEGES ON DATABASE task_test TO admin;
-- -------------------------
-- Connect to task database
-- -------------------------
\c task;
-- -------------------------
-- Set Timezone
-- -------------------------
SET TIMEZONE = 'UTC';
-- -------------------------
-- Table users
-- -------------------------
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  email VARCHAR(30) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT timezone('UTC', now()),
  updated_at TIMESTAMP,
  deleted_at TIMESTAMP
);
-- -------------------------
-- Table passwords
-- -------------------------
CREATE TABLE IF NOT EXISTS passwords (
  id SERIAL PRIMARY KEY,
  password TEXT NOT NULL,
  user_id INT NOT NULL UNIQUE REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE
);
-- -------------------------
-- Table access_tokens
-- -------------------------
CREATE TABLE IF NOT EXISTS access_tokens (
  id SERIAL PRIMARY KEY,
  token TEXT NOT NULL,
  expiration TIMESTAMP,
  user_id INT NOT NULL UNIQUE REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE
);
-- -------------------------
-- Table refresh_tokens
-- -------------------------
CREATE TABLE IF NOT EXISTS refresh_tokens (
  id SERIAL PRIMARY KEY,
  token TEXT NOT NULL,
  expiration TIMESTAMP,
  user_id INT NOT NULL UNIQUE REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE
);