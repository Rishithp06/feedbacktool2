-- Enable UUID extension in PostgreSQL
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users Table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role VARCHAR(50) CHECK (role IN ('super_admin', 'admin', 'regular_user'))
);

-- Teams Table
CREATE TABLE teams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) UNIQUE NOT NULL,
    parent_team_id UUID REFERENCES teams(id) ON DELETE SET NULL,  -- Supports Nested Teams
    created_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,  -- Tracks who created the team
    created_at TIMESTAMP DEFAULT NOW()
);

-- Team Members Table
CREATE TABLE team_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE (team_id, user_id)
);

-- Feedback Table
CREATE TABLE feedback (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sender_id UUID NULL,  -- NULL if anonymous
    receiver_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    type VARCHAR(20) CHECK (type IN ('positive', 'improvement')),
    message TEXT NOT NULL,
    is_anonymous BOOLEAN DEFAULT FALSE,
    is_read BOOLEAN DEFAULT FALSE,
    is_sent BOOLEAN DEFAULT FALSE,
    email_sent BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    scheduled_at TIMESTAMP NOT NULL
);

-- Feedback Schedule Table
CREATE TABLE feedback_schedule (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    feedback_id UUID NOT NULL REFERENCES feedback(id) ON DELETE CASCADE,
    team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    scheduled_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    schedule_type VARCHAR(20) CHECK (schedule_type IN ('specific_date', 'periodic')),
    periodic_type VARCHAR(20) CHECK (periodic_type IN ('daily', 'weekly', 'monthly')) NULL,  
    scheduled_at TIMESTAMP NOT NULL,  
    sent_at TIMESTAMP NULL  -- NULL until feedback is sent
);

-- Password Resets Table
CREATE TABLE password_resets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    reset_token TEXT NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    UNIQUE (user_id, reset_token)
);
