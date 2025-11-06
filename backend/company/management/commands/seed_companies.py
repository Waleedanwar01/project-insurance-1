from django.core.management.base import BaseCommand
from django.db import transaction
from django.utils.text import slugify

from company.models import InsuranceCompany, CompanyReview


class Command(BaseCommand):
    help = "Seed minimal insurance companies and a sample review"

    @transaction.atomic
    def handle(self, *args, **options):
        companies = [
            {
                "name": "Panda Insurance",
                "description": "Affordable auto insurance with solid customer support.",
                "website": "https://example.com/panda",
                "is_high_risk_recommended": True,
                "high_risk_blurb": "Good option for high-risk drivers seeking lower rates.",
            },
            {
                "name": "Zen Auto",
                "description": "Simple policies with transparent pricing.",
                "website": "https://example.com/zen",
                "is_high_risk_recommended": False,
            },
        ]

        created_companies = []
        for data in companies:
            slug = slugify(data["name"]) 
            company, created = InsuranceCompany.objects.get_or_create(
                slug=slug,
                defaults={
                    "name": data["name"],
                    "description": data["description"],
                    "website": data["website"],
                    "is_high_risk_recommended": data.get("is_high_risk_recommended", False),
                    "high_risk_blurb": data.get("high_risk_blurb", ""),
                    "is_active": True,
                    "order": 1,
                },
            )
            created_companies.append(company)
            if created:
                self.stdout.write(self.style.SUCCESS(f"Created company: {company.name}"))
            else:
                self.stdout.write(self.style.WARNING(f"Company already exists: {company.name}"))

        # Seed a review for the first company
        if created_companies:
            c = created_companies[0]
            review_slug = slugify("Panda Insurance 2025 Review")
            review, created = CompanyReview.objects.get_or_create(
                slug=review_slug,
                defaults={
                    "company": c,
                    "title": "Panda Insurance 2025 Review",
                    "summary": "Quick overview of Panda Insurance rates and service.",
                    "content": "Panda Insurance offers competitive rates for high-risk drivers with responsive support.",
                    "rating": 4,
                    "author_name": "Team",
                    "is_published": True,
                },
            )
            if created:
                self.stdout.write(self.style.SUCCESS(f"Created review: {review.title}"))
            else:
                self.stdout.write(self.style.WARNING("Review already exists"))

        self.stdout.write(self.style.SUCCESS("Company seed completed."))