from django.db import migrations


def create_high_risk_page(apps, schema_editor):
    StaticPage = apps.get_model('pages', 'StaticPage')
    if not StaticPage.objects.filter(page_type='high_risk_auto_insurance').exists():
        StaticPage.objects.create(
            page_type='high_risk_auto_insurance',
            title='High-Risk Auto Insurance',
            meta_description='Affordable coverage options for high-risk drivers, including tips and insurer recommendations.',
            content=(
                '<h2>What Makes a Driver “High-Risk”?</h2>'
                '<p>Auto insurers may consider you high-risk due to accidents, tickets, DUIs, or limited driving history.</p>'
                '<ul><li>Multiple violations or claims</li><li>Very young or elderly drivers</li><li>Driving in high-risk areas</li></ul>'
                '<h2>How Much Does High-Risk Insurance Cost?</h2>'
                '<p>Costs vary by driver and location. Compare quotes regularly to find savings.</p>'
                '<p><em>Tip:</em> Take defensive driving, keep a clean record, and bundle policies.</p>'
            ),
        )


def delete_high_risk_page(apps, schema_editor):
    StaticPage = apps.get_model('pages', 'StaticPage')
    StaticPage.objects.filter(page_type='high_risk_auto_insurance').delete()


class Migration(migrations.Migration):
    dependencies = [
        ('pages', '0002_alter_staticpage_page_type'),
    ]

    operations = [
        migrations.RunPython(create_high_risk_page, delete_high_risk_page),
    ]