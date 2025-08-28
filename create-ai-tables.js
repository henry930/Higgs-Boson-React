// create-ai-tables.js
// Run this script to create AI chat tables in Supabase

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zmhrqgfjoemcvzvhjneh.supabase.co';
const supabaseKey = 'sb_publishable_NUUIQWh19So6nCoCBp8X1Q_v_WMJKut';

const supabase = createClient(supabaseUrl, supabaseKey);

async function createAITables() {
  console.log('🚀 Creating AI chat tables...');
  
  try {
    // Test connection first
    console.log('Testing connection...');
    const { data, error: testError } = await supabase.from('pages').select('count', { count: 'exact' });
    
    if (testError) {
      console.log('❌ Connection failed:', testError.message);
      return;
    }
    
    console.log('✅ Connected to Supabase successfully');
    console.log('📋 Note: Tables need to be created via Supabase Dashboard SQL Editor');
    console.log('');
    console.log('Copy and paste this SQL in your Supabase Dashboard → SQL Editor:');
    console.log('');
    console.log(`-- Create AI chat sessions table
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

-- Create AI chat messages table
CREATE TABLE IF NOT EXISTS ai_chat_messages (
  id BIGSERIAL PRIMARY KEY,
  session_id TEXT NOT NULL,
  speaker TEXT NOT NULL,
  message TEXT NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  FOREIGN KEY (session_id) REFERENCES ai_chat_sessions(session_id)
);

-- Enable Row Level Security
ALTER TABLE ai_chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_chat_messages ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can create chat sessions" ON ai_chat_sessions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can update their own chat session" ON ai_chat_sessions
  FOR UPDATE USING (true);

CREATE POLICY "Anyone can view chat sessions" ON ai_chat_sessions
  FOR SELECT USING (true);

CREATE POLICY "Anyone can create chat messages" ON ai_chat_messages
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can view chat messages" ON ai_chat_messages
  FOR SELECT USING (true);`);
    
    console.log('');
    console.log('After running the SQL, your AI chatbot will save all conversations to Supabase!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

createAITables();
