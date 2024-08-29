# Generated by Django 5.0.6 on 2024-05-20 22:15

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Administracija',
            fields=[
                ('mail', models.CharField(max_length=255, primary_key=True, serialize=False)),
                ('lozinka', models.CharField(max_length=20)),
                ('admin', models.TextField(blank=True, null=True)),
            ],
            options={
                'db_table': 'ADMINISTRACIJA',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='Adresa',
            fields=[
                ('rbr', models.AutoField(db_column='RBr', primary_key=True, serialize=False)),
                ('adresa', models.TextField(db_column='Adresa')),
            ],
            options={
                'db_table': 'ADRESA',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='Artikal',
            fields=[
                ('mera', models.CharField(blank=True, max_length=20, null=True)),
                ('stanje', models.IntegerField(blank=True, null=True)),
                ('kolicinapakovanje', models.IntegerField(blank=True, db_column='kolicinaPakovanje', null=True)),
                ('tip', models.CharField(blank=True, max_length=20, null=True)),
                ('cena', models.FloatField(blank=True, null=True)),
                ('pdv', models.IntegerField(blank=True, db_column='PDV', null=True)),
                ('sifraartikla', models.AutoField(db_column='sifraArtikla', primary_key=True, serialize=False)),
            ],
            options={
                'db_table': 'ARTIKAL',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='AuthGroup',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=150, unique=True)),
            ],
            options={
                'db_table': 'auth_group',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='AuthGroupPermissions',
            fields=[
                ('id', models.BigAutoField(primary_key=True, serialize=False)),
            ],
            options={
                'db_table': 'auth_group_permissions',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='AuthPermission',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
                ('codename', models.CharField(max_length=100)),
            ],
            options={
                'db_table': 'auth_permission',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='AuthUser',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('password', models.CharField(max_length=128)),
                ('last_login', models.DateTimeField(blank=True, null=True)),
                ('is_superuser', models.IntegerField()),
                ('username', models.CharField(max_length=150, unique=True)),
                ('first_name', models.CharField(max_length=150)),
                ('last_name', models.CharField(max_length=150)),
                ('email', models.CharField(max_length=254)),
                ('is_staff', models.IntegerField()),
                ('is_active', models.IntegerField()),
                ('date_joined', models.DateTimeField()),
            ],
            options={
                'db_table': 'auth_user',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='AuthUserGroups',
            fields=[
                ('id', models.BigAutoField(primary_key=True, serialize=False)),
            ],
            options={
                'db_table': 'auth_user_groups',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='AuthUserUserPermissions',
            fields=[
                ('id', models.BigAutoField(primary_key=True, serialize=False)),
            ],
            options={
                'db_table': 'auth_user_user_permissions',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='DjangoAdminLog',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('action_time', models.DateTimeField()),
                ('object_id', models.TextField(blank=True, null=True)),
                ('object_repr', models.CharField(max_length=200)),
                ('action_flag', models.PositiveSmallIntegerField()),
                ('change_message', models.TextField()),
            ],
            options={
                'db_table': 'django_admin_log',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='DjangoContentType',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('app_label', models.CharField(max_length=100)),
                ('model', models.CharField(max_length=100)),
            ],
            options={
                'db_table': 'django_content_type',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='DjangoMigrations',
            fields=[
                ('id', models.BigAutoField(primary_key=True, serialize=False)),
                ('app', models.CharField(max_length=255)),
                ('name', models.CharField(max_length=255)),
                ('applied', models.DateTimeField()),
            ],
            options={
                'db_table': 'django_migrations',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='DjangoSession',
            fields=[
                ('session_key', models.CharField(max_length=40, primary_key=True, serialize=False)),
                ('session_data', models.TextField()),
                ('expire_date', models.DateTimeField()),
            ],
            options={
                'db_table': 'django_session',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='Korisnik',
            fields=[
                ('idk', models.AutoField(db_column='idK', primary_key=True, serialize=False)),
                ('ime', models.CharField(max_length=20)),
                ('prezime', models.CharField(max_length=20)),
                ('telefon', models.CharField(blank=True, max_length=30, null=True)),
                ('grad', models.CharField(max_length=20)),
                ('zip', models.IntegerField()),
            ],
            options={
                'db_table': 'KORISNIK',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='Komentar',
            fields=[
                ('rednibroj', models.AutoField(db_column='RedniBroj', primary_key=True, serialize=False)),
                ('komentar', models.TextField(blank=True, null=True)),
            ],
            options={
                'db_table': 'KOMENTAR',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='Kupon',
            fields=[
                ('idkupon', models.AutoField(db_column='idKupon', primary_key=True, serialize=False)),
                ('naziv', models.TextField(blank=True, null=True)),
                ('vrednost', models.FloatField(blank=True, null=True)),
            ],
            options={
                'db_table': 'KUPON',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='Narudzbina',
            fields=[
                ('idnar', models.AutoField(db_column='idNar', primary_key=True, serialize=False)),
                ('datum', models.DateTimeField(blank=True, null=True)),
                ('status', models.TextField(blank=True, null=True)),
                ('ukupnacena', models.FloatField(blank=True, db_column='ukupnaCena', null=True)),
                ('adresa', models.TextField(blank=True, null=True)),
                ('vreme', models.TimeField(blank=True, null=True)),
            ],
            options={
                'db_table': 'NARUDZBINA',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='PopustGrupa',
            fields=[
                ('popust', models.FloatField(blank=True, null=True)),
                ('tip', models.CharField(max_length=20, primary_key=True, serialize=False)),
            ],
            options={
                'db_table': 'POPUST_GRUPA',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='PopustPib',
            fields=[
                ('pib', models.IntegerField(db_column='PIB', primary_key=True, serialize=False)),
                ('popust', models.FloatField(blank=True, null=True)),
            ],
            options={
                'db_table': 'POPUST_PIB',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='IdeSa',
            fields=[
                ('artikal2', models.OneToOneField(db_column='artikal2', on_delete=django.db.models.deletion.DO_NOTHING, primary_key=True, serialize=False, to='aplikacija.artikal')),
            ],
            options={
                'db_table': 'IDE_SA',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='PopustArtikal',
            fields=[
                ('popust', models.FloatField(blank=True, null=True)),
                ('sifraartikla', models.OneToOneField(db_column='sifraArtikla', on_delete=django.db.models.deletion.DO_NOTHING, primary_key=True, serialize=False, to='aplikacija.artikal')),
            ],
            options={
                'db_table': 'POPUST_ARTIKAL',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='Recenzija',
            fields=[
                ('opis', models.TextField(blank=True, null=True)),
                ('ocena', models.FloatField(blank=True, null=True)),
                ('proizvodjac', models.CharField(blank=True, max_length=20, null=True)),
                ('gazirano', models.TextField(blank=True, null=True)),
                ('procenatalkohola', models.FloatField(blank=True, db_column='procenatAlkohola', null=True)),
                ('zemljaporekla', models.TextField(blank=True, db_column='zemljaPorekla', null=True)),
                ('povratnaambalaza', models.TextField(blank=True, db_column='povratnaAmbalaza', null=True)),
                ('slika', models.TextField(blank=True, null=True)),
                ('sifraartikla', models.OneToOneField(db_column='sifraArtikla', on_delete=django.db.models.deletion.DO_NOTHING, primary_key=True, serialize=False, to='aplikacija.artikal')),
            ],
            options={
                'db_table': 'RECENZIJA',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='FizickoLice',
            fields=[
                ('lozinka', models.CharField(max_length=20)),
                ('mail', models.CharField(max_length=255, unique=True)),
                ('idk', models.OneToOneField(db_column='idK', on_delete=django.db.models.deletion.DO_NOTHING, primary_key=True, serialize=False, to='aplikacija.korisnik')),
            ],
            options={
                'db_table': 'FIZICKO_LICE',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='PravnoLice',
            fields=[
                ('lozinka', models.CharField(max_length=20)),
                ('pib', models.IntegerField(db_column='PIB', unique=True)),
                ('idk', models.OneToOneField(db_column='idK', on_delete=django.db.models.deletion.DO_NOTHING, primary_key=True, serialize=False, to='aplikacija.korisnik')),
            ],
            options={
                'db_table': 'PRAVNO_LICE',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='NarudzbinaArtikal',
            fields=[
                ('idnar', models.OneToOneField(db_column='idNar', on_delete=django.db.models.deletion.DO_NOTHING, primary_key=True, serialize=False, to='aplikacija.narudzbina')),
                ('cena', models.FloatField(blank=True, null=True)),
                ('kolicina', models.IntegerField(blank=True, null=True)),
            ],
            options={
                'db_table': 'NARUDZBINA_ARTIKAL',
                'managed': False,
            },
        ),
    ]
