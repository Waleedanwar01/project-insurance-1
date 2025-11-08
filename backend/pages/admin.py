from django.contrib import admin
from django.db.models import Max

from .models import (
    GuideMenuPage,
    CoreSitePage,
    NavbarMenuPage,
    StaticPage,
    CompanyInfo,
    ContactSubmission,
)
from django.db.models import Q


@admin.register(GuideMenuPage)
class GuideMenuPageAdmin(admin.ModelAdmin):
    list_display = (
        'title', 'page_type', 'show_in_navbar', 'nav_group', 'nav_order', 'is_active'
    )
    list_filter = ('show_in_navbar', 'is_active')
    search_fields = ('title', 'page_type', 'meta_title', 'meta_description', 'meta_keywords')

    actions = ['add_to_insurance_guide', 'remove_from_insurance_guide', 'reorder_insurance_guide']

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        return qs.filter(nav_group='Insurance Guide')

    def add_to_insurance_guide(self, request, queryset):
        current_max = StaticPage.objects.filter(
            nav_group='Insurance Guide', show_in_navbar=True
        ).aggregate(Max('nav_order')).get('nav_order__max') or 0
        next_order = current_max + 1
        for obj in queryset:
            obj.nav_group = 'Insurance Guide'
            obj.show_in_navbar = True
            if not obj.nav_order or obj.nav_order <= 0:
                obj.nav_order = next_order
                next_order += 1
            obj.save()
        self.message_user(request, "Selected pages added to Insurance Guide navbar dropdown.")
    add_to_insurance_guide.short_description = 'Add to Insurance Guide dropdown'

    def remove_from_insurance_guide(self, request, queryset):
        for obj in queryset:
            obj.show_in_navbar = False
            obj.nav_group = ''
            obj.save()
        self.message_user(request, "Selected pages removed from Insurance Guide dropdown.")
    remove_from_insurance_guide.short_description = 'Remove from Insurance Guide dropdown'

    def reorder_insurance_guide(self, request, queryset):
        pages = StaticPage.objects.filter(
            nav_group='Insurance Guide', show_in_navbar=True
        ).order_by('nav_order', 'title')
        for idx, obj in enumerate(pages, start=1):
            if obj.nav_order != idx:
                obj.nav_order = idx
                obj.save()
        self.message_user(request, "Insurance Guide dropdown reordered sequentially.")
    reorder_insurance_guide.short_description = 'Reorder Insurance Guide sequentially'


@admin.register(NavbarMenuPage)
class NavbarMenuPageAdmin(admin.ModelAdmin):
    list_display = (
        'title', 'page_type', 'menu_label', 'nav_group', 'nav_order', 'is_active', 'show_in_navbar'
    )
    list_filter = ('nav_group', 'is_active')
    search_fields = ('title', 'page_type', 'meta_title', 'meta_description', 'meta_keywords')

    actions = ['add_to_navbar', 'remove_from_navbar', 'reorder_navbar']

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        return qs.filter(show_in_navbar=True)

    def add_to_navbar(self, request, queryset):
        current_max = StaticPage.objects.filter(show_in_navbar=True).aggregate(Max('nav_order')).get('nav_order__max') or 0
        next_order = current_max + 1
        for obj in queryset:
            obj.show_in_navbar = True
            if not obj.nav_order or obj.nav_order <= 0:
                obj.nav_order = next_order
                next_order += 1
            obj.save()
        self.message_user(request, "Selected pages added to navbar and ordered.")
    add_to_navbar.short_description = 'Add to navbar'

    def remove_from_navbar(self, request, queryset):
        for obj in queryset:
            obj.show_in_navbar = False
            obj.save()
        self.message_user(request, "Selected pages removed from navbar.")
    remove_from_navbar.short_description = 'Remove from navbar'

    def reorder_navbar(self, request, queryset):
        pages = StaticPage.objects.filter(show_in_navbar=True).order_by('nav_order', 'title')
        for idx, obj in enumerate(pages, start=1):
            if obj.nav_order != idx:
                obj.nav_order = idx
                obj.save()
        self.message_user(request, "Navbar items reordered sequentially.")
    reorder_navbar.short_description = 'Reorder navbar sequentially'


