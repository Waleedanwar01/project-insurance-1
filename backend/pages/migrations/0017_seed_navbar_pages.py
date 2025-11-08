from django.db import migrations


def seed_navbar_pages(apps, schema_editor):
    StaticPage = apps.get_model('pages', 'StaticPage')

    # Define navbar pages to seed
    pages_to_seed = [
        # Top-level: Insurance Guide
        {
            'page_type': 'insurance-guide',
            'title': 'Insurance Guide',
            'menu_label': 'Insurance Guide',
            'nav_group': 'Main',
            'nav_order': 1,
        },
        # Dropdown under Insurance Guide
        {
            'page_type': 'car-insurance-quotes',
            'title': 'Car Insurance Quotes',
            'menu_label': 'Quotes',
            'nav_group': 'Insurance Guide',
            'nav_order': 2,
        },
        {
            'page_type': 'car-insurance-comparison',
            'title': 'Compare Car Insurance',
            'menu_label': 'Comparison',
            'nav_group': 'Insurance Guide',
            'nav_order': 3,
        },
        {
            'page_type': 'car-insurance-calculator',
            'title': 'Car Insurance Calculator',
            'menu_label': 'Calculator',
            'nav_group': 'Insurance Guide',
            'nav_order': 4,
        },
        {
            'page_type': 'car-insurance-companies',
            'title': 'Car Insurance Companies',
            'menu_label': 'Companies',
            'nav_group': 'Insurance Guide',
            'nav_order': 5,
        },
        {
            'page_type': 'insurance-company-reviews',
            'title': 'Insurance Company Reviews',
            'menu_label': 'Reviews',
            'nav_group': 'Insurance Guide',
            'nav_order': 6,
        },
        {
            'page_type': 'auto-insurance-types',
            'title': 'Auto Insurance Types',
            'menu_label': 'Insurance Types',
            'nav_group': 'Insurance Guide',
            'nav_order': 7,
        },
        {
            'page_type': 'states',
            'title': 'Car Insurance by State',
            'menu_label': 'By State',
            'nav_group': 'Insurance Guide',
            'nav_order': 8,
        },
        # Other top-level links
        {
            'page_type': 'faqs',
            'title': 'FAQs',
            'menu_label': 'FAQs',
            'nav_group': 'Main',
            'nav_order': 20,
        },
        {
            'page_type': 'blog',
            'title': 'Blog',
            'menu_label': 'Blog',
            'nav_group': 'Main',
            'nav_order': 21,
        },
        {
            'page_type': 'contact',
            'title': 'Contact',
            'menu_label': 'Contact',
            'nav_group': 'Main',
            'nav_order': 22,
        },
        {
            'page_type': 'about',
            'title': 'About',
            'menu_label': 'About',
            'nav_group': 'Main',
            'nav_order': 23,
        },
    ]

    for data in pages_to_seed:
        page, created = StaticPage.objects.get_or_create(
            page_type=data['page_type'],
            defaults={
                'title': data['title'],
                'menu_label': data['menu_label'],
                'nav_group': data['nav_group'],
                'show_in_navbar': True,
                'nav_order': data['nav_order'],
                'is_active': True,
                'meta_title': data['title'],
                'meta_description': f"{data['title']} information and resources.",
            },
        )
        if not created:
            # Ensure existing entries are updated to be visible in navbar
            changed = False
            if page.menu_label != data['menu_label']:
                page.menu_label = data['menu_label']
                changed = True
            if page.nav_group != data['nav_group']:
                page.nav_group = data['nav_group']
                changed = True
            if page.nav_order != data['nav_order']:
                page.nav_order = data['nav_order']
                changed = True
            if not page.show_in_navbar:
                page.show_in_navbar = True
                changed = True
            if not page.is_active:
                page.is_active = True
                changed = True
            if not page.meta_title:
                page.meta_title = data['title']
                changed = True
            if not page.meta_description:
                page.meta_description = f"{data['title']} information and resources."
                changed = True
            if changed:
                page.save()


def noop_reverse(apps, schema_editor):
    # Intentionally no reverse operation to avoid accidental deletion
    pass


class Migration(migrations.Migration):
    dependencies = [
        ('pages', '0016_carinsurancequotespage_meta_description_and_more'),
    ]

    operations = [
        migrations.RunPython(seed_navbar_pages, noop_reverse),
    ]