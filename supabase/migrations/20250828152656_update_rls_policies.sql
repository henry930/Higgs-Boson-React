-- Update RLS policies for better compatibility
-- Run this in your Supabase SQL Editor

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Anyone can submit contact form" ON contact_submissions;

-- Create more permissive policy for contact submissions
CREATE POLICY "Enable insert for contact submissions" ON contact_submissions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable read for contact submissions" ON contact_submissions
  FOR SELECT USING (true);

-- Update AI chat policies to be more permissive
DROP POLICY IF EXISTS "Anyone can create chat sessions" ON ai_chat_sessions;
DROP POLICY IF EXISTS "Anyone can update their own chat session" ON ai_chat_sessions;
DROP POLICY IF EXISTS "Anyone can view chat sessions" ON ai_chat_sessions;
DROP POLICY IF EXISTS "Anyone can create chat messages" ON ai_chat_messages;
DROP POLICY IF EXISTS "Anyone can view chat messages" ON ai_chat_messages;

-- Create more permissive AI chat policies
CREATE POLICY "Enable all operations on chat sessions" ON ai_chat_sessions
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Enable all operations on chat messages" ON ai_chat_messages
  FOR ALL USING (true) WITH CHECK (true);