from django.core.management.base import BaseCommand
from django.db import transaction
from django.utils.text import slugify

from faq.models import FAQCategory, FAQ


class Command(BaseCommand):
    help = "Seed minimal FAQ categories and sample FAQs"

    @transaction.atomic
    def handle(self, *args, **options):
        cat, _ = FAQCategory.objects.get_or_create(
            name="Car Insurance Basics",
            defaults={
                "description": "Common questions about car insurance",
                "order": 1,
                "slug": slugify("Car Insurance Basics"),
                "is_active": True,
            },
        )

        faq_items = [
            {
                "question": "What is a deductible in car insurance?",
                "short_answer": "It's the amount you pay out of pocket before coverage kicks in.",
                "answer": "<p>A deductible is the amount you're responsible for paying before your insurer covers a claim. Higher deductibles can lower your premium.</p>",
                "priority": "medium",
                "tags": "deductible, premium",
            },
            {
                "question": "Does my credit score affect car insurance rates?",
                "short_answer": "In many states, yes, it can influence rates.",
                "answer": "<p>Insurers may consider credit-based insurance scores when setting premiums, depending on your state regulations.</p>",
                "priority": "high",
                "tags": "credit score, rates",
            },
        ]

        for item in faq_items:
            slug = slugify(item["question"])
            faq, created = FAQ.objects.get_or_create(
                slug=slug,
                defaults={
                    "question": item["question"],
                    "short_answer": item["short_answer"],
                    "answer": item["answer"],
                    "category": cat,
                    "priority": item["priority"],
                    "tags": item["tags"],
                    "is_published": True,
                },
            )

            if created:
                self.stdout.write(self.style.SUCCESS(f"Created FAQ: {faq.question}"))
            else:
                self.stdout.write(self.style.WARNING(f"FAQ already exists: {faq.question}"))

        self.stdout.write(self.style.SUCCESS("FAQ seed completed."))