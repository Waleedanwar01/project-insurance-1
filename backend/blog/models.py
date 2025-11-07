from django.db import models
from django.contrib.auth import get_user_model
from ckeditor_uploader.fields import RichTextUploadingField
from django.utils.text import slugify

User = get_user_model()

class Category(models.Model):
    CATEGORY_TYPES = [
        ('main', 'Main Category'),
        ('sub', 'Sub Category'),
        ('none', 'None'),
    ]

    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=120, unique=True, blank=True)
    type = models.CharField(max_length=20, choices=CATEGORY_TYPES, default='none')
    parent = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name='subcategories')

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        if self.parent:
            return f"{self.parent.name} → {self.name}"
        return self.name


class BlogPost(models.Model):
    title = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True)
    author = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, blank=True)
    summary = models.TextField(blank=True)
    content = RichTextUploadingField()
    feature_image = models.ImageField(upload_to='blog/images/', null=True, blank=True)
    additional_images = models.ManyToManyField('BlogImage', blank=True)
    video_url = models.URLField(blank=True, null=True)
    attachments = models.FileField(upload_to='blog/attachments/', blank=True, null=True)
    # Author bio fields (optional per post)
    author_name = models.CharField(max_length=100, blank=True)
    author_bio = models.TextField(blank=True)
    author_image = models.ImageField(upload_to='authors/', blank=True)
    # SEO metadata
    meta_title = models.CharField(max_length=255, blank=True)
    meta_description = models.TextField(blank=True)
    meta_keywords = models.CharField(max_length=255, blank=True)
    is_published = models.BooleanField(default=True)
    published_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    views = models.PositiveIntegerField(default=0)
    helpful_count = models.PositiveIntegerField(default=0)
    not_helpful_count = models.PositiveIntegerField(default=0)
    chart_data = models.JSONField(blank=True, null=True)

    class Meta:
        ordering = ['-published_at']

    def __str__(self):
        return self.title

    def get_helpfulness_percentage(self):
        total_votes = self.helpful_count + self.not_helpful_count
        if total_votes > 0:
            return round((self.helpful_count / total_votes) * 100, 1)
        return 0


class BlogImage(models.Model):
    image = models.ImageField(upload_to='blog/images/')
    caption = models.CharField(max_length=255, blank=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.caption or f"Image {self.pk}"


class BlogFeedback(models.Model):
    blog_post = models.ForeignKey(BlogPost, on_delete=models.CASCADE, related_name='feedback')
    is_helpful = models.BooleanField()
    comment = models.TextField(blank=True)
    ip_address = models.GenericIPAddressField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['blog_post', 'ip_address']
        verbose_name = "Blog Feedback"
        verbose_name_plural = "Blog Feedback"

    def __str__(self):
        return f"{'Helpful' if self.is_helpful else 'Not Helpful'} - {self.blog_post.title[:50]}"
