"""
AI Usage Control & Monitoring System
"""
from django.core.cache import cache
from django.utils import timezone
from datetime import timedelta
import logging

logger = logging.getLogger(__name__)

class AIUsageController:
    """Control and monitor AI API usage to prevent abuse"""
    
    def __init__(self):
        # Usage limits
        self.DAILY_LIMIT_PER_SESSION = 20  # 20 messages per session per day
        self.HOURLY_LIMIT_PER_IP = 50      # 50 messages per IP per hour
        self.MONTHLY_BUDGET_LIMIT = 100    # £100 per month AI costs
        self.COST_PER_REQUEST = 0.02       # ~£0.02 per ChatGPT request
    
    def check_usage_limits(self, session_id, ip_address):
        """Check if request should be allowed based on usage limits"""
        
        # Check daily session limit
        daily_key = f"ai_usage_daily_{session_id}_{timezone.now().date()}"
        daily_count = cache.get(daily_key, 0)
        
        if daily_count >= self.DAILY_LIMIT_PER_SESSION:
            return False, "Daily message limit reached. Please continue tomorrow or contact us directly."
        
        # Check hourly IP limit (prevent bot attacks)
        hourly_key = f"ai_usage_hourly_{ip_address}_{timezone.now().hour}"
        hourly_count = cache.get(hourly_key, 0)
        
        if hourly_count >= self.HOURLY_LIMIT_PER_IP:
            return False, "Too many requests. Please try again in an hour."
        
        # Check monthly budget
        monthly_key = f"ai_cost_monthly_{timezone.now().strftime('%Y-%m')}"
        monthly_cost = cache.get(monthly_key, 0.0)
        
        if monthly_cost >= self.MONTHLY_BUDGET_LIMIT:
            return False, "AI service temporarily unavailable. Please contact us directly for assistance."
        
        return True, None
    
    def record_usage(self, session_id, ip_address):
        """Record AI usage for monitoring"""
        
        # Increment daily session counter
        daily_key = f"ai_usage_daily_{session_id}_{timezone.now().date()}"
        cache.set(daily_key, cache.get(daily_key, 0) + 1, 24 * 60 * 60)  # 24 hours
        
        # Increment hourly IP counter
        hourly_key = f"ai_usage_hourly_{ip_address}_{timezone.now().hour}"
        cache.set(hourly_key, cache.get(hourly_key, 0) + 1, 60 * 60)  # 1 hour
        
        # Add to monthly cost
        monthly_key = f"ai_cost_monthly_{timezone.now().strftime('%Y-%m')}"
        current_cost = cache.get(monthly_key, 0.0)
        cache.set(monthly_key, current_cost + self.COST_PER_REQUEST, 31 * 24 * 60 * 60)  # 31 days
        
        # Log usage for monitoring
        logger.info(f"AI request: session={session_id}, ip={ip_address}, cost=£{self.COST_PER_REQUEST}")
    
    def get_usage_stats(self):
        """Get current usage statistics"""
        monthly_key = f"ai_cost_monthly_{timezone.now().strftime('%Y-%m')}"
        monthly_cost = cache.get(monthly_key, 0.0)
        
        return {
            'monthly_cost': monthly_cost,
            'monthly_budget': self.MONTHLY_BUDGET_LIMIT,
            'budget_remaining': max(0, self.MONTHLY_BUDGET_LIMIT - monthly_cost),
            'percentage_used': (monthly_cost / self.MONTHLY_BUDGET_LIMIT) * 100
        }


class CustomerTypeDetector:
    """Detect customer type for pricing adjustments"""
    
    def __init__(self):
        self.company_types = {
            'startup': {
                'keywords': ['startup', 'new business', 'just started', 'founding', 'entrepreneur'],
                'discount': 0.15,  # 15% discount
                'max_discount_amount': 2000  # Max £2000 discount
            },
            'nonprofit': {
                'keywords': ['charity', 'non-profit', 'nonprofit', 'ngo', 'foundation', 'volunteer'],
                'discount': 0.20,  # 20% discount
                'max_discount_amount': 3000  # Max £3000 discount
            },
            'education': {
                'keywords': ['school', 'university', 'college', 'education', 'student', 'academic'],
                'discount': 0.25,  # 25% discount
                'max_discount_amount': 5000  # Max £5000 discount
            },
            'small_business': {
                'keywords': ['small business', 'local business', 'family business', 'sole trader'],
                'discount': 0.10,  # 10% discount
                'max_discount_amount': 1500  # Max £1500 discount
            }
        }
    
    def detect_customer_type(self, customer_info, conversation_text):
        """Detect customer type from info and conversation"""
        
        # Combine all text for analysis
        text_to_analyze = ""
        if customer_info.get('company'):
            text_to_analyze += f" {customer_info['company']}"
        text_to_analyze += f" {conversation_text}"
        text_to_analyze = text_to_analyze.lower()
        
        # Check for type indicators
        for customer_type, config in self.company_types.items():
            for keyword in config['keywords']:
                if keyword in text_to_analyze:
                    return customer_type, config['discount'], config['max_discount_amount']
        
        return None, 0, 0
    
    def apply_discount(self, base_cost, customer_type, discount_rate, max_discount):
        """Apply appropriate discount"""
        
        discount_amount = min(base_cost * discount_rate, max_discount)
        final_cost = base_cost - discount_amount
        
        return {
            'original_cost': base_cost,
            'discount_type': customer_type,
            'discount_rate': discount_rate,
            'discount_amount': discount_amount,
            'final_cost': final_cost,
            'savings_message': f"Special {customer_type.replace('_', ' ').title()} Discount: £{discount_amount:,.0f} saved!"
        }
