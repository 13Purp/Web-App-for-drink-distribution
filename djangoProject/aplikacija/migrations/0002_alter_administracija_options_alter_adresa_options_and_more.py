# Generated by Django 5.0.6 on 2024-05-26 09:24

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('aplikacija', '0001_initial'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='administracija',
            options={'managed': True},
        ),
        migrations.AlterModelOptions(
            name='adresa',
            options={'managed': True},
        ),
        migrations.AlterModelOptions(
            name='artikal',
            options={'managed': True},
        ),
        migrations.AlterModelOptions(
            name='fizickolice',
            options={'managed': True},
        ),
        migrations.AlterModelOptions(
            name='idesa',
            options={'managed': True},
        ),
        migrations.AlterModelOptions(
            name='komentar',
            options={'managed': True},
        ),
        migrations.AlterModelOptions(
            name='korisnik',
            options={'managed': True},
        ),
        migrations.AlterModelOptions(
            name='kupon',
            options={'managed': True},
        ),
        migrations.AlterModelOptions(
            name='narudzbina',
            options={'managed': True},
        ),
        migrations.AlterModelOptions(
            name='narudzbinaartikal',
            options={'managed': True},
        ),
        migrations.AlterModelOptions(
            name='popustartikal',
            options={'managed': True},
        ),
        migrations.AlterModelOptions(
            name='popustgrupa',
            options={'managed': True},
        ),
        migrations.AlterModelOptions(
            name='popustpib',
            options={'managed': True},
        ),
        migrations.AlterModelOptions(
            name='pravnolice',
            options={'managed': True},
        ),
        migrations.AlterModelOptions(
            name='recenzija',
            options={'managed': True},
        ),
    ]
