from django.db import migrations
from django.utils.text import slugify

COURSES = [
    "SAP ABAP on HANA",
    "SAP ABAP on HANA (CDS & OData Training)",
    "SAP Fiori & UI5",
    "SAP SD (Sales & Distribution)",
    "SAP MM (Materials Management)",
    "SAP FICO (Financial Accounting & Controlling)",
    "SAP PP (Production Planning)",
    "SAP BTP For Working Professionals",
    "SAP BTP For Freshers",
    "SAP CPI Training",
    "SAP QM (Quality Management)",
    "SAP BASIS S/4HANA Training",
    "Python Programming",
    "AI Programming",
    "AIML Programming",
]


def seed_courses(apps, schema_editor):
    DemoCourse = apps.get_model('Demo', 'DemoCourse')
    for index, name in enumerate(COURSES):
        DemoCourse.objects.update_or_create(
            name=name,
            defaults={'slug': slugify(name), 'order': index, 'is_active': True},
        )


def remove_courses(apps, schema_editor):
    DemoCourse = apps.get_model('Demo', 'DemoCourse')
    DemoCourse.objects.filter(name__in=COURSES).delete()


class Migration(migrations.Migration):

    dependencies = [
        ('Demo', '0005_democourse_demorequest'),
    ]

    operations = [
        migrations.RunPython(seed_courses, remove_courses),
    ]
