from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.text import slugify
from django.utils import timezone
import bleach
import uuid

# Enhanced Company Model extending AbstractUser
class Company(AbstractUser):
    """Enhanced company model with authentication capabilities"""
    
    COMPANY_TYPE_CHOICES = [
        ('ngo', 'Non-Profit Organization'),
        ('startup', 'Startup'),
        ('social_enterprise', 'Social Enterprise'),
        ('corporate', 'Corporate'),
        ('government', 'Government'),
        ('other', 'Other'),
    ]
    
    SUBSCRIPTION_PLAN_CHOICES = [
        ('basic', 'Basic'),
        ('premium', 'Premium'),
        ('enterprise', 'Enterprise'),
    ]
    
    # Override groups and user_permissions to avoid conflicts
    groups = models.ManyToManyField(
        'auth.Group',
        verbose_name='groups',
        blank=True,
        help_text='The groups this user belongs to.',
        related_name='company_users',
        related_query_name='company_user',
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        verbose_name='user permissions',
        blank=True,
        help_text='Specific permissions for this user.',
        related_name='company_users',
        related_query_name='company_user',
    )
    
    # Company-specific fields
    company_name = models.CharField(max_length=200)
    contact_email = models.EmailField()
    phone = models.CharField(max_length=50, blank=True)
    company_type = models.CharField(max_length=20, choices=COMPANY_TYPE_CHOICES, default='other')
    
    # Account management
    is_verified = models.BooleanField(default=False)
    verification_token = models.CharField(max_length=100, blank=True)
    subscription_plan = models.CharField(max_length=20, choices=SUBSCRIPTION_PLAN_CHOICES, default='basic')
    
    # Business details
    billing_address = models.TextField(blank=True)
    tax_id = models.CharField(max_length=50, blank=True)
    website = models.URLField(blank=True)
    
    # Timestamps
    registration_date = models.DateTimeField(auto_now_add=True)
    last_login_date = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        verbose_name = 'Company'
        verbose_name_plural = 'Companies'
    
    def __str__(self):
        return f"{self.company_name} ({self.username})"
    
    def generate_verification_token(self):
        """Generate a unique verification token"""
        self.verification_token = str(uuid.uuid4())
        self.save()
        return self.verification_token


# Project Management Models
class Project(models.Model):
    """Project model for tracking development projects"""
    
    PROJECT_STATUS_CHOICES = [
        ('planning', 'Planning'),
        ('in_progress', 'In Progress'),
        ('testing', 'Testing'),
        ('completed', 'Completed'),
        ('on_hold', 'On Hold'),
        ('cancelled', 'Cancelled'),
    ]
    
    PRIORITY_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
        ('urgent', 'Urgent'),
    ]
    
    # Basic project information
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='projects')
    project_name = models.CharField(max_length=200)
    description = models.TextField()
    project_id = models.CharField(max_length=50, unique=True, blank=True)
    
    # Project status and timeline
    status = models.CharField(max_length=20, choices=PROJECT_STATUS_CHOICES, default='planning')
    priority = models.CharField(max_length=10, choices=PRIORITY_CHOICES, default='medium')
    created_at = models.DateTimeField(auto_now_add=True)
    start_date = models.DateField(null=True, blank=True)
    deadline = models.DateField(null=True, blank=True)
    completed_date = models.DateField(null=True, blank=True)
    
    # Financial tracking
    total_budget = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    paid_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    progress_percentage = models.IntegerField(default=0)
    
    # Project details
    tech_stack = models.JSONField(default=list)
    requirements = models.TextField(blank=True)
    deliverables = models.JSONField(default=list)
    
    def save(self, *args, **kwargs):
        if not self.project_id:
            self.project_id = f"HBC-{timezone.now().year}-{str(uuid.uuid4())[:8].upper()}"
        super().save(*args, **kwargs)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.project_name} - {self.company.company_name}"
    
    @property
    def remaining_budget(self):
        return self.total_budget - self.paid_amount
    
    @property
    def is_overdue(self):
        if self.deadline and self.status not in ['completed', 'cancelled']:
            return timezone.now().date() > self.deadline
        return False


# Enhanced ProjectEstimation Model
class ProjectEstimation(models.Model):
    """Enhanced estimation model with company account integration"""
    
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('pending_review', 'Pending Review'),
        ('requires_account', 'Requires Account'),
        ('pending_approval', 'Pending Approval'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
        ('expired', 'Expired'),
        ('converted_to_project', 'Converted to Project'),
    ]
    
    # Links to company and project
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='estimations', null=True, blank=True)
    project = models.ForeignKey(Project, on_delete=models.SET_NULL, null=True, blank=True, related_name='estimation')
    
    # Estimation identification
    estimation_id = models.CharField(max_length=50, unique=True, blank=True)
    session_id = models.CharField(max_length=100, blank=True)  # For anonymous sessions
    
    # Project details (from original model)
    project_name = models.CharField(max_length=200)
    company_name = models.CharField(max_length=200)
    company_type = models.CharField(max_length=50, default='other')
    description = models.TextField()
    tech_stack = models.JSONField(default=list)
    
    # Contact information
    contact_email = models.EmailField()
    contact_phone = models.CharField(max_length=50, blank=True)
    refer_agent_code = models.CharField(max_length=50, blank=True)
    
    # Estimation details
    breakdown_details = models.JSONField(default=dict)
    total_estimate = models.DecimalField(max_digits=10, decimal_places=2)
    estimated_days = models.IntegerField()
    hourly_rate = models.DecimalField(max_digits=6, decimal_places=2)
    discount_applied = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    
    # Additional requirements
    special_requirements = models.TextField(blank=True)
    timeline_requirements = models.TextField(blank=True)
    
    # Status and tracking
    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default='draft')
    requires_account = models.BooleanField(default=True)
    
    # Terms and approval
    terms_acknowledged = models.BooleanField(default=False)
    terms_acknowledged_at = models.DateTimeField(null=True, blank=True)
    approved_at = models.DateTimeField(null=True, blank=True)
    approved_by = models.ForeignKey(Company, on_delete=models.SET_NULL, null=True, blank=True, related_name='approved_estimations')
    
    # Conversation history
    conversation_history = models.JSONField(default=list)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    expires_at = models.DateTimeField(null=True, blank=True)
    
    def save(self, *args, **kwargs):
        if not self.estimation_id:
            self.estimation_id = f"EST-{timezone.now().year}-{str(uuid.uuid4())[:8].upper()}"
        super().save(*args, **kwargs)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Estimation {self.estimation_id} - {self.project_name}"
    
    def approve_estimation(self, approved_by_company):
        """Approve the estimation and optionally create a project"""
        self.status = 'approved'
        self.approved_at = timezone.now()
        self.approved_by = approved_by_company
        self.save()
        
        # Create a project from the estimation
        project = Project.objects.create(
            company=approved_by_company,
            project_name=self.project_name,
            description=self.description,
            total_budget=self.total_estimate,
            tech_stack=self.tech_stack,
            requirements=self.special_requirements,
        )
        
        self.project = project
        self.status = 'converted_to_project'
        self.save()
        
        return project


# Developer and Team Models
class DeveloperTeam(models.Model):
    """Development team model"""
    
    name = models.CharField(max_length=100)
    specialization = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.name


class Developer(AbstractUser):
    """Developer user model"""
    
    EXPERIENCE_CHOICES = [
        ('junior', 'Junior (0-2 years)'),
        ('mid', 'Mid-level (2-5 years)'),
        ('senior', 'Senior (5+ years)'),
        ('lead', 'Lead/Architect'),
    ]
    
    AVAILABILITY_CHOICES = [
        ('available', 'Available'),
        ('busy', 'Busy'),
        ('unavailable', 'Unavailable'),
    ]
    
    # Override groups and user_permissions to avoid conflicts
    groups = models.ManyToManyField(
        'auth.Group',
        verbose_name='groups',
        blank=True,
        help_text='The groups this user belongs to.',
        related_name='developer_users',
        related_query_name='developer_user',
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        verbose_name='user permissions',
        blank=True,
        help_text='Specific permissions for this user.',
        related_name='developer_users',
        related_query_name='developer_user',
    )
    
    # Developer details
    specialization = models.CharField(max_length=100)
    experience_level = models.CharField(max_length=10, choices=EXPERIENCE_CHOICES, default='mid')
    hourly_rate = models.DecimalField(max_digits=6, decimal_places=2, default=170)
    availability_status = models.CharField(max_length=15, choices=AVAILABILITY_CHOICES, default='available')
    
    # Team assignment
    team = models.ForeignKey(DeveloperTeam, on_delete=models.SET_NULL, null=True, blank=True, related_name='members')
    
    # Profile
    bio = models.TextField(blank=True)
    portfolio_url = models.URLField(blank=True)
    linkedin_url = models.URLField(blank=True)
    
    class Meta:
        verbose_name = 'Developer'
        verbose_name_plural = 'Developers'
    
    def __str__(self):
        return f"{self.get_full_name()} - {self.specialization}"