# Admin for core site pages where only SEO fields are editable (no content)
@admin.register(CoreSitePage)
class CoreSitePageAdmin(admin.ModelAdmin):
    # Known core routes on the site
    CORE_PAGE_TYPES = {
        'home', 'about', 'contact', 'privacy', 'terms', 'california_privacy', 'disclosure', 'team', 'how_to_use',
        'insurance-guide',
        'car-insurance-quotes', 'car-insurance-comparison', 'car-insurance-calculator', 'monthly-car-insurance',
        'car-insurance-companies', 'insurance-company-reviews',
        'auto-insurance-types', 'states', 'faqs', 'blog',
        'high_risk_auto_insurance',
    }

    list_display = ['page_type', 'title', 'meta_title', 'show_in_navbar', 'updated_at']
    list_filter = ['created_at', 'show_in_navbar']
    search_fields = ['page_type', 'title', 'meta_title', 'meta_description']
    readonly_fields = ['created_at', 'updated_at']

    # Only allow editing of these fields (no content field shown)
    fields = ('title', 'meta_title', 'meta_description')

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        # Include either known core routes OR anything marked for navbar
        return qs.filter(Q(page_type__in=self.CORE_PAGE_TYPES) | Q(show_in_navbar=True))


@admin.register(StaticPage)
class StaticPageAdmin(admin.ModelAdmin):
    list_display = [
        'page_type', 'title', 'menu_label', 'nav_group',
        'is_active', 'show_in_navbar', 'nav_order',
        'show_in_footer', 'footer_order', 'updated_at'
    ]
    list_filter = ['page_type', 'is_active', 'show_in_navbar', 'show_in_footer', 'created_at']
    list_editable = ['is_active', 'show_in_navbar', 'nav_order', 'show_in_footer', 'footer_order']
    search_fields = ['title', 'content', 'meta_title', 'meta_description', 'meta_keywords']
    readonly_fields = ['created_at', 'updated_at']

    fieldsets = (
        ('Page Information', {
            'fields': ('page_type', 'title', 'menu_label', 'nav_group')
        }),
        ('SEO', {
            'fields': ('meta_title', 'meta_description', 'meta_keywords')
        }),
        ('Content', {
            'fields': ('content',)
        }),
        ('Visibility & Order', {
            'fields': ('is_active', 'show_in_navbar', 'nav_order', 'show_in_footer', 'footer_order')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(CompanyInfo)
class CompanyInfoAdmin(admin.ModelAdmin):
    list_display = ['company_name', 'email', 'phone', 'is_active', 'updated_at']
    list_filter = ['is_active', 'created_at', 'updated_at']
    search_fields = ['company_name', 'email', 'phone', 'tagline']
    list_editable = ['is_active']
    readonly_fields = ['created_at', 'updated_at']
    date_hierarchy = 'created_at'

    actions = ['make_active', 'make_inactive', 'duplicate_company_info']

    def make_active(self, request, queryset):
        for obj in queryset:
            obj.is_active = True
            obj.save()
        self.message_user(request, 'Selected company info marked as active. Others made inactive automatically.')
    make_active.short_description = 'Mark selected as active'

    def make_inactive(self, request, queryset):
        updated = queryset.update(is_active=False)
        self.message_user(request, f'{updated} company info record(s) marked as inactive.')
    make_inactive.short_description = 'Mark selected as inactive'

    def duplicate_company_info(self, request, queryset):
        for obj in queryset:
            obj.pk = None
            obj.is_active = False
            obj.company_name = f"{obj.company_name} (Copy)"
            obj.save()
        self.message_user(request, 'Selected company info record(s) duplicated as inactive copies.')
    duplicate_company_info.short_description = 'Duplicate selected records as inactive'


@admin.register(ContactSubmission)
class ContactSubmissionAdmin(admin.ModelAdmin):
    list_display = ['name', 'email', 'inquiry_type', 'is_read', 'created_at']
    list_filter = ['inquiry_type', 'is_read', 'created_at']
    search_fields = ['name', 'email', 'subject', 'message']
    list_editable = ['is_read']
    readonly_fields = ['created_at']