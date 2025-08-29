"""
CV PDF Parser Service

This service automatically scans and parses PDF CVs from the CV directory,
extracting key information like name, contact details, experience, and skills.
"""
import os
import re
import logging
from pathlib import Path
from typing import Dict, List, Optional

try:
    import PyPDF2
    import pdfplumber
    PDF_LIBS_AVAILABLE = True
except ImportError:
    PDF_LIBS_AVAILABLE = False

from django.conf import settings
from .models import JobApplication

logger = logging.getLogger(__name__)


class CVParser:
    """PDF CV parser using multiple extraction methods"""
    
    def __init__(self):
        """Initialize the CV parser"""
        self.cv_directory = Path(settings.BASE_DIR).parent / 'CV'
        
    def scan_cv_directory(self) -> List[str]:
        """Scan the CV directory for PDF files"""
        if not self.cv_directory.exists():
            logger.warning(f"CV directory does not exist: {self.cv_directory}")
            return []
        
        pdf_files = []
        for file_path in self.cv_directory.glob('*.pdf'):
            pdf_files.append(str(file_path))
        
        logger.info(f"Found {len(pdf_files)} PDF files in CV directory")
        return pdf_files
    
    def parse_cv_file(self, file_path: str) -> Dict[str, any]:
        """Parse a single CV PDF file and extract information"""
        if not PDF_LIBS_AVAILABLE:
            logger.error("PDF parsing libraries not available. Install PyPDF2 and pdfplumber.")
            return {}
        
        try:
            # Try pdfplumber first (better text extraction)
            extracted_data = self._parse_with_pdfplumber(file_path)
            
            # If pdfplumber fails, try PyPDF2
            if not extracted_data.get('text'):
                logger.info(f"Trying PyPDF2 for {file_path}")
                extracted_data = self._parse_with_pypdf2(file_path)
            
            # Process the extracted text
            if extracted_data.get('text'):
                parsed_info = self._extract_cv_information(extracted_data['text'])
                parsed_info['file_path'] = file_path
                parsed_info['file_name'] = os.path.basename(file_path)
                return parsed_info
            
        except Exception as e:
            logger.error(f"Error parsing CV {file_path}: {str(e)}")
            
        return {}
    
    def _parse_with_pdfplumber(self, file_path: str) -> Dict[str, str]:
        """Extract text using pdfplumber"""
        try:
            with pdfplumber.open(file_path) as pdf:
                text = ""
                for page in pdf.pages:
                    page_text = page.extract_text()
                    if page_text:
                        text += page_text + "\n"
                
                return {'text': text, 'method': 'pdfplumber'}
        except Exception as e:
            logger.error(f"pdfplumber failed for {file_path}: {str(e)}")
            return {}
    
    def _parse_with_pypdf2(self, file_path: str) -> Dict[str, str]:
        """Extract text using PyPDF2"""
        try:
            with open(file_path, 'rb') as file:
                pdf_reader = PyPDF2.PdfReader(file)
                text = ""
                
                for page in pdf_reader.pages:
                    page_text = page.extract_text()
                    if page_text:
                        text += page_text + "\n"
                
                return {'text': text, 'method': 'PyPDF2'}
        except Exception as e:
            logger.error(f"PyPDF2 failed for {file_path}: {str(e)}")
            return {}
    
    def _extract_cv_information(self, text: str) -> Dict[str, any]:
        """Extract structured information from CV text"""
        info = {
            'name': '',
            'email': '',
            'phone': '',
            'skills': [],
            'experience_years': '',
            'education': '',
            'summary': '',
            'raw_text': text
        }
        
        # Extract email
        email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
        emails = re.findall(email_pattern, text)
        if emails:
            info['email'] = emails[0]
        
        # Extract phone numbers
        phone_patterns = [
            r'\+?1?[-.\s]?\(?[0-9]{3}\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}',  # US format
            r'\+?[0-9]{1,3}[-.\s]?[0-9]{1,4}[-.\s]?[0-9]{1,4}[-.\s]?[0-9]{1,9}',  # International
        ]
        for pattern in phone_patterns:
            phones = re.findall(pattern, text)
            if phones:
                info['phone'] = phones[0].strip()
                break
        
        # Extract name (first few lines, excluding common CV headers)
        lines = text.split('\n')
        name_candidates = []
        skip_words = ['resume', 'curriculum', 'vitae', 'cv', 'profile', 'contact']
        
        for line in lines[:5]:  # Check first 5 lines
            line = line.strip()
            if (len(line) > 2 and 
                len(line) < 50 and 
                not any(skip in line.lower() for skip in skip_words) and
                not re.search(r'[@\d]', line)):  # No email or numbers
                name_candidates.append(line)
        
        if name_candidates:
            info['name'] = name_candidates[0]
        
        # Extract skills - look for common skill keywords
        skill_keywords = [
            'python', 'javascript', 'java', 'react', 'angular', 'vue', 'node.js',
            'django', 'flask', 'sql', 'mysql', 'postgresql', 'mongodb',
            'html', 'css', 'bootstrap', 'git', 'docker', 'kubernetes',
            'aws', 'azure', 'machine learning', 'ai', 'data science'
        ]
        
        found_skills = []
        text_lower = text.lower()
        for skill in skill_keywords:
            if skill in text_lower:
                found_skills.append(skill)
        
        info['skills'] = found_skills
        
        # Extract experience years
        experience_patterns = [
            r'(\d+)\+?\s*years?\s*(?:of\s*)?experience',
            r'experience[:\s]*(\d+)\+?\s*years?',
            r'(\d+)\+?\s*years?\s*(?:in|with)',
        ]
        
        for pattern in experience_patterns:
            matches = re.findall(pattern, text.lower())
            if matches:
                info['experience_years'] = f"{matches[0]}+ years"
                break
        
        # Extract education
        education_keywords = ['university', 'college', 'bachelor', 'master', 'phd', 'degree', 'education']
        education_lines = []
        
        for line in lines:
            if any(keyword in line.lower() for keyword in education_keywords):
                education_lines.append(line.strip())
        
        if education_lines:
            info['education'] = '; '.join(education_lines[:3])  # First 3 education lines
        
        # Create summary (first paragraph or first few sentences)
        summary_lines = []
        for line in lines:
            line = line.strip()
            if len(line) > 20:  # Substantial content
                summary_lines.append(line)
                if len(' '.join(summary_lines)) > 200:  # Stop at ~200 chars
                    break
        
        if summary_lines:
            info['summary'] = ' '.join(summary_lines)[:300] + '...' if len(' '.join(summary_lines)) > 300 else ' '.join(summary_lines)
        
        return info
    
    def process_new_cv(self, cv_file_path: str) -> Optional[Dict[str, any]]:
        """Process a newly uploaded CV file"""
        logger.info(f"Processing new CV: {cv_file_path}")
        
        parsed_data = self.parse_cv_file(cv_file_path)
        
        if parsed_data:
            logger.info(f"Successfully parsed CV: {parsed_data.get('name', 'Unknown')}")
            return parsed_data
        else:
            logger.warning(f"Failed to parse CV: {cv_file_path}")
            return None
    
    def update_job_application_with_parsed_data(self, job_application: JobApplication, parsed_data: Dict[str, any]) -> bool:
        """Update a JobApplication instance with parsed CV data"""
        try:
            # Only update if fields are empty or if parsed data seems better
            if parsed_data.get('name') and not job_application.first_name:
                # Try to split name into first and last
                name_parts = parsed_data['name'].split()
                if len(name_parts) >= 2:
                    job_application.first_name = name_parts[0]
                    job_application.last_name = ' '.join(name_parts[1:])
                else:
                    job_application.first_name = parsed_data['name']
            
            if parsed_data.get('email') and not job_application.email:
                job_application.email = parsed_data['email']
            
            if parsed_data.get('phone') and not job_application.phone:
                job_application.phone = parsed_data['phone']
            
            # Add parsed info to notes
            cv_info = f"\n\n=== AUTO-PARSED CV INFO ===\n"
            cv_info += f"Skills: {', '.join(parsed_data.get('skills', []))}\n"
            cv_info += f"Experience: {parsed_data.get('experience_years', 'Not specified')}\n"
            cv_info += f"Education: {parsed_data.get('education', 'Not specified')}\n"
            cv_info += f"Summary: {parsed_data.get('summary', 'Not available')}\n"
            cv_info += f"Parsed from: {parsed_data.get('file_name', 'Unknown file')}\n"
            
            job_application.notes = (job_application.notes or '') + cv_info
            job_application.save()
            
            logger.info(f"Updated JobApplication {job_application.id} with parsed CV data")
            return True
            
        except Exception as e:
            logger.error(f"Error updating JobApplication with parsed data: {str(e)}")
            return False


# Singleton instance
cv_parser = CVParser()


def parse_cv_directory():
    """Utility function to parse all CVs in the directory"""
    """This can be called from management commands or admin actions"""
    pdf_files = cv_parser.scan_cv_directory()
    results = []
    
    for pdf_file in pdf_files:
        parsed_data = cv_parser.parse_cv_file(pdf_file)
        if parsed_data:
            results.append(parsed_data)
    
    logger.info(f"Parsed {len(results)} CV files successfully")
    return results


def process_uploaded_cv(job_application: JobApplication):
    """Process CV for a specific job application"""
    if not job_application.cv:
        return False
    
    cv_file_path = job_application.cv.path
    parsed_data = cv_parser.process_new_cv(cv_file_path)
    
    if parsed_data:
        return cv_parser.update_job_application_with_parsed_data(job_application, parsed_data)
    
    return False