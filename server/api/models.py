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
