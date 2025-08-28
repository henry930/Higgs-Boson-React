-- Additional SQL for AI Chatbot Integration
-- Run this in your Supabase SQL Editor after the previous setup

-- Create table for AI chat sessions
CREATE TABLE IF NOT EXISTS ai_chat_sessions (
  id BIGSERIAL PRIMARY KEY,
  session_id TEXT UNIQUE NOT NULL,
  customer_name TEXT,
  customer_email TEXT,
  customer_phone TEXT,
  customer_company TEXT,
  project_requirements TEXT,
  estimated_quote DECIMAL(10,2),
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create table for AI chat messages
CREATE TABLE IF NOT EXISTS ai_chat_messages (
  id BIGSERIAL PRIMARY KEY,
  session_id TEXT NOT NULL,
  speaker TEXT NOT NULL, -- 'customer', 'ai', 'agent'
  message TEXT NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  FOREIGN KEY (session_id) REFERENCES ai_chat_sessions(session_id)
);

-- Enable Row Level Security
ALTER TABLE ai_chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_chat_messages ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (for the chatbot)
CREATE POLICY "Anyone can create chat sessions" ON ai_chat_sessions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can update their own chat session" ON ai_chat_sessions
  FOR UPDATE USING (true);

CREATE POLICY "Anyone can view chat sessions" ON ai_chat_sessions
  FOR SELECT USING (true);

CREATE POLICY "Anyone can create chat messages" ON ai_chat_messages
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can view chat messages" ON ai_chat_messages
  FOR SELECT USING (true);
