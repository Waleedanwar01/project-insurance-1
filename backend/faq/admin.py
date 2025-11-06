from django.contrib import admin
from .models import FAQCategory, FAQ, FAQFeedback


@admin.register(FAQCategory)
class FAQCategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug', 'get_faq_count', 'order', 'is_active', 'created_at']
    list_filter = ['is_active', 'created_at']
    search_fields = ['name', 'description']
    prepopulated_fields = {'slug': ('name',)}
    list_editable = ['order', 'is_active']
    ordering = ['order', 'name']

    def get_faq_count(self, obj):
        return obj.get_faq_count()
    get_faq_count.short_description = 'FAQ Count'


@admin.register(FAQ)
class FAQAdmin(admin.ModelAdmin):
    list_display = ['question', 'category', 'priority', 'is_published', 'is_featured', 'order', 'views', 'helpful_count', 'created_at']
    list_filter = ['category', 'priority', 'is_published', 'is_featured', 'created_at']
    search_fields = ['question', 'answer', 'short_answer', 'tags']
    prepopulated_fields = {'slug': ('question',)}
    list_editable = ['priority', 'is_published', 'is_featured', 'order']
    ordering = ['category__order', 'order', '-created_at']
    readonly_fields = ['views', 'helpful_count', 'not_helpful_count', 'created_at', 'updated_at']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('question', 'slug', 'category', 'priority')
        }),
        ('Content', {
            'fields': ('short_answer', 'answer')
        }),
        ('Settings', {
            'fields': ('is_published', 'is_featured', 'order', 'tags')
        }),
        ('Statistics', {
            'fields': ('views', 'helpful_count', 'not_helpful_count'),
            'classes': ('collapse',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

    def get_queryset(self, request):
        return super().get_queryset(request).select_related('category')


@admin.register(FAQFeedback)
class FAQFeedbackAdmin(admin.ModelAdmin):
    list_display = ['faq', 'is_helpful', 'ip_address', 'created_at']
    list_filter = ['is_helpful', 'created_at']
    search_fields = ['faq__question', 'comment', 'ip_address']
    readonly_fields = ['created_at']
    ordering = ['-created_at']

    def get_queryset(self, request):
        return super().get_queryset(request).select_related('faq')
