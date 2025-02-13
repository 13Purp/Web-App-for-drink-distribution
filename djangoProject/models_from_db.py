# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey and OneToOneField has `on_delete` set to the desired behavior
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models


class Administracija(models.Model):
    mail = models.CharField(primary_key=True, max_length=255)
    lozinka = models.CharField(max_length=20)
    admin = models.TextField(blank=True, null=True)  # This field type is a guess.

    class Meta:
        managed = False
        db_table = 'ADMINISTRACIJA'


class Adresa(models.Model):
    idk = models.OneToOneField('Korisnik', models.DO_NOTHING, db_column='idK', primary_key=True)  # Field name made lowercase. The composite primary key (idK, RBr) found, that is not supported. The first column is selected.
    rbr = models.AutoField(db_column='RBr')  # Field name made lowercase.
    adresa = models.TextField(db_column='Adresa')  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'ADRESA'
        unique_together = (('idk', 'rbr'),)


class Artikal(models.Model):
    naziv = models.CharField(max_length=20, blank=True, null=True)
    mera = models.CharField(max_length=20, blank=True, null=True)
    stanje = models.IntegerField(blank=True, null=True)
    kolicinapakovanje = models.CharField(db_column='kolicinaPakovanje', max_length=20, blank=True, null=True)  # Field name made lowercase.
    tip = models.CharField(max_length=20, blank=True, null=True)
    cena = models.FloatField(blank=True, null=True)
    pdv = models.IntegerField(db_column='PDV', blank=True, null=True)  # Field name made lowercase.
    sifraartikla = models.AutoField(db_column='sifraArtikla', primary_key=True)  # Field name made lowercase.
    gazirano = models.IntegerField(blank=True, null=True)
    sadrzialkohol = models.IntegerField(db_column='sadrziAlkohol', blank=True, null=True)  # Field name made lowercase.
    uvoz = models.IntegerField(blank=True, null=True)
    specijalan = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'ARTIKAL'


class FizickoLice(models.Model):
    lozinka = models.CharField(max_length=20)
    mail = models.CharField(unique=True, max_length=255)
    idk = models.OneToOneField('Korisnik', models.DO_NOTHING, db_column='idK', primary_key=True)  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'FIZICKO_LICE'


class IdeSa(models.Model):
    artikal2 = models.OneToOneField(Artikal, models.DO_NOTHING, db_column='artikal2', primary_key=True)  # The composite primary key (artikal2, artikal1) found, that is not supported. The first column is selected.
    artikal1 = models.ForeignKey(Artikal, models.DO_NOTHING, db_column='artikal1', related_name='idesa_artikal1_set')

    class Meta:
        managed = False
        db_table = 'IDE_SA'
        unique_together = (('artikal2', 'artikal1'),)


class Komentar(models.Model):
    rednibroj = models.AutoField(db_column='RedniBroj', primary_key=True)  # Field name made lowercase. The composite primary key (RedniBroj, idK) found, that is not supported. The first column is selected.
    komentar = models.TextField(blank=True, null=True)
    idk = models.ForeignKey('Korisnik', models.DO_NOTHING, db_column='idK')  # Field name made lowercase.
    sifraartikla = models.ForeignKey(Artikal, models.DO_NOTHING, db_column='sifraArtikla')  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'KOMENTAR'
        unique_together = (('rednibroj', 'idk'),)


class Korisnik(models.Model):
    idk = models.AutoField(db_column='idK', primary_key=True)  # Field name made lowercase.
    ime = models.CharField(max_length=20)
    prezime = models.CharField(max_length=20)
    telefon = models.CharField(max_length=30, blank=True, null=True)
    grad = models.CharField(max_length=20)
    zip = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'KORISNIK'


class Kupon(models.Model):
    idkupon = models.AutoField(db_column='idKupon', primary_key=True)  # Field name made lowercase.
    naziv = models.TextField(blank=True, null=True)
    vrednost = models.FloatField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'KUPON'


class Narudzbina(models.Model):
    idk = models.ForeignKey(Korisnik, models.DO_NOTHING, db_column='idK')  # Field name made lowercase.
    idnar = models.AutoField(db_column='idNar', primary_key=True)  # Field name made lowercase.
    datum = models.DateTimeField(blank=True, null=True)
    status = models.TextField(blank=True, null=True)
    ukupnacena = models.FloatField(db_column='ukupnaCena', blank=True, null=True)  # Field name made lowercase.
    adresa = models.TextField(blank=True, null=True)
    vreme = models.TimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'NARUDZBINA'


class NarudzbinaArtikal(models.Model):
    idnar = models.OneToOneField(Narudzbina, models.DO_NOTHING, db_column='idNar', primary_key=True)  # Field name made lowercase. The composite primary key (idNar, sifraArtikla) found, that is not supported. The first column is selected.
    cena = models.FloatField(blank=True, null=True)
    kolicina = models.IntegerField(blank=True, null=True)
    sifraartikla = models.ForeignKey(Artikal, models.DO_NOTHING, db_column='sifraArtikla')  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'NARUDZBINA_ARTIKAL'
        unique_together = (('idnar', 'sifraartikla'),)


class PopustArtikal(models.Model):
    popust = models.FloatField(blank=True, null=True)
    sifraartikla = models.OneToOneField(Artikal, models.DO_NOTHING, db_column='sifraArtikla', primary_key=True)  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'POPUST_ARTIKAL'


class PopustGrupa(models.Model):
    popust = models.FloatField(blank=True, null=True)
    tip = models.CharField(primary_key=True, max_length=20)

    class Meta:
        managed = False
        db_table = 'POPUST_GRUPA'


class PopustPib(models.Model):
    pib = models.IntegerField(db_column='PIB', primary_key=True)  # Field name made lowercase.
    popust = models.FloatField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'POPUST_PIB'


class PravnoLice(models.Model):
    lozinka = models.CharField(max_length=20)
    pib = models.IntegerField(db_column='PIB', unique=True)  # Field name made lowercase.
    idk = models.OneToOneField(Korisnik, models.DO_NOTHING, db_column='idK', primary_key=True)  # Field name made lowercase.
    mail = models.CharField(unique=True, max_length=255, blank=True, null=True)
    odobren = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'PRAVNO_LICE'


class Recenzija(models.Model):
    opis = models.TextField(blank=True, null=True)
    ocena = models.FloatField(blank=True, null=True)
    proizvodjac = models.CharField(max_length=20, blank=True, null=True)
    gazirano = models.IntegerField(blank=True, null=True)
    procenatalkohola = models.FloatField(db_column='procenatAlkohola', blank=True, null=True)  # Field name made lowercase.
    zemljaporekla = models.TextField(db_column='zemljaPorekla', blank=True, null=True)  # Field name made lowercase.
    povratnaambalaza = models.IntegerField(db_column='povratnaAmbalaza', blank=True, null=True)  # Field name made lowercase.
    slika = models.TextField(blank=True, null=True)
    sifraartikla = models.OneToOneField(Artikal, models.DO_NOTHING, db_column='sifraArtikla', primary_key=True)  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'RECENZIJA'


class AuthGroup(models.Model):
    name = models.CharField(unique=True, max_length=150)

    class Meta:
        managed = False
        db_table = 'auth_group'


class AuthGroupPermissions(models.Model):
    id = models.BigAutoField(primary_key=True)
    group = models.ForeignKey(AuthGroup, models.DO_NOTHING)
    permission = models.ForeignKey('AuthPermission', models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'auth_group_permissions'
        unique_together = (('group', 'permission'),)


class AuthPermission(models.Model):
    name = models.CharField(max_length=255)
    content_type = models.ForeignKey('DjangoContentType', models.DO_NOTHING)
    codename = models.CharField(max_length=100)

    class Meta:
        managed = False
        db_table = 'auth_permission'
        unique_together = (('content_type', 'codename'),)


class AuthUser(models.Model):
    password = models.CharField(max_length=128)
    last_login = models.DateTimeField(blank=True, null=True)
    is_superuser = models.IntegerField()
    username = models.CharField(unique=True, max_length=150)
    first_name = models.CharField(max_length=150)
    last_name = models.CharField(max_length=150)
    email = models.CharField(max_length=254)
    is_staff = models.IntegerField()
    is_active = models.IntegerField()
    date_joined = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'auth_user'


class AuthUserGroups(models.Model):
    id = models.BigAutoField(primary_key=True)
    user = models.ForeignKey(AuthUser, models.DO_NOTHING)
    group = models.ForeignKey(AuthGroup, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'auth_user_groups'
        unique_together = (('user', 'group'),)


class AuthUserUserPermissions(models.Model):
    id = models.BigAutoField(primary_key=True)
    user = models.ForeignKey(AuthUser, models.DO_NOTHING)
    permission = models.ForeignKey(AuthPermission, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'auth_user_user_permissions'
        unique_together = (('user', 'permission'),)


class DjangoAdminLog(models.Model):
    action_time = models.DateTimeField()
    object_id = models.TextField(blank=True, null=True)
    object_repr = models.CharField(max_length=200)
    action_flag = models.PositiveSmallIntegerField()
    change_message = models.TextField()
    content_type = models.ForeignKey('DjangoContentType', models.DO_NOTHING, blank=True, null=True)
    user = models.ForeignKey(AuthUser, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'django_admin_log'


class DjangoContentType(models.Model):
    app_label = models.CharField(max_length=100)
    model = models.CharField(max_length=100)

    class Meta:
        managed = False
        db_table = 'django_content_type'
        unique_together = (('app_label', 'model'),)


class DjangoMigrations(models.Model):
    id = models.BigAutoField(primary_key=True)
    app = models.CharField(max_length=255)
    name = models.CharField(max_length=255)
    applied = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'django_migrations'


class DjangoSession(models.Model):
    session_key = models.CharField(primary_key=True, max_length=40)
    session_data = models.TextField()
    expire_date = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'django_session'
