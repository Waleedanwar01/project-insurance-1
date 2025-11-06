from django.core.management.base import BaseCommand
from django.db import transaction
from django.utils.text import slugify

from blog.models import Category, BlogPost


class Command(BaseCommand):
    help = "Seed minimal blog categories and a sample post"

    @transaction.atomic
    def handle(self, *args, **options):
        main_cat, _ = Category.objects.get_or_create(
            name="Auto Insurance",
            defaults={"type": "main", "slug": slugify("Auto Insurance")},
        )

        sub_cat, _ = Category.objects.get_or_create(
            name="Guides",
            defaults={"type": "sub", "parent": main_cat, "slug": slugify("Guides")},
        )

        post_slug = slugify("How to Compare Car Insurance Quotes")
        post, created = BlogPost.objects.get_or_create(
            slug=post_slug,
            defaults={
                "title": "How to Compare Car Insurance Quotes",
                "category": sub_cat,
                "summary": "Simple steps to compare car insurance quotes effectively.",
                "content": "<p>This is a starter blog post explaining how to compare car insurance quotes and save money.</p>",
                "is_published": True,
            },
        )

        if created:
            self.stdout.write(self.style.SUCCESS(f"Created blog post: {post.title}"))
        else:
            self.stdout.write(self.style.WARNING("Blog post already exists"))

        self.stdout.write(self.style.SUCCESS("Blog seed completed."))