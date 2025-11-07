from django.db import models
from django.utils.text import slugify
from ckeditor_uploader.fields import RichTextUploadingField


class FAQCategory(models.Model):
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=120, unique=True, blank=True)
    description = models.TextField(blank=True)
    icon = models.CharField(max_length=50, blank=True, help_text="CSS class for icon (e.g., 'fas fa-car')")
    order = models.PositiveIntegerField(default=0, help_text="Order for display")
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['order', 'name']
        verbose_name = "FAQ Category"
        verbose_name_plural = "FAQ Categories"

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name

    def get_faq_count(self):
        return self.faqs.filter(is_published=True).count()


class FAQ(models.Model):
    PRIORITY_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
    ]

    question = models.CharField(max_length=500)
    slug = models.SlugField(max_length=255, unique=True, blank=True)
    answer = RichTextUploadingField()
    short_answer = models.TextField(max_length=300, blank=True, help_text="Brief answer for listings")
    category = models.ForeignKey(FAQCategory, on_delete=models.CASCADE, related_name='faqs')
    priority = models.CharField(max_length=10, choices=PRIORITY_CHOICES, default='medium')
    tags = models.CharField(max_length=255, blank=True, help_text="Comma-separated tags")
    is_published = models.BooleanField(default=True)
    is_featured = models.BooleanField(default=False, help_text="Show in featured FAQs")
    views = models.PositiveIntegerField(default=0)
    helpful_count = models.PositiveIntegerField(default=0)
    not_helpful_count = models.PositiveIntegerField(default=0)
    order = models.PositiveIntegerField(default=0, help_text="Order within category")
    # Author bio fields (optional per FAQ)
    author_name = models.CharField(max_length=100, blank=True)
    author_bio = models.TextField(blank=True)
    author_image = models.ImageField(upload_to='authors/', blank=True)
    # SEO metadata
    meta_title = models.CharField(max_length=255, blank=True)
    meta_description = models.TextField(blank=True)
    meta_keywords = models.CharField(max_length=255, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['category__order', 'order', '-created_at']
        verbose_name = "FAQ"
        verbose_name_plural = "FAQs"

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.question)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.question

    def get_tags_list(self):
        if self.tags:
            return [tag.strip() for tag in self.tags.split(',')]
        return []

    def get_helpfulness_percentage(self):
        total_votes = self.helpful_count + self.not_helpful_count
        if total_votes > 0:
            return round((self.helpful_count / total_votes) * 100, 1)
        return 0


class FAQFeedback(models.Model):
    faq = models.ForeignKey(FAQ, on_delete=models.CASCADE, related_name='feedback')
    is_helpful = models.BooleanField()
    comment = models.TextField(blank=True)
    ip_address = models.GenericIPAddressField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['faq', 'ip_address']
        verbose_name = "FAQ Feedback"
        verbose_name_plural = "FAQ Feedback"

    def __str__(self):
        return f"{'Helpful' if self.is_helpful else 'Not Helpful'} - {self.faq.question[:50]}"
