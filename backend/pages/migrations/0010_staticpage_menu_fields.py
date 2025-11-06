from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('pages', '0009_staticpage_navigation_flags'),
    ]

    operations = [
        migrations.AddField(
            model_name='staticpage',
            name='menu_label',
            field=models.CharField(max_length=100, blank=True),
        ),
        migrations.AddField(
            model_name='staticpage',
            name='nav_group',
            field=models.CharField(max_length=50, blank=True, default='Company'),
        ),
    ]