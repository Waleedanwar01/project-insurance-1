from django.contrib import admin
from django import forms
from .models import InsuranceCompany, HighRiskInsuranceCompany, CompanyReview


@admin.register(InsuranceCompany)
class InsuranceCompanyAdmin(admin.ModelAdmin):
    list_display = ["name", "website", "phone", "is_high_risk_recommended", "is_active", "order"]
    list_filter = ["is_active", "is_high_risk_recommended"]
    search_fields = ["name", "description", "website", "phone"]
    prepopulated_fields = {"slug": ("name",)}
    list_editable = ["is_active", "order"]
    readonly_fields = ["created_at", "updated_at"]

    fieldsets = (
        ("Basic Info", {
            "fields": ("name", "slug", "description", "logo")
        }),
        ("Contact", {
            "fields": ("website", "phone", "address")
        }),
        ("High-Risk Page", {
            "fields": ("is_high_risk_recommended", "high_risk_blurb")
        }),
        ("Status", {
            "fields": ("is_active", "order")
        }),
        ("Timestamps", {
            "fields": ("created_at", "updated_at"),
            "classes": ("collapse",)
        }),
    )


@admin.register(HighRiskInsuranceCompany)
class HighRiskInsuranceCompanyAdmin(InsuranceCompanyAdmin):
    def get_queryset(self, request):
        qs = super().get_queryset(request)
        return qs.filter(is_high_risk_recommended=True)

    def save_model(self, request, obj, form, change):
        # Ensure any item created/edited here is marked as high-risk recommended
        obj.is_high_risk_recommended = True
        super().save_model(request, obj, form, change)

    # Optional: make high-risk flag read-only in this section
    readonly_fields = ["created_at", "updated_at", "is_high_risk_recommended"]


@admin.register(CompanyReview)
class CompanyReviewAdmin(admin.ModelAdmin):
    class CompanyReviewAdminForm(forms.ModelForm):
        rating = forms.TypedChoiceField(
            coerce=int,
            choices=[(i, i) for i in range(1, 6)],
            required=False,
            help_text="Select a rating between 1 and 5."
        )

        class Meta:
            model = CompanyReview
            fields = "__all__"

    form = CompanyReviewAdminForm
    list_display = ["title", "company", "is_published", "rating", "published_at"]
    list_filter = ["is_published", "company"]
    search_fields = ["title", "summary", "content", "company__name"]
    prepopulated_fields = {"slug": ("title",)}
    readonly_fields = ["published_at"]

    fieldsets = (
        ("Review", {
            "fields": ("company", "title", "slug", "summary", "content", "rating", "author_name")
        }),
        ("Status", {
            "fields": ("is_published", "published_at")
        }),
    )
