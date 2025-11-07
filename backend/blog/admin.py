from django.contrib import admin
from django.utils.safestring import mark_safe
from .models import Category, BlogPost, BlogImage, BlogFeedback

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'type', 'parent')
    prepopulated_fields = {'slug': ('name',)}

@admin.register(BlogPost)
class BlogPostAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'author', 'is_published', 'published_at', 'views', 'helpful_count', 'not_helpful_count')
    search_fields = ('title', 'summary', 'content')
    list_filter = ('category', 'is_published', 'published_at')
    prepopulated_fields = {'slug': ('title',)}
    readonly_fields = (
        'views', 'helpful_count', 'not_helpful_count', 'published_at', 'updated_at',
        'feature_image_preview', 'author_image_preview'
    )
    fieldsets = (
        ('Basic', {
            'fields': ('title', 'slug', 'author', 'category', 'is_published')
        }),
        ('Media', {
            'fields': ('feature_image', 'feature_image_preview', 'video_url', 'attachments')
        }),
        ('Content', {
            'fields': ('summary', 'content')
        }),
        ('SEO', {
            'fields': ('meta_title', 'meta_description', 'meta_keywords')
        }),
        ('Author Bio', {
            'fields': ('author_name', 'author_bio', 'author_image', 'author_image_preview')
        }),
        ('Statistics', {
            'fields': ('views', 'helpful_count', 'not_helpful_count')
        }),
        ('Timestamps', {
            'fields': ('published_at', 'updated_at')
        }),
    )

    def feature_image_preview(self, obj):
        if obj and obj.feature_image:
            return mark_safe(f'<img src="{obj.feature_image.url}" style="max-height:120px;border-radius:8px;border:1px solid #ddd;" />')
        return "No feature image"
    feature_image_preview.short_description = "Feature image preview"

    def author_image_preview(self, obj):
        if obj and obj.author_image:
            return mark_safe(f'<img src="{obj.author_image.url}" style="height:96px;width:96px;object-fit:cover;border-radius:50%;border:1px solid #ddd;" />')
        return "No author image"
    author_image_preview.short_description = "Author image preview"

@admin.register(BlogImage)
class BlogImageAdmin(admin.ModelAdmin):
    list_display = ('caption', 'uploaded_at')

@admin.register(BlogFeedback)
class BlogFeedbackAdmin(admin.ModelAdmin):
    list_display = ('blog_post', 'is_helpful', 'ip_address', 'created_at')
    list_filter = ('is_helpful', 'created_at')
    search_fields = ('blog_post__title', 'comment')
    readonly_fields = ('created_at',)