# Project Assignment Model
class ProjectAssignment(models.Model):
    """Track developer assignments to projects"""
    
    ROLE_CHOICES = [
        ('lead', 'Project Lead'),
        ('developer', 'Developer'),
        ('designer', 'Designer'),
        ('tester', 'Tester'),
    ]
    
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='assignments')
    developer = models.ForeignKey(Developer, on_delete=models.CASCADE, related_name='assignments')
    team = models.ForeignKey(DeveloperTeam, on_delete=models.CASCADE, related_name='project_assignments')
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='developer')
    
    assigned_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)
    
    class Meta:
        unique_together = ['project', 'developer']
    
    def __str__(self):
        return f"{self.developer.username} -> {self.project.project_name} ({self.role})"

class Benefit(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    icon = models.CharField(max_length=100)
    order = models.IntegerField(default=0)
    active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return self.title

class ProcessStep(models.Model):
    number = models.IntegerField()
    title = models.CharField(max_length=200)
    description = models.TextField()
    order = models.IntegerField(default=0)
    active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f"Step {self.number}: {self.title}"

class Testimonial(models.Model):
    quote = models.TextField()
    author_name = models.CharField(max_length=200)
    author_title = models.CharField(max_length=200)
    company = models.CharField(max_length=200, blank=True)
    rating = models.IntegerField(default=5)
    featured = models.BooleanField(default=False)
    order = models.IntegerField(default=0)
    active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f"{self.author_name} - {self.company}"

class HeroSlide(models.Model):
    title = models.CharField(max_length=200)
    subtitle = models.CharField(max_length=300)
    primary_button_text = models.CharField(max_length=100)
    primary_button_link = models.CharField(max_length=200)
    secondary_button_text = models.CharField(max_length=100, blank=True)
    secondary_button_link = models.CharField(max_length=200, blank=True)
    background_class = models.CharField(max_length=100)
    order = models.IntegerField(default=0)
    active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return self.title

class TeamMember(models.Model):
    name = models.CharField(max_length=200)
    position = models.CharField(max_length=200)
    bio = models.TextField()
    image_url = models.URLField(blank=True)
    linkedin_url = models.URLField(blank=True)
    twitter_url = models.URLField(blank=True)
    email = models.EmailField(blank=True)
    order = models.IntegerField(default=0)
    active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f"{self.name} - {self.position}"

class Service(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    short_description = models.CharField(max_length=300, blank=True)
    icon = models.CharField(max_length=100)
    features = models.JSONField(default=list)
    price_range = models.CharField(max_length=100, blank=True)
    duration = models.CharField(max_length=100, blank=True)
    category = models.CharField(max_length=100, blank=True)
    order = models.IntegerField(default=0)
    featured = models.BooleanField(default=False)
    active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return self.title

class Page(models.Model):
    title = models.CharField(max_length=200)
    slug = models.SlugField(unique=True, max_length=200)
    content = models.TextField()
    meta_title = models.CharField(max_length=200, blank=True)
    meta_description = models.TextField(blank=True)
    published = models.BooleanField(default=False)
    featured = models.BooleanField(default=False)
    author_name = models.CharField(max_length=100, blank=True)
    cover_image = models.URLField(blank=True)
    excerpt = models.TextField(blank=True)
    tags = models.CharField(max_length=500, blank=True)
    view_count = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-updated_at']

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        # Auto-generate slug if not provided
        if not self.slug:
            self.slug = slugify(self.title)
        
        # Sanitize HTML content
        if self.content:
            allowed_tags = [
                'p', 'br', 'strong', 'em', 'u', 's', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
                'ul', 'ol', 'li', 'blockquote', 'a', 'img', 'table', 'thead', 'tbody',
                'tr', 'td', 'th', 'div', 'span', 'pre', 'code'
            ]
            allowed_attributes = {
                '*': ['class', 'id', 'style'],
                'a': ['href', 'target', 'title'],
                'img': ['src', 'alt', 'title'],
            }
            self.content = bleach.clean(
                self.content, 
                tags=allowed_tags, 
                attributes=allowed_attributes,
                strip=True
            )
        
        super().save(*args, **kwargs)

    def increment_views(self):
        """Increment the view count for this page."""
        self.view_count += 1
        self.save(update_fields=['view_count'])


# AI Customer Service Models

class AdminSettings(models.Model):
    admin_email = models.EmailField(default='henry930@gmail.com')
    company_name = models.CharField(max_length=255, default='Higgs Boson Consultancy')
    email_notifications = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = "Admin Settings"
        verbose_name_plural = "Admin Settings"
    
    def __str__(self):
        return f"Admin Settings - {self.admin_email}"
    
    @classmethod
    def get_settings(cls):
        """Get or create admin settings"""
        settings, created = cls.objects.get_or_create(
            id=1,
            defaults={'admin_email': 'henry930@gmail.com'}
        )
        return settings


class Customer(models.Model):
    name = models.CharField(max_length=200, blank=True)
    email = models.EmailField(blank=True)
    phone = models.CharField(max_length=50, blank=True)
    company = models.CharField(max_length=200, blank=True)
    session_id = models.CharField(max_length=100, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name or 'Anonymous'} ({self.email or self.session_id})"


class ProjectRequirement(models.Model):
    PROJECT_TYPES = [
        ('web_app', 'Web Application'),
        ('mobile_app', 'Mobile Application'),
        ('ai_solution', 'AI Solution'),
        ('cloud_infrastructure', 'Cloud Infrastructure'),
        ('other', 'Other'),
    ]
    
    PRIORITY_LEVELS = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
        ('urgent', 'Urgent'),
    ]
    
    STATUS_CHOICES = [
        ('gathering', 'Gathering Requirements'),
        ('evaluating', 'Evaluating Feasibility'),
        ('quote_ready', 'Quote Ready'),
        ('quote_sent', 'Quote Sent'),
        ('approved', 'Approved'),
        ('contract_sent', 'Contract Sent'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ]

    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, related_name='requirements')
    project_title = models.CharField(max_length=300, blank=True)
    project_type = models.CharField(max_length=50, choices=PROJECT_TYPES, blank=True)
    description = models.TextField(blank=True)
    budget_range = models.CharField(max_length=100, blank=True)
    timeline = models.CharField(max_length=100, blank=True)
    priority = models.CharField(max_length=20, choices=PRIORITY_LEVELS, default='medium')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='gathering')
    
    # AI Evaluation Results
    feasibility_score = models.IntegerField(null=True, blank=True, help_text="1-10 scale")
    estimated_days = models.IntegerField(null=True, blank=True)
    estimated_cost = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    ai_evaluation = models.TextField(blank=True, help_text="AI analysis of the requirements")
    
    # Detailed Evaluation Data (new fields)
    detected_features = models.JSONField(default=list, blank=True, help_text="List of detected features")
    complexity_level = models.CharField(max_length=20, blank=True, help_text="simple, medium, complex, enterprise")
    hourly_rate = models.DecimalField(max_digits=8, decimal_places=2, null=True, blank=True, default=125)
    
    # Agent Assignment
    assigned_agent = models.CharField(max_length=200, blank=True)
    agent_notes = models.TextField(blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.project_title or 'Untitled Project'} - {self.customer.name or self.customer.session_id}"


