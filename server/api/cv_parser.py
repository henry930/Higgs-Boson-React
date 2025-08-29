"""
CV/Resume PDF Parser Service
Extracts structured information from uploaded CV PDFs
"""
import re
import os
import logging
from typing import Dict, Optional, List
import PyPDF2
import pdfplumber
from django.conf import settings

logger = logging.getLogger(__name__)


class CVParser:
    """PDF CV Parser using multiple extraction strategies"""

    def __init__(self):
        self.email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b'
        self.phone_pattern = r'(\+?[\d\s\-\(\)]{10,})'
        self.linkedin_pattern = r'linkedin\.com/in/[\w\-]+'

    def parse_cv(self, file_path: str) -> Dict:
        """
        Main method to parse CV and extract structured information
        """
        try:
            # Try pdfplumber first (better for complex layouts)
            text = self._extract_text_pdfplumber(file_path)
            if not text.strip():
                # Fallback to PyPDF2
                text = self._extract_text_pypdf2(file_path)

            if not text.strip():
                return {
                    'success': False,
                    'error': 'Could not extract text from PDF',
                    'extracted_text': ''
                }

            # Extract structured information
            parsed_info = self._extract_information(text)
            parsed_info['success'] = True
            # First 2000 chars for preview
            parsed_info['extracted_text'] = text[:2000]

            return parsed_info

        except Exception as e:
            logger.error(f"Error parsing CV {file_path}: {str(e)}")
            return {
                'success': False,
                'error': str(e),
                'extracted_text': ''
            }

    def _extract_text_pdfplumber(self, file_path: str) -> str:
        """Extract text using pdfplumber (better for tables and complex layouts)"""
        text = ""
        try:
            with pdfplumber.open(file_path) as pdf:
                for page in pdf.pages:
                    page_text = page.extract_text()
                    if page_text:
                        text += page_text + "\n"
        except Exception as e:
            logger.warning(f"pdfplumber failed for {file_path}: {str(e)}")
        return text

    def _extract_text_pypdf2(self, file_path: str) -> str:
        """Extract text using PyPDF2 (fallback method)"""
        text = ""
        try:
            with open(file_path, 'rb') as file:
                pdf_reader = PyPDF2.PdfReader(file)
                for page in pdf_reader.pages:
                    page_text = page.extract_text()
                    if page_text:
                        text += page_text + "\n"
        except Exception as e:
            logger.warning(f"PyPDF2 failed for {file_path}: {str(e)}")
        return text

    def _extract_information(self, text: str) -> Dict:
        """Extract structured information from CV text"""
        info = {
            'name': self._extract_name(text),
            'email': self._extract_email(text),
            'phone': self._extract_phone(text),
            'linkedin': self._extract_linkedin(text),
            'skills': self._extract_skills(text),
            'experience_years': self._extract_experience_years(text),
            'education': self._extract_education(text),
            'summary': self._extract_summary(text)
        }
        return info

    def _extract_name(self, text: str) -> str:
        """Extract candidate name (usually at the top of CV)"""
        lines = [line.strip() for line in text.split('\n') if line.strip()]
        if not lines:
            return ""

        # First line is often the name
        first_line = lines[0]

        # Filter out common CV headers
        exclude_patterns = [
            r'curriculum.*vitae',
            r'resume',
            r'cv',
            r'contact.*information',
            r'personal.*details'
        ]

        for pattern in exclude_patterns:
            if re.search(pattern, first_line, re.IGNORECASE):
                # Try next lines
                for line in lines[1:5]:  # Check next 4 lines
                    if not any(re.search(p, line, re.IGNORECASE) for p in exclude_patterns):
                        if len(line.split()) <= 4 and len(line) > 5:  # Reasonable name length
                            return line
                return ""

        # Clean the name
        name = re.sub(r'[^\w\s]', '', first_line)
        if len(name.split()) <= 4 and len(name) > 2:
            return name

        return ""

    def _extract_email(self, text: str) -> str:
        """Extract email address"""
        emails = re.findall(self.email_pattern, text)
        return emails[0] if emails else ""

    def _extract_phone(self, text: str) -> str:
        """Extract phone number"""
        phones = re.findall(self.phone_pattern, text)
        if phones:
            # Clean and format phone number
            phone = re.sub(r'[^\d+]', '', phones[0])
            return phone
        return ""

    def _extract_linkedin(self, text: str) -> str:
        """Extract LinkedIn profile"""
        linkedin_matches = re.findall(
            self.linkedin_pattern, text, re.IGNORECASE)
        return f"https://{linkedin_matches[0]}" if linkedin_matches else ""

    def _extract_skills(self, text: str) -> List[str]:
        """Extract technical skills"""
        # Common technical skills keywords
        skill_keywords = [
            'python', 'javascript', 'java', 'react', 'angular', 'vue',
            'node.js', 'django', 'flask', 'spring', 'html', 'css',
            'sql', 'mongodb', 'postgresql', 'mysql', 'git', 'docker',
            'kubernetes', 'aws', 'azure', 'gcp', 'tensorflow', 'pytorch',
            'machine learning', 'data science', 'api', 'rest', 'graphql',
            'typescript', 'c++', 'c#', 'php', 'ruby', 'go', 'rust'
        ]

        found_skills = []
        text_lower = text.lower()

        for skill in skill_keywords:
            if skill.lower() in text_lower:
                found_skills.append(skill.title())

        return found_skills[:10]  # Limit to 10 skills

    def _extract_experience_years(self, text: str) -> str:
        """Extract years of experience"""
        # Look for patterns like "5 years experience", "3+ years", etc.
        experience_patterns = [
            r'(\d+)\+?\s*years?\s*(of\s*)?experience',
            r'(\d+)\+?\s*years?\s*in',
            r'experience.*?(\d+)\+?\s*years?',
        ]

        for pattern in experience_patterns:
            matches = re.findall(pattern, text, re.IGNORECASE)
            if matches:
                years = matches[0] if isinstance(
                    matches[0], str) else matches[0][0]
                return f"{years} years"

        return ""

    def _extract_education(self, text: str) -> str:
        """Extract education information"""
        education_keywords = [
            r'bachelor.*?degree',
            r'master.*?degree',
            r'phd',
            r'doctorate',
            r'university',
            r'college',
            r'computer science',
            r'software engineering',
            r'engineering'
        ]

        education_info = []
        lines = text.split('\n')

        for i, line in enumerate(lines):
            for keyword in education_keywords:
                if re.search(keyword, line, re.IGNORECASE):
                    # Include current line and potentially next line
                    edu_text = line.strip()
                    if i + 1 < len(lines):
                        next_line = lines[i + 1].strip()
                        if len(next_line) < 100:  # Avoid long paragraphs
                            edu_text += " " + next_line
                    education_info.append(edu_text)
                    break

        return '; '.join(education_info[:3])  # Limit to 3 entries

    def _extract_summary(self, text: str) -> str:
        """Extract professional summary/objective"""
        summary_keywords = [
            'summary', 'objective', 'profile', 'about', 'overview'
        ]

        lines = text.split('\n')
        for i, line in enumerate(lines):
            for keyword in summary_keywords:
                if keyword.lower() in line.lower() and len(line) < 50:
                    # Found a summary section header, get next few lines
                    summary_lines = []
                    for j in range(i + 1, min(i + 5, len(lines))):
                        next_line = lines[j].strip()
                        if next_line and len(next_line) > 20:
                            summary_lines.append(next_line)
                        elif len(summary_lines) > 0:
                            break
                    return ' '.join(summary_lines)[:300]  # Limit to 300 chars

        # If no summary section found, use first paragraph
        paragraphs = [p.strip()
                      for p in text.split('\n\n') if len(p.strip()) > 50]
        if paragraphs:
            return paragraphs[0][:300]

        return ""


def parse_cv_file(file_path: str) -> Dict:
    """
    Convenience function to parse a single CV file
    """
    parser = CVParser()
    return parser.parse_cv(file_path)


def scan_and_parse_cv_directory(directory_path: str = None) -> List[Dict]:
    """
    Scan CV directory and parse all PDF files
    """
    if directory_path is None:
        directory_path = os.path.join(
            settings.MEDIA_ROOT, 'applications', 'cvs')

    if not os.path.exists(directory_path):
        logger.warning(f"CV directory does not exist: {directory_path}")
        return []

    results = []
    parser = CVParser()

    for filename in os.listdir(directory_path):
        if filename.lower().endswith('.pdf'):
            file_path = os.path.join(directory_path, filename)
            try:
                parsed_info = parser.parse_cv(file_path)
                parsed_info['filename'] = filename
                parsed_info['file_path'] = file_path
                results.append(parsed_info)
                logger.info(f"Parsed CV: {filename}")
            except Exception as e:
                logger.error(f"Failed to parse {filename}: {str(e)}")
                results.append({
                    'filename': filename,
                    'file_path': file_path,
                    'success': False,
                    'error': str(e)
                })

    return results
