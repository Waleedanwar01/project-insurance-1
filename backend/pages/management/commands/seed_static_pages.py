from django.core.management.base import BaseCommand
from django.db import transaction

from pages.models import StaticPage


class Command(BaseCommand):
    help = "Seed minimal static pages for nav and footer"

    @transaction.atomic
    def handle(self, *args, **options):
        pages = [
            {
                "page_type": "about",
                "title": "About Us",
                "content": "<p>We help drivers compare car insurance quotes and save money.</p>",
                "menu_label": "About",
                "nav_group": "Company",
                "show_in_navbar": True,
                "nav_order": 1,
                "show_in_footer": True,
                "footer_order": 1,
            },
            {
                "page_type": "privacy",
                "title": "Privacy Policy",
                "content": "<p>Your privacy matters. This is a starter policy page.</p>",
                "menu_label": "Privacy",
                "nav_group": "Company",
                "show_in_navbar": False,
                "nav_order": 0,
                "show_in_footer": True,
                "footer_order": 2,
            },
            {
                "page_type": "terms",
                "title": "Terms & Conditions",
                "content": "<p>Basic terms and conditions for using the site.</p>",
                "menu_label": "Terms",
                "nav_group": "Company",
                "show_in_navbar": False,
                "nav_order": 0,
                "show_in_footer": True,
                "footer_order": 3,
            },
            {
                "page_type": "contact",
                "title": "Contact Us",
                "content": "<p>Contact our team for support or partnerships.</p>",
                "menu_label": "Contact",
                "nav_group": "Company",
                "show_in_navbar": True,
                "nav_order": 2,
                "show_in_footer": True,
                "footer_order": 4,
            },
        ]

        for data in pages:
            page, created = StaticPage.objects.get_or_create(
                page_type=data["page_type"],
                defaults={
                    "title": data["title"],
                    "content": data["content"],
                    "menu_label": data["menu_label"],
                    "nav_group": data["nav_group"],
                    "show_in_navbar": data["show_in_navbar"],
                    "nav_order": data["nav_order"],
                    "show_in_footer": data["show_in_footer"],
                    "footer_order": data["footer_order"],
                    "is_active": True,
                },
            )
            if created:
                self.stdout.write(self.style.SUCCESS(f"Created page: {page.page_type}"))
            else:
                self.stdout.write(self.style.WARNING(f"Page already exists: {page.page_type}"))

        self.stdout.write(self.style.SUCCESS("Static pages seed completed."))