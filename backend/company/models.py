from django.db import models
from django.utils import timezone
from django.utils.text import slugify
from django.core.validators import MinValueValidator, MaxValueValidator


class InsuranceCompany(models.Model):
    name = models.CharField(max_length=150)
    slug = models.SlugField(max_length=160, unique=True)
    description = models.TextField(blank=True)
    website = models.URLField(blank=True)
    phone = models.CharField(max_length=30, blank=True)
    address = models.TextField(blank=True)
    logo = models.ImageField(upload_to="company/logos/", blank=True, null=True)
    # Recommendation flags and content for specific pages
    is_high_risk_recommended = models.BooleanField(default=False)
    high_risk_blurb = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
    order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Insurance Company"
        verbose_name_plural = "Insurance Companies"
        ordering = ["order", "name"]

    def __str__(self):
        return self.name

# Proxy model to expose a separate admin section for high-risk companies
class HighRiskInsuranceCompany(InsuranceCompany):
    class Meta:
        proxy = True
        verbose_name = "High-Risk Insurance Company"
        verbose_name_plural = "High-Risk Insurance Companies"


class CompanyReview(models.Model):
    company = models.ForeignKey(InsuranceCompany, related_name="reviews", on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True)
    summary = models.TextField(blank=True)
    content = models.TextField()
    rating = models.IntegerField(null=True, blank=True, validators=[MinValueValidator(1), MaxValueValidator(5)])
    author_name = models.CharField(max_length=255, blank=True)
    # SEO metadata
    meta_title = models.CharField(max_length=255, blank=True)
    meta_description = models.TextField(blank=True)
    meta_keywords = models.CharField(max_length=255, blank=True)
    is_published = models.BooleanField(default=True)
    published_at = models.DateTimeField(default=timezone.now)

    class Meta:
        ordering = ["-published_at"]
        verbose_name = "Company Review"
        verbose_name_plural = "Company Reviews"

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.company.name} - {self.title}"
