from django.db import models
from django.utils import timezone
from ckeditor.fields import RichTextField


class StaticPage(models.Model):
    # Admin can type any page name (slug) instead of selecting from dropdown
    # Note: Removing choices does not change the database schema and allows free text entry
    page_type = models.CharField(max_length=50, unique=True)
    title = models.CharField(max_length=200)
    # SEO metadata
    meta_title = models.CharField(max_length=200, blank=True)
    meta_description = models.TextField(max_length=300, blank=True)
    meta_keywords = models.CharField(max_length=255, blank=True)
    content = RichTextField()
    is_active = models.BooleanField(default=True)
    # Menu display controls
    menu_label = models.CharField(max_length=100, blank=True, help_text="Custom link text for menus; defaults to title")
    nav_group = models.CharField(max_length=50, blank=True, default='Company', help_text="Header menu group name for dropdown (e.g., Company)")
    # Navigation visibility controls
    show_in_navbar = models.BooleanField(default=False)
    nav_order = models.PositiveIntegerField(default=0)
    show_in_footer = models.BooleanField(default=True)
    footer_order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Static Page'
        verbose_name_plural = 'Static Pages'
        ordering = ['page_type']

    def __str__(self):
        # With free-text page_type, display the title or the raw page_type
        return self.title or self.page_type

# Proxy model to provide a dedicated admin menu for Footer "Company" items
class FooterMenuPage(StaticPage):
    class Meta:
        proxy = True
        verbose_name = "Company Menu Page"
        verbose_name_plural = "Company Menu Pages"


class TeamMember(models.Model):
    name = models.CharField(max_length=100)
    position = models.CharField(max_length=100)
    bio = models.TextField()
    image = models.ImageField(upload_to='team/', blank=True, null=True)
    email = models.EmailField(blank=True)
    linkedin_url = models.URLField(blank=True)
    twitter_url = models.URLField(blank=True)
    order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(default=timezone.now)
    
    class Meta:
        ordering = ['order', 'name']
    
    def __str__(self):
        return f"{self.name} - {self.position}"


class ContactSubmission(models.Model):
    INQUIRY_TYPES = [
        ('general', 'General Inquiry'),
        ('support', 'Support'),
        ('partnership', 'Partnership'),
        ('media', 'Media Inquiry'),
        ('feedback', 'Feedback'),
        ('other', 'Other'),
    ]
    
    name = models.CharField(max_length=100)
    email = models.EmailField()
    phone = models.CharField(max_length=20, blank=True)
    inquiry_type = models.CharField(max_length=20, choices=INQUIRY_TYPES, default='general')
    subject = models.CharField(max_length=200)
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(default=timezone.now)
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Contact Submission'
        verbose_name_plural = 'Contact Submissions'
    
    def __str__(self):
        return f"{self.name} - {self.subject}"


class CompanyInfo(models.Model):
    company_name = models.CharField(max_length=100, default='Insurance Panda')
    tagline = models.CharField(max_length=200, blank=True)
    description = models.TextField()
    address = models.TextField()
    phone = models.CharField(max_length=20)
    email = models.EmailField()
    website = models.URLField()

    # Logos (admin-configurable)
    navbar_logo = models.ImageField(upload_to='site/', blank=True, null=True)
    navbar_logo_alt = models.CharField(max_length=120, blank=True, help_text="Alt text for navbar logo")
    footer_logo = models.ImageField(upload_to='site/', blank=True, null=True)
    footer_logo_alt = models.CharField(max_length=120, blank=True, help_text="Alt text for footer logo")
    # Favicon (admin-configurable)
    favicon = models.ImageField(upload_to='site/', blank=True, null=True, help_text="Main site favicon (ICO/PNG)")
    
    # Social Media Links
    facebook_url = models.URLField(blank=True)
    twitter_url = models.URLField(blank=True)
    linkedin_url = models.URLField(blank=True)
    instagram_url = models.URLField(blank=True)
    
    # Footer disclaimer (admin-configurable)
    footer_disclaimer = models.TextField(blank=True, help_text="Footer disclaimer text shown at the bottom of the site")

    # Business Hours
    business_hours = models.TextField(help_text="Enter business hours in text format")
    
    # SEO
    meta_title = models.CharField(max_length=200, blank=True)
    meta_description = models.TextField(max_length=300, blank=True)
    meta_image = models.ImageField(upload_to='site/', blank=True, null=True, help_text="Image used for social sharing (Open Graph/Twitter)")
    meta_image_alt = models.CharField(max_length=120, blank=True, help_text="Alt text/description for social sharing image")
    
    # Status
    is_active = models.BooleanField(default=True, help_text="Only one company info can be active at a time")
    
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Company Information'
        verbose_name_plural = 'Company Information'
        ordering = ['-is_active', '-updated_at']
    
    def __str__(self):
        status = "Active" if self.is_active else "Inactive"
        return f"{self.company_name} ({status})"
    
    def save(self, *args, **kwargs):
        # If this instance is being set to active, deactivate all others
        if self.is_active:
            CompanyInfo.objects.exclude(pk=self.pk).update(is_active=False)
        super().save(*args, **kwargs)


# New model to store structured content for the Car Insurance Quotes page
class CarInsuranceQuotesPage(models.Model):
    title = models.CharField(max_length=200, default='Car Insurance Quotes')
    last_updated = models.DateField(blank=True, null=True)
    # SEO metadata
    meta_title = models.CharField(max_length=200, blank=True)
    meta_description = models.TextField(max_length=300, blank=True)
    meta_keywords = models.CharField(max_length=255, blank=True)

    # Structured content blocks
    intro_paragraphs = models.JSONField(default=list, blank=True)
    takeaways = models.JSONField(default=list, blank=True)
    state_insurance_data = models.JSONField(default=list, blank=True)
    faqs = models.JSONField(default=list, blank=True)

    # Full rich content and extras
    body_html = RichTextField(blank=True)
    toc_items = models.JSONField(default=list, blank=True)
    video_url = models.URLField(blank=True)

    # Author section
    AUTHOR_CONTEXT_CHOICES = [
        ('detail', 'Detail Page'),
        ('blog', 'Blog'),
        ('faq', 'FAQ'),
        ('content', 'Content Page'),
    ]
    author_name = models.CharField(max_length=100, blank=True)
    author_bio = models.TextField(blank=True)
    author_image = models.ImageField(upload_to='authors/', blank=True)
    author_context = models.CharField(max_length=20, choices=AUTHOR_CONTEXT_CHOICES, default='detail')

    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Car Insurance Quotes Page'
        verbose_name_plural = 'Car Insurance Quotes Pages'

    def __str__(self):
        return self.title