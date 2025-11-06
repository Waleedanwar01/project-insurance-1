from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('pages', '0008_companyinfo_footer_logo_alt_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='staticpage',
            name='show_in_navbar',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='staticpage',
            name='nav_order',
            field=models.PositiveIntegerField(default=0),
        ),
        migrations.AddField(
            model_name='staticpage',
            name='show_in_footer',
            field=models.BooleanField(default=True),
        ),
        migrations.AddField(
            model_name='staticpage',
            name='footer_order',
            field=models.PositiveIntegerField(default=0),
        ),
    ]