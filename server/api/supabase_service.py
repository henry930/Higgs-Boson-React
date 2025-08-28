# supabase_service.py
# Service to connect Python backend to Supabase database

import os
from supabase import create_client, Client
from typing import Dict, List, Optional, Any
import json
import logging
from datetime import datetime

logger = logging.getLogger(__name__)

class SupabaseService:
    """Service class for Supabase database operations"""
    
    def __init__(self):
        # Get Supabase credentials from environment
        self.supabase_url = os.getenv('SUPABASE_URL', 'https://zmhrqgfjoemcvzvhjneh.supabase.co')
        
        # Use service role key if available, otherwise use anon key
        self.supabase_service_key = os.getenv('SUPABASE_SERVICE_KEY')
        self.supabase_anon_key = os.getenv('SUPABASE_KEY', 'sb_publishable_NUUIQWh19So6nCoCBp8X1Q_v_WMJKut')
        
        # Prefer service role key for backend operations
        supabase_key = self.supabase_service_key if self.supabase_service_key else self.supabase_anon_key
        
        if not self.supabase_url or not supabase_key:
            raise ValueError("Supabase URL and Key must be provided")
        
        # Create Supabase client
        self.supabase: Client = create_client(self.supabase_url, supabase_key)
        
        key_type = "service role" if self.supabase_service_key else "anon"
        logger.info(f"Supabase client initialized successfully using {key_type} key")
    
    # Page Management
    def get_pages(self, published_only: bool = True) -> List[Dict]:
        """Get all pages from Supabase"""
        try:
            query = self.supabase.table('pages').select('*')
            if published_only:
                query = query.eq('is_published', True)
            
            result = query.execute()
            return result.data if result.data else []
        except Exception as e:
            logger.error(f"Error fetching pages: {e}")
            return []
    
    def get_page_by_slug(self, slug: str) -> Optional[Dict]:
        """Get a specific page by slug"""
        try:
            result = self.supabase.table('pages').select('*').eq('slug', slug).eq('is_published', True).execute()
            return result.data[0] if result.data else None
        except Exception as e:
            logger.error(f"Error fetching page {slug}: {e}")
            return None
    
    def create_page(self, page_data: Dict) -> Dict:
        """Create a new page"""
        try:
            result = self.supabase.table('pages').insert(page_data).execute()
            return result.data[0] if result.data else {}
        except Exception as e:
            logger.error(f"Error creating page: {e}")
            raise e
    
    def update_page(self, page_id: int, page_data: Dict) -> Dict:
        """Update an existing page"""
        try:
            page_data['updated_at'] = datetime.now().isoformat()
            result = self.supabase.table('pages').update(page_data).eq('id', page_id).execute()
            return result.data[0] if result.data else {}
        except Exception as e:
            logger.error(f"Error updating page {page_id}: {e}")
            raise e
    
    # Contact Form Submissions
    def create_contact_submission(self, submission_data: Dict) -> Dict:
        """Create a contact form submission"""
        try:
            result = self.supabase.table('contact_submissions').insert(submission_data).execute()
            return result.data[0] if result.data else {}
        except Exception as e:
            logger.error(f"Error creating contact submission: {e}")
            raise e
    
    def get_contact_submissions(self, limit: int = 100) -> List[Dict]:
        """Get contact form submissions"""
        try:
            result = self.supabase.table('contact_submissions').select('*').order('created_at', desc=True).limit(limit).execute()
            return result.data if result.data else []
        except Exception as e:
            logger.error(f"Error fetching contact submissions: {e}")
            return []
    
    # AI Chat Management
    def create_chat_session(self, session_data: Dict) -> Dict:
        """Create a new AI chat session"""
        try:
            result = self.supabase.table('ai_chat_sessions').insert(session_data).execute()
            return result.data[0] if result.data else {}
        except Exception as e:
            logger.error(f"Error creating chat session: {e}")
            raise e
    
    def update_chat_session(self, session_id: str, session_data: Dict) -> Dict:
        """Update an AI chat session"""
        try:
            session_data['updated_at'] = datetime.now().isoformat()
            result = self.supabase.table('ai_chat_sessions').update(session_data).eq('session_id', session_id).execute()
            return result.data[0] if result.data else {}
        except Exception as e:
            logger.error(f"Error updating chat session {session_id}: {e}")
            raise e
    
    def get_chat_session(self, session_id: str) -> Optional[Dict]:
        """Get a chat session by ID"""
        try:
            result = self.supabase.table('ai_chat_sessions').select('*').eq('session_id', session_id).execute()
            return result.data[0] if result.data else None
        except Exception as e:
            logger.error(f"Error fetching chat session {session_id}: {e}")
            return None
    
    def save_chat_message(self, message_data: Dict) -> Dict:
        """Save a chat message"""
        try:
            result = self.supabase.table('ai_chat_messages').insert(message_data).execute()
            return result.data[0] if result.data else {}
        except Exception as e:
            logger.error(f"Error saving chat message: {e}")
            raise e
    
    def get_chat_messages(self, session_id: str) -> List[Dict]:
        """Get all messages for a chat session"""
        try:
            result = self.supabase.table('ai_chat_messages').select('*').eq('session_id', session_id).order('timestamp', desc=False).execute()
            return result.data if result.data else []
        except Exception as e:
            logger.error(f"Error fetching chat messages for {session_id}: {e}")
            return []
    
    def get_all_chat_sessions(self, limit: int = 100) -> List[Dict]:
        """Get all chat sessions for admin dashboard"""
        try:
            result = self.supabase.table('ai_chat_sessions').select('*').order('created_at', desc=True).limit(limit).execute()
            return result.data if result.data else []
        except Exception as e:
            logger.error(f"Error fetching chat sessions: {e}")
            return []
    
    # Generic CRUD operations
    def get_records(self, table_name: str, filters: Dict = None, limit: int = None) -> List[Dict]:
        """Generic method to get records from any table"""
        try:
            query = self.supabase.table(table_name).select('*')
            
            if filters:
                for key, value in filters.items():
                    query = query.eq(key, value)
            
            if limit:
                query = query.limit(limit)
            
            result = query.execute()
            return result.data if result.data else []
        except Exception as e:
            logger.error(f"Error fetching records from {table_name}: {e}")
            return []
    
    def create_record(self, table_name: str, data: Dict) -> Dict:
        """Generic method to create a record in any table"""
        try:
            result = self.supabase.table(table_name).insert(data).execute()
            return result.data[0] if result.data else {}
        except Exception as e:
            logger.error(f"Error creating record in {table_name}: {e}")
            raise e
    
    def update_record(self, table_name: str, record_id: str, data: Dict, id_field: str = 'id') -> Dict:
        """Generic method to update a record in any table"""
        try:
            result = self.supabase.table(table_name).update(data).eq(id_field, record_id).execute()
            return result.data[0] if result.data else {}
        except Exception as e:
            logger.error(f"Error updating record {record_id} in {table_name}: {e}")
            raise e
    
    def delete_record(self, table_name: str, record_id: str, id_field: str = 'id') -> bool:
        """Generic method to delete a record from any table"""
        try:
            result = self.supabase.table(table_name).delete().eq(id_field, record_id).execute()
            return True
        except Exception as e:
            logger.error(f"Error deleting record {record_id} from {table_name}: {e}")
            return False

    # Homepage Data Management
    def get_benefits(self) -> List[Dict]:
        """Get all benefits from Supabase"""
        try:
            result = self.supabase.table('benefits').select('*').order('id').execute()
            return result.data if result.data else []
        except Exception as e:
            logger.error(f"Error fetching benefits: {e}")
            return []
    
    def get_process_steps(self) -> List[Dict]:
        """Get all process steps from Supabase"""
        try:
            result = self.supabase.table('process_steps').select('*').order('step_number').execute()
            return result.data if result.data else []
        except Exception as e:
            logger.error(f"Error fetching process steps: {e}")
            return []
    
    def get_testimonials(self, featured_only: bool = False) -> List[Dict]:
        """Get testimonials from Supabase"""
        try:
            query = self.supabase.table('testimonials').select('*')
            if featured_only:
                query = query.eq('featured', True)
            
            result = query.order('created_at', desc=True).execute()
            return result.data if result.data else []
        except Exception as e:
            logger.error(f"Error fetching testimonials: {e}")
            return []
    
    def get_hero_slides(self, active_only: bool = True) -> List[Dict]:
        """Get hero slides from Supabase"""
        try:
            query = self.supabase.table('hero_slides').select('*')
            if active_only:
                query = query.eq('active', True)
            
            result = query.order('slide_order').execute()
            return result.data if result.data else []
        except Exception as e:
            logger.error(f"Error fetching hero slides: {e}")
            return []
    
    def get_home_data(self) -> Dict:
        """Get all homepage data in one call"""
        try:
            return {
                'benefits': self.get_benefits(),
                'process_steps': self.get_process_steps(),
                'testimonials': self.get_testimonials(featured_only=True),
                'hero_slides': self.get_hero_slides()
            }
        except Exception as e:
            logger.error(f"Error fetching home data: {e}")
            return {}

# Create a global instance
supabase_service = SupabaseService()
