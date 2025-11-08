from django.db import migrations


def remove_main_group(apps, schema_editor):
    StaticPage = apps.get_model('pages', 'StaticPage')
    StaticPage.objects.filter(nav_group='Main', show_in_navbar=True).update(nav_group='')


def noop_reverse(apps, schema_editor):
    # No reverse to avoid reintroducing 'Main' group
    pass


class Migration(migrations.Migration):
    dependencies = [
        ('pages', '0017_seed_navbar_pages'),
    ]

    operations = [
        migrations.RunPython(remove_main_group, noop_reverse),
    ]