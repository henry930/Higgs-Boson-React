from django.db import models
from django.utils.text import slugify
import bleach

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