class Conversation(models.Model):
    SPEAKER_CHOICES = [
        ('customer', 'Customer'),
        ('ai', 'AI Assistant'),
        ('agent', 'Human Agent'),
    ]

    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, related_name='conversations')
    requirement = models.ForeignKey(ProjectRequirement, on_delete=models.CASCADE, related_name='conversations', null=True, blank=True)
    speaker = models.CharField(max_length=20, choices=SPEAKER_CHOICES)
    message = models.TextField()
    metadata = models.JSONField(default=dict, blank=True)  # Store additional data like AI confidence, etc.
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['created_at']

    def __str__(self):
        return f"{self.speaker}: {self.message[:50]}..."


class Quote(models.Model):
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('sent', 'Sent'),
        ('viewed', 'Viewed'),
        ('accepted', 'Accepted'),
        ('rejected', 'Rejected'),
        ('expired', 'Expired'),
    ]

    requirement = models.ForeignKey(ProjectRequirement, on_delete=models.CASCADE, related_name='quotes')
    quote_number = models.CharField(max_length=50, unique=True)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    estimated_days = models.IntegerField()
    timeline = models.CharField(max_length=200)
    terms_and_conditions = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    valid_until = models.DateTimeField()
    sent_at = models.DateTimeField(null=True, blank=True)
    viewed_at = models.DateTimeField(null=True, blank=True)
    responded_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Quote {self.quote_number} - {self.requirement.project_title}"


class Contract(models.Model):
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('sent', 'Sent'),
        ('signed', 'Signed'),
        ('cancelled', 'Cancelled'),
    ]

    quote = models.OneToOneField(Quote, on_delete=models.CASCADE, related_name='contract')
    contract_number = models.CharField(max_length=50, unique=True)
    contract_content = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    sent_at = models.DateTimeField(null=True, blank=True)
    signed_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Contract {self.contract_number} - {self.quote.requirement.project_title}"


# Project Communication Model
class ProjectCommunication(models.Model):
    """Communication between companies and developers"""
    
    MESSAGE_TYPE_CHOICES = [
        ('message', 'Regular Message'),
        ('update', 'Project Update'),
        ('milestone', 'Milestone Update'),
        ('issue', 'Issue Report'),
        ('delivery', 'Delivery Notification'),
        ('payment', 'Payment Related'),
    ]
    
    SENDER_TYPE_CHOICES = [
        ('company', 'Company User'),
        ('developer', 'Developer'),
        ('admin', 'Admin'),
        ('system', 'System'),
    ]
    
    # Message details
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='communications')
    sender_company = models.ForeignKey(Company, on_delete=models.CASCADE, null=True, blank=True)
    sender_developer = models.ForeignKey(Developer, on_delete=models.CASCADE, null=True, blank=True)
    sender_type = models.CharField(max_length=10, choices=SENDER_TYPE_CHOICES)
    
    # Message content
    message = models.TextField()
    message_type = models.CharField(max_length=15, choices=MESSAGE_TYPE_CHOICES, default='message')
    attachments = models.JSONField(default=list)
    
    # Status tracking
    timestamp = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)
    read_at = models.DateTimeField(null=True, blank=True)
    
    # Threading
    reply_to = models.ForeignKey('self', on_delete=models.SET_NULL, null=True, blank=True, related_name='replies')
    
    class Meta:
        ordering = ['-timestamp']
    
    def __str__(self):
        sender = "Company" if self.sender_company else "Developer"
        return f"{sender} message in {self.project.project_name} at {self.timestamp}"
    
    def mark_as_read(self):
        """Mark message as read"""
        if not self.is_read:
            self.is_read = True
            self.read_at = timezone.now()
            self.save(update_fields=['is_read', 'read_at'])


# Payment Tracking Model
class PaymentTransaction(models.Model):
    """Track payments for projects"""
    
    PAYMENT_TYPE_CHOICES = [
        ('deposit', 'Initial Deposit'),
        ('milestone', 'Milestone Payment'),
        ('final', 'Final Payment'),
        ('refund', 'Refund'),
        ('extra', 'Additional Work'),
    ]
    
    PAYMENT_STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('processing', 'Processing'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
        ('refunded', 'Refunded'),
        ('disputed', 'Disputed'),
    ]
    
    PAYMENT_METHOD_CHOICES = [
        ('bank_transfer', 'Bank Transfer'),
        ('credit_card', 'Credit Card'),
        ('paypal', 'PayPal'),
        ('stripe', 'Stripe'),
        ('crypto', 'Cryptocurrency'),
        ('check', 'Check'),
    ]
    
    # Payment details
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='payments')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    payment_type = models.CharField(max_length=15, choices=PAYMENT_TYPE_CHOICES)
    status = models.CharField(max_length=15, choices=PAYMENT_STATUS_CHOICES, default='pending')
    
    # Payment processing
    payment_method = models.CharField(max_length=20, choices=PAYMENT_METHOD_CHOICES)
    transaction_id = models.CharField(max_length=100, blank=True)
    payment_gateway_response = models.JSONField(default=dict)
    
    # Dates
    created_at = models.DateTimeField(auto_now_add=True)
    due_date = models.DateField(null=True, blank=True)
    payment_date = models.DateTimeField(null=True, blank=True)
    
    # Notes and references
    notes = models.TextField(blank=True)
    invoice_number = models.CharField(max_length=50, blank=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Payment {self.transaction_id} - {self.project.project_name} - ${self.amount}"
    
    @property
    def is_overdue(self):
        """Check if payment is overdue"""
        if self.due_date and self.status == 'pending':
            return timezone.now().date() > self.due_date
        return False


# Project Milestone Model
class ProjectMilestone(models.Model):
    """Track project milestones and deliverables"""
    
    MILESTONE_STATUS_CHOICES = [
        ('planned', 'Planned'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('delayed', 'Delayed'),
        ('cancelled', 'Cancelled'),
    ]
    
    # Milestone details
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='milestones')
    title = models.CharField(max_length=200)
    description = models.TextField()
    order = models.PositiveIntegerField(default=0)
    
    # Status and dates
    status = models.CharField(max_length=15, choices=MILESTONE_STATUS_CHOICES, default='planned')
    due_date = models.DateField()
    completion_date = models.DateField(null=True, blank=True)
    
    # Payment and deliverables
    payment_percentage = models.IntegerField(default=0)  # Percentage of total project cost
    deliverables = models.JSONField(default=list)
    
    # Tracking
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['project', 'order']
        unique_together = ['project', 'order']
    
    def __str__(self):
        return f"{self.project.project_name} - {self.title}"
    
    @property
    def payment_amount(self):
        """Calculate payment amount for this milestone"""
        return (self.project.total_budget * self.payment_percentage) / 100
    
    @property
    def is_overdue(self):
        """Check if milestone is overdue"""
        if self.status not in ['completed', 'cancelled']:
            return timezone.now().date() > self.due_date
        return False


class JobApplication(models.Model):
    """Model for handling job applications with CV uploads"""
    
    EXPERIENCE_CHOICES = [
        ('0-1', '0-1 years'),
        ('1-3', '1-3 years'),
        ('3-5', '3-5 years'),
        ('5-8', '5-8 years'),
        ('8+', '8+ years'),
    ]
    
    STATUS_CHOICES = [
        ('new', 'New'),
        ('reviewing', 'Under Review'),
        ('interview', 'Interview Scheduled'),
        ('rejected', 'Rejected'),
        ('accepted', 'Accepted'),
    ]
    
    # Personal Information
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField()
    phone = models.CharField(max_length=20, blank=True)
    
    # Job Application Details
    position = models.CharField(max_length=200)
    experience = models.CharField(max_length=10, choices=EXPERIENCE_CHOICES)
    cover_letter = models.TextField()
    
    # File Upload
    cv = models.FileField(
        upload_to='applications/cvs/',
        help_text='Upload your CV/Resume (PDF, DOC, or DOCX format, max 5MB)'
    )
    
    # Optional Links
    linkedin = models.URLField(blank=True, help_text='LinkedIn profile URL')
    portfolio = models.URLField(blank=True, help_text='Portfolio or personal website URL')
    
    # Application Management
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='new')
    notes = models.TextField(blank=True, help_text='Internal notes for HR team')
    
    # Parsed CV Data (extracted from PDF)
    parsed_name = models.CharField(max_length=200, blank=True, help_text='Name extracted from CV')
    parsed_email = models.EmailField(blank=True, help_text='Email extracted from CV')
    parsed_phone = models.CharField(max_length=50, blank=True, help_text='Phone extracted from CV')
    parsed_linkedin = models.URLField(blank=True, help_text='LinkedIn extracted from CV')
    parsed_skills = models.TextField(blank=True, help_text='Skills extracted from CV (JSON format)')
    parsed_experience_years = models.CharField(max_length=50, blank=True, help_text='Experience years extracted from CV')
    parsed_education = models.TextField(blank=True, help_text='Education extracted from CV')
    parsed_summary = models.TextField(blank=True, help_text='Professional summary extracted from CV')
    cv_text_preview = models.TextField(blank=True, help_text='First 2000 chars of extracted CV text')
    cv_parsed_at = models.DateTimeField(null=True, blank=True, help_text='When CV was last parsed')
    cv_parse_success = models.BooleanField(default=False, help_text='Whether CV parsing was successful')
    cv_parse_error = models.TextField(blank=True, help_text='Error message if CV parsing failed')
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Job Application'
        verbose_name_plural = 'Job Applications'
        
    def __str__(self):
        return f"{self.first_name} {self.last_name} - {self.position}"

    @property
    def full_name(self):
        """Return full name of the applicant"""
        return f"{self.first_name} {self.last_name}"

    @property
    def application_age_days(self):
        """Return how many days ago this application was submitted"""
        from django.utils import timezone
        return (timezone.now() - self.created_at).days
    
    def parse_cv(self):
        """Parse the uploaded CV and extract information"""
        if not self.cv:
            return False
        
        try:
            from .cv_parser import parse_cv_file
            from django.utils import timezone
            import json
            
            # Get full file path
            cv_path = self.cv.path
            
            # Parse the CV
            parsed_info = parse_cv_file(cv_path)
            
            if parsed_info.get('success', False):
                # Store parsed information
                self.parsed_name = parsed_info.get('name', '')
                self.parsed_email = parsed_info.get('email', '')
                self.parsed_phone = parsed_info.get('phone', '')
                self.parsed_linkedin = parsed_info.get('linkedin', '')
                self.parsed_skills = json.dumps(parsed_info.get('skills', []))
                self.parsed_experience_years = parsed_info.get('experience_years', '')
                self.parsed_education = parsed_info.get('education', '')
                self.parsed_summary = parsed_info.get('summary', '')
                self.cv_text_preview = parsed_info.get('extracted_text', '')
                self.cv_parse_success = True
                self.cv_parse_error = ''
            else:
                self.cv_parse_success = False
                self.cv_parse_error = parsed_info.get('error', 'Unknown error')
            
            self.cv_parsed_at = timezone.now()
            self.save()
            
            return self.cv_parse_success
            
        except Exception as e:
            self.cv_parse_success = False
            self.cv_parse_error = str(e)
            self.cv_parsed_at = timezone.now()
            self.save()
            return False
    
    def get_parsed_skills_list(self):
        """Get parsed skills as a Python list"""
        try:
            import json
            return json.loads(self.parsed_skills) if self.parsed_skills else []
        except:
            return []


class Appointment(models.Model):
    """Model for handling consultation appointment requests"""
    
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
        ('rescheduled', 'Rescheduled'),
    ]
    
    SERVICE_CHOICES = [
        ('Web Development', 'Web Development'),
        ('Mobile App Development', 'Mobile App Development'),
        ('Cloud Solutions', 'Cloud Solutions'),
        ('DevOps Consulting', 'DevOps Consulting'),
        ('AI/ML Implementation', 'AI/ML Implementation'),
        ('Blockchain Development', 'Blockchain Development'),
        ('Technical Consulting', 'Technical Consulting'),
        ('System Architecture', 'System Architecture'),
    ]
    
    # Contact Information
    name = models.CharField(max_length=200)
    email = models.EmailField()
    phone = models.CharField(max_length=50, blank=True)
    company = models.CharField(max_length=200, blank=True)
    
    # Appointment Details
    service = models.CharField(max_length=100, choices=SERVICE_CHOICES)
    preferred_date = models.DateField()
    preferred_time = models.CharField(max_length=20)  # Format like "09:00-10:00"
    message = models.TextField(blank=True)
    
    # Status and Management
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    duration = models.IntegerField(default=30)  # Duration in minutes (30-minute appointments)
    meeting_link = models.URLField(blank=True)  # Zoom/Teams link if online
    notes = models.TextField(blank=True)  # Internal notes
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Appointment'
        verbose_name_plural = 'Appointments'
        constraints = [
            models.UniqueConstraint(
                fields=['preferred_date', 'preferred_time'],
                condition=models.Q(status__in=['pending', 'confirmed']),
                name='unique_appointment_slot'
            )
        ]
    
    def __str__(self):
        return f"{self.name} - {self.service} - {self.preferred_date} {self.preferred_time}"
    
    @property
    def is_upcoming(self):
        """Check if appointment is in the future"""
        return self.preferred_date >= timezone.now().date()
    
    def confirm_appointment(self, meeting_link=None):
        """Confirm the appointment and optionally set meeting link"""
        self.status = 'confirmed'
        if meeting_link:
            self.meeting_link = meeting_link
        self.save()
    
    def cancel_appointment(self, notes=None):
        """Cancel the appointment with optional notes"""
        self.status = 'cancelled'
        if notes:
            self.notes = notes
        self.save()
    
    @property
    def application_age_days(self):
        """Return number of days since application was submitted"""
        return (timezone.now() - self.created_at).days
