from django.contrib import admin
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
    readonly_fields = ('views', 'helpful_count', 'not_helpful_count')

@admin.register(BlogImage)
class BlogImageAdmin(admin.ModelAdmin):
    list_display = ('caption', 'uploaded_at')

@admin.register(BlogFeedback)
class BlogFeedbackAdmin(admin.ModelAdmin):
    list_display = ('blog_post', 'is_helpful', 'ip_address', 'created_at')
    list_filter = ('is_helpful', 'created_at')
    search_fields = ('blog_post__title', 'comment')
    readonly_fields = ('created_at',)
