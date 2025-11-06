from django.contrib import admin
from django import forms
from django.utils.text import slugify
from .models import StaticPage, TeamMember, ContactSubmission, CompanyInfo, CarInsuranceQuotesPage, FooterMenuPage
from django.db.models import Max


@admin.register(StaticPage)
class StaticPageAdmin(admin.ModelAdmin):
    list_display = ['page_type', 'title', 'menu_label', 'nav_group', 'is_active', 'show_in_navbar', 'nav_order', 'show_in_footer', 'footer_order', 'updated_at']
    list_filter = ['page_type', 'is_active', 'show_in_navbar', 'show_in_footer', 'created_at']
    list_editable = ['is_active', 'show_in_navbar', 'nav_order', 'show_in_footer', 'footer_order']
    search_fields = ['title', 'content']
    readonly_fields = ['created_at', 'updated_at']
    
    fieldsets = (
        ('Page Information', {
            'fields': ('page_type', 'title', 'menu_label', 'nav_group', 'meta_description')
        }),
        ('Content', {
            'fields': ('content',)
        }),
        ('Settings', {
            'fields': ('is_active', 'show_in_navbar', 'nav_order', 'show_in_footer', 'footer_order')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

    def get_readonly_fields(self, request, obj=None):
        ro = list(super().get_readonly_fields(request, obj))
        # Prevent editing content for Contact Us page; content managed by contact form
        if obj and obj.page_type == 'contact':
            ro.append('content')
        return ro

    def save_model(self, request, obj, form, change):
        # Normalize page_type to a URL-friendly slug when admin types it
        if obj.page_type:
            obj.page_type = slugify(obj.page_type)
        super().save_model(request, obj, form, change)


@admin.register(FooterMenuPage)
class FooterMenuPageAdmin(admin.ModelAdmin):
    list_display = ['title', 'page_type', 'is_active', 'show_in_footer', 'footer_order', 'updated_at']
    list_filter = ['page_type', 'is_active', 'show_in_footer']
    list_editable = ['show_in_footer', 'footer_order']
    search_fields = ['title', 'content']
    ordering = ['footer_order', 'title']
    actions = ['add_to_company_footer', 'remove_from_company_footer', 'reorder_footer_sequentially']

    def add_to_company_footer(self, request, queryset):
        max_order = StaticPage.objects.aggregate(Max('footer_order'))['footer_order__max'] or 0
        to_update = []
        for page in queryset:
            if not page.show_in_footer:
                max_order += 1
                page.show_in_footer = True
                if page.footer_order == 0:
                    page.footer_order = max_order
                to_update.append(page)
            else:
                if page.footer_order == 0:
                    max_order += 1
                    page.footer_order = max_order
                    to_update.append(page)
        if to_update:
            StaticPage.objects.bulk_update(to_update, ['show_in_footer', 'footer_order'])
    add_to_company_footer.short_description = "Add selected to Company Footer"

    def remove_from_company_footer(self, request, queryset):
        queryset.update(show_in_footer=False)
    remove_from_company_footer.short_description = "Remove selected from Company Footer"

    def reorder_footer_sequentially(self, request, queryset):
        ordered = list(queryset.order_by('title'))
        start = 1
        for idx, page in enumerate(ordered, start=start):
            page.footer_order = idx
        if ordered:
            StaticPage.objects.bulk_update(ordered, ['footer_order'])
    reorder_footer_sequentially.short_description = "Reorder selected footer items sequentially"


@admin.register(CarInsuranceQuotesPage)
class CarInsuranceQuotesPageAdmin(admin.ModelAdmin):
    class CarInsuranceQuotesPageForm(forms.ModelForm):
        # Human-friendly inputs
        intro_paragraphs_text = forms.CharField(
            required=False,
            widget=forms.Textarea(attrs={'rows': 6}),
            help_text='Enter one paragraph per line.'
        )
        takeaways_text = forms.CharField(
            required=False,
            widget=forms.Textarea(attrs={'rows': 6}),
            help_text='Enter one takeaway per line.'
        )
        state_insurance_csv = forms.CharField(
            required=False,
            widget=forms.Textarea(attrs={'rows': 8}),
            help_text='Enter one state per line as: state, reqs, minRate, fullRate'
        )
        faqs_csv = forms.CharField(
            required=False,
            widget=forms.Textarea(attrs={'rows': 8}),
            help_text='Enter one FAQ per line as: question | answer'
        )

        class Meta:
            model = CarInsuranceQuotesPage
            fields = [
                'title', 'last_updated',
                'author_name', 'author_bio', 'author_image_url',
                # JSON fields are managed via the human-friendly inputs
            ]

        def __init__(self, *args, **kwargs):
            super().__init__(*args, **kwargs)
            instance = kwargs.get('instance')
            if instance:
                # Prefill text fields from JSON
                if instance.intro_paragraphs:
                    self.initial['intro_paragraphs_text'] = '\n'.join(instance.intro_paragraphs)
                if instance.takeaways:
                    self.initial['takeaways_text'] = '\n'.join(instance.takeaways)
                if instance.state_insurance_data:
                    lines = []
                    for item in instance.state_insurance_data:
                        state = item.get('state', '')
                        reqs = item.get('reqs', '')
                        minRate = item.get('minRate', '')
                        fullRate = item.get('fullRate', '')
                        lines.append(f"{state}, {reqs}, {minRate}, {fullRate}")
                    self.initial['state_insurance_csv'] = '\n'.join(lines)
                if instance.faqs:
                    faq_lines = []
                    for f in instance.faqs:
                        q = f.get('question', '')
                        a = f.get('answer', '')
                        faq_lines.append(f"{q} | {a}")
                    self.initial['faqs_csv'] = '\n'.join(faq_lines)

        def clean(self):
            cleaned = super().clean()
            # Parse intro paragraphs
            intro_text = self.cleaned_data.get('intro_paragraphs_text', '') or ''
            intro_list = [line.strip() for line in intro_text.splitlines() if line.strip()]
            self.instance.intro_paragraphs = intro_list

            # Parse takeaways
            takeaways_text = self.cleaned_data.get('takeaways_text', '') or ''
            takeaways_list = [line.strip() for line in takeaways_text.splitlines() if line.strip()]
            self.instance.takeaways = takeaways_list

            # Parse state insurance CSV
            csv_text = self.cleaned_data.get('state_insurance_csv', '') or ''
            state_rows = []
            for raw_line in csv_text.splitlines():
                line = raw_line.strip()
                if not line:
                    continue
                parts = [p.strip() for p in line.split(',')]
                if len(parts) < 4:
                    # Skip invalid lines silently
                    continue
                state, reqs, minRate, fullRate = parts[:4]
                try:
                    minRate_num = int(float(minRate))
                    fullRate_num = int(float(fullRate))
                except ValueError:
                    # Skip lines with invalid numbers
                    continue
                state_rows.append({
                    'state': state,
                    'reqs': reqs,
                    'minRate': minRate_num,
                    'fullRate': fullRate_num,
                })
            self.instance.state_insurance_data = state_rows

            # Parse FAQs
            faqs_text = self.cleaned_data.get('faqs_csv', '') or ''
            faqs_rows = []
            for raw_line in faqs_text.splitlines():
                line = raw_line.strip()
                if not line:
                    continue
                parts = [p.strip() for p in line.split('|')]
                if len(parts) < 2:
                    continue
                question, answer = parts[0], parts[1]
                faq_id = slugify(question)[:50] or 'faq'
                faqs_rows.append({
                    'id': faq_id,
                    'question': question,
                    'answer': answer,
                })
            self.instance.faqs = faqs_rows
            return cleaned

    form = CarInsuranceQuotesPageForm
    list_display = ['title', 'last_updated', 'updated_at']
    search_fields = ['title', 'author_name']
    readonly_fields = ['created_at', 'updated_at']
    exclude = ('intro_paragraphs', 'takeaways', 'state_insurance_data', 'faqs')
    fieldsets = (
        ('Page Info', {
            'fields': ('title', 'last_updated')
        }),
        ('Intro & Takeaways', {
            'fields': ('intro_paragraphs_text', 'takeaways_text'),
            'description': 'Add one item per line; we handle formatting.'
        }),
        ('State Insurance Data', {
            'fields': ('state_insurance_csv',),
            'description': 'Format: state, reqs, minRate, fullRate (one per line)'
        }),
        ('FAQs', {
            'fields': ('faqs_csv',),
            'description': 'Format: question | answer (one per line)'
        }),
        ('Author', {
            'fields': ('author_name', 'author_bio', 'author_image_url')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(TeamMember)
class TeamMemberAdmin(admin.ModelAdmin):
    list_display = ['name', 'position', 'order', 'is_active', 'created_at']
    list_filter = ['is_active', 'created_at']
    search_fields = ['name', 'position', 'bio']
    list_editable = ['order', 'is_active']
    readonly_fields = ['created_at']
    
    fieldsets = (
        ('Personal Information', {
            'fields': ('name', 'position', 'bio', 'image')
        }),
        ('Contact Information', {
            'fields': ('email', 'linkedin_url', 'twitter_url')
        }),
        ('Display Settings', {
            'fields': ('order', 'is_active')
        }),
        ('Timestamps', {
            'fields': ('created_at',),
            'classes': ('collapse',)
        }),
    )


@admin.register(ContactSubmission)
class ContactSubmissionAdmin(admin.ModelAdmin):
    list_display = ['name', 'email', 'inquiry_type', 'subject', 'is_read', 'created_at']
    list_filter = ['inquiry_type', 'is_read', 'created_at']
    search_fields = ['name', 'email', 'subject', 'message']
    list_editable = ['is_read']
    readonly_fields = ['created_at']
    date_hierarchy = 'created_at'
    
    fieldsets = (
        ('Contact Information', {
            'fields': ('name', 'email', 'phone')
        }),
        ('Inquiry Details', {
            'fields': ('inquiry_type', 'subject', 'message')
        }),
        ('Status', {
            'fields': ('is_read',)
        }),
        ('Timestamps', {
            'fields': ('created_at',),
            'classes': ('collapse',)
        }),
    )
    
    def has_add_permission(self, request):
        # Prevent adding contact submissions through admin
        return False


@admin.register(CompanyInfo)
class CompanyInfoAdmin(admin.ModelAdmin):
    list_display = ['company_name', 'email', 'phone', 'is_active', 'updated_at']
    list_filter = ['is_active', 'created_at', 'updated_at']
    search_fields = ['company_name', 'email', 'phone', 'tagline']
    list_editable = ['is_active']
    readonly_fields = ['created_at', 'updated_at']
    date_hierarchy = 'created_at'
    actions = ['make_active', 'make_inactive', 'duplicate_company_info']
    
    def has_add_permission(self, request):
        # Allow adding only if no CompanyInfo exists; updates/deletes remain available
        return not CompanyInfo.objects.exists()
    
    fieldsets = (
        ('Company Details', {
            'fields': ('company_name', 'tagline', 'description', 'is_active')
        }),
        ('Contact Information', {
            'fields': ('address', 'phone', 'email', 'website', 'business_hours')
        }),
        ('Branding', {
            'fields': ('navbar_logo', 'navbar_logo_alt', 'footer_logo', 'footer_logo_alt', 'favicon')
        }),
        ('Footer & Legal', {
            'fields': ('footer_disclaimer',)
        }),
        ('Social Media', {
            'fields': ('facebook_url', 'twitter_url', 'linkedin_url', 'instagram_url')
        }),
        ('SEO Settings', {
            'fields': ('meta_title', 'meta_description', 'meta_image', 'meta_image_alt')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def make_active(self, request, queryset):
        # First deactivate all other company info entries
        CompanyInfo.objects.all().update(is_active=False)
        # Then activate selected ones
        updated = queryset.update(is_active=True)
        self.message_user(request, f'{updated} company info(s) marked as active.')
    make_active.short_description = "Mark selected company info as active"
    
    def make_inactive(self, request, queryset):
        updated = queryset.update(is_active=False)
        self.message_user(request, f'{updated} company info(s) marked as inactive.')
    make_inactive.short_description = "Mark selected company info as inactive"
    
    def duplicate_company_info(self, request, queryset):
        for obj in queryset:
            obj.pk = None  # This will create a new object when saved
            obj.company_name = f"{obj.company_name} (Copy)"
            obj.is_active = False  # New copies should be inactive by default
            obj.save()
        self.message_user(request, f'{queryset.count()} company info(s) duplicated successfully.')
    duplicate_company_info.short_description = "Duplicate selected company info"