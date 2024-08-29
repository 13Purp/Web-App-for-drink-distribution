# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey and OneToOneField has `on_delete` set to the desired behavior
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models



class Administracija(models.Model):
    """
       Drzi tabelu administracije, u njoj se
        nalaze sva fizicka lica koja imaju moderatorske/admin privilegije
        polje mail predstavlja mail fizickog lica iz :model:`FizickoLice.mail`
        Ako se mail fizickog lica nalazi u ovoj tabeli, ono je tretirano kao moderator, ako je vrednost admin polja=1,
        Fizicko lice je admin sajta, ne u kontekstu django admina, isljucivo u kontekstu veb aplikacije
        Admin ima sve moderatorske privilegije uz mogucnost da dodaje/brise moderatore i artikle kao i da daje popuste


    """
    mail = models.CharField(primary_key=True, max_length=255)
    lozinka = models.CharField(max_length=20)
    admin = models.BooleanField(null=True, default=False)

    class Meta:
        managed = False
        db_table = 'ADMINISTRACIJA'


class Adresa(models.Model):
    """


         Predstavlja tabelu adresa svakog korisnika gde je idk adresa korisnika  :model:`Korisnik.idk`
         rbr je redni broj adrese po korisniku
         idk i rbr zajedno cine primarni kljuc tabele
         dok je adresa sama adresa


       """
    idk = models.ForeignKey('Korisnik', models.DO_NOTHING, db_column='idK')
    rbr = models.AutoField(db_column='RBr', primary_key=True)
    adresa = models.TextField(db_column='Adresa')

    class Meta:
        managed = False
        db_table = 'ADRESA'
        unique_together = (('idk', 'rbr'),)

    def __str__(self):
        return f"Adresa(idk={self.idk}, rbr={self.rbr}, adresa={self.adresa})"


class Artikal(models.Model):
    """
    Tabela Artikal sadrzi artikle i sve njihove relvantne informacije





    """


    mera = models.CharField(max_length=20, blank=True, null=True)
    stanje = models.IntegerField(blank=True, null=True)
    kolicinapakovanje = models.IntegerField(db_column='kolicinaPakovanje', blank=True,
                                            null=True)
    tip = models.CharField(max_length=20, blank=True, null=True)
    cena = models.FloatField(blank=True, null=True)
    pdv = models.IntegerField(db_column='PDV', blank=True, null=True)
    sifraartikla = models.AutoField(db_column='sifraArtikla', primary_key=True)
    naziv = models.CharField(max_length=40, blank=True, null=True)
    sadrzialkohol = models.BooleanField(default=False)
    uvoz = models.BooleanField(default=False)
    gazirano = models.BooleanField(default=False)
    specijalan = models.BooleanField(null=True, default=False)

    class Meta:
        managed = False
        db_table = 'ARTIKAL'


class FizickoLice(models.Model):
    """
       Fizicko lice je vezano za korisnika putem :model:`Korisnik.idk`
       Sadrzi lozinku koja se koristi za identifikaciju kao i mail Korisnika





       """
    lozinka = models.CharField(max_length=20)
    mail = models.CharField(unique=True, max_length=255)
    idk = models.OneToOneField('Korisnik', models.DO_NOTHING, db_column='idK',
                               primary_key=True)

    class Meta:
        managed = False
        db_table = 'FIZICKO_LICE'


class IdeSa(models.Model):
    """
           IdeSa je tabela koja bi trebalo da drzi informacije o kompatibilnosti dva artikla
           I korisniku bi se u korpi preporucivalo da uzme artikal koji ide uz neki iz njegove korpe
           Medjutim, ovo trenutno nije implementirano
           Ovo je dodatna funkcionalnost koja i nije bila predvidjena u prvobitnom projektu





    """
    artikal2 = models.OneToOneField(Artikal, models.DO_NOTHING, db_column='artikal2',
                                    primary_key=True)
    artikal1 = models.ForeignKey(Artikal, models.DO_NOTHING, db_column='artikal1', related_name='idesa_artikal1_set')

    class Meta:
        managed = False
        db_table = 'IDE_SA'
        unique_together = (('artikal2', 'artikal1'),)


class Komentar(models.Model):

    """
              Drzi tabelu komentara za svakog korisnika putem  :model:`Korisnik.idk` i za koji artikl je komentar vezan
              putem  :model:`Artikal.sifraartikla`
              Komentari se nalaze na stranici artikla u koju se moze uci iz kataloga






       """

    rednibroj = models.AutoField(db_column='RedniBroj',
                                 primary_key=True)
    komentar = models.TextField(blank=True, null=True)
    idk = models.ForeignKey('Korisnik', models.DO_NOTHING, db_column='idK')
    sifraartikla = models.ForeignKey(Artikal, models.DO_NOTHING, db_column='sifraArtikla')

    class Meta:
        managed = False
        db_table = 'KOMENTAR'
        unique_together = (('rednibroj', 'idk'),)


class Korisnik(models.Model):
    """
            Korisnik je tabela koja drzi sve korisnike iz kojih su izvedeni FizickoLice i PravnoLice
            Drzi osnovne poddatke o korisniku


    """
    idk = models.AutoField(db_column='idK', primary_key=True)
    ime = models.CharField(max_length=20)
    prezime = models.CharField(max_length=20)
    telefon = models.CharField(max_length=30, blank=True, null=True)
    grad = models.CharField(max_length=20)
    zip = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'KORISNIK'


class Kupon(models.Model):
    """
        Kupon drzi sve kupone, gde je naziv kupona njegova "sifra" a vrednost procenat za koji umanjuje konacnu cenu

    """

    idkupon = models.AutoField(db_column='idKupon', primary_key=True)
    naziv = models.TextField(blank=True, null=True)
    vrednost = models.FloatField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'KUPON'


class Narudzbina(models.Model):
    """
          Narudzbina drzi tabelu svih narudzbina ali ne i sadrzaj tih narudzbina, sadrzaj narudzbine se nalazi u
          tabeli NarudzbinaArtikal koja je sa tabelom Narudzbina povezana preko :model:`Narudzbina.idnar`
          Buduci da narudzbinu pravi korisnik, svaka narudzbina je povezana sa korisnikom putem :model:`Korisnik.idk`

      """
    idk = models.ForeignKey(Korisnik, models.DO_NOTHING, db_column='idK')
    idnar = models.AutoField(db_column='idNar', primary_key=True)
    datum = models.DateTimeField(blank=True, null=True)
    status = models.TextField(blank=True, null=True)
    ukupnacena = models.FloatField(db_column='ukupnaCena', blank=True, null=True)
    adresa = models.TextField(blank=True, null=True)
    vreme = models.TimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'NARUDZBINA'


class NarudzbinaArtikal(models.Model):
    """
            Drzi artikle u porudzbini  :model:`Narudzbina.idnar` putem :model:`Artikal.sifraartikla`
            Konacnu cenu kao i kolicinu svakog artikla

         """
    idnar = models.ForeignKey(Narudzbina, models.DO_NOTHING,
                              db_column='idNar')
    cena = models.FloatField(blank=True, null=True)
    kolicina = models.IntegerField(blank=True, null=True)
    sifraartikla = models.ForeignKey(Artikal, models.DO_NOTHING, db_column='sifraArtikla')  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'NARUDZBINA_ARTIKAL'
        unique_together = (('idnar', 'sifraartikla'),)


class PopustArtikal(models.Model):
    """
            Drzi popust na artikal putem :model:`Artikal.sifraartikla`


      """
    popust = models.FloatField(blank=True, null=True)
    sifraartikla = models.OneToOneField(Artikal, models.DO_NOTHING, db_column='sifraArtikla',
                                        primary_key=True)  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'POPUST_ARTIKAL'


class PopustGrupa(models.Model):
    """
            Drzi popust na tip artikla putem :model:`Artikal.tip`


    """
    popust = models.FloatField(blank=True, null=True)
    tip = models.CharField(primary_key=True, max_length=20)

    class Meta:
        managed = False
        db_table = 'POPUST_GRUPA'


class PopustPib(models.Model):
    """
        Drzi popust za Artikal :model:`Artikal.tip` specifican pib putem :model:`FizickoLice.pib`


       """
    pib = models.IntegerField(db_column='PIB', primary_key=True)  # Field name made lowercase.
    popust = models.FloatField(blank=True, null=True)
    sifraartikla = models.OneToOneField(Artikal, models.DO_NOTHING,
                                        db_column='sifraArtikla')  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'POPUST_PIB'


class PravnoLice(models.Model):
    """

          Pravno lice je slicno Fizickom licu, osim sto mora biti odobren i ima polje za pib


    """
    lozinka = models.CharField(max_length=20)
    pib = models.IntegerField(db_column='PIB', unique=True)  # Field name made lowercase.
    mail = models.CharField(unique=True, max_length=255, null=True, blank=True)
    odobren = models.BooleanField(default=False)
    idk = models.OneToOneField(Korisnik, models.DO_NOTHING, db_column='idK',
                               primary_key=True)  # Field name made lowercase.

    class Meta:
        managed = True
        db_table = 'PRAVNO_LICE'


class Recenzija(models.Model):
    """

              Recenzija drzi informacije o Artiklu koje se prikazuju u karakteristikama artikla na stranici Artikla
              Kao i prosecnu ocenu tog Artikla


        """
    opis = models.CharField(blank=True, null=True, max_length=150)
    ocena = models.FloatField(blank=True, null=True)
    proizvodjac = models.CharField(max_length=20, blank=True, null=True)
    gazirano = models.BooleanField(blank=True, null=True)
    procenatalkohola = models.FloatField(db_column='procenatAlkohola', blank=True,
                                         null=True)
    zemljaporekla = models.CharField(db_column='zemljaPorekla', blank=True, null=True,
                                     max_length=20)
    povratnaambalaza = models.BooleanField(db_column='povratnaAmbalaza', blank=True,
                                           null=True)
    slika = models.CharField(blank=True, null=True, max_length=45)
    sifraartikla = models.OneToOneField(Artikal, models.DO_NOTHING, db_column='sifraArtikla',
                                        primary_key=True)
    brojocena = models.IntegerField(db_column='brojOcena', blank=True, null=True,
                                    default=1)

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

class Ocena(models.Model):
    """

              Tabela ocena drzi koju ocenu je dao neki korisnik za specifican artikal
              Poenta ovoga je da se spreci davanje vise ocena za jedan artikal od strane jednog korisnika


        """

    # idk = models.OneToOneField(Korisnik, models.DO_NOTHING, db_column='idK', primary_key=True)
    idk = models.ForeignKey(Korisnik, models.DO_NOTHING, db_column='idK')
    sifraartikla = models.ForeignKey(Artikal, models.DO_NOTHING,
                                     db_column='sifraArtikla')  # Field name made lowercase.
    ocena = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'OCENA'
        unique_together = (('idk', 'sifraartikla'),)
        constraints = [
            models.UniqueConstraint(fields=['idk', 'sifraartikla'], name='unique_ocena')
        ]


class Katalog(models.Model):
    pib = models.IntegerField(db_column='PIB')  # Field name made lowercase.
    sifraartikla = models.ForeignKey(Artikal, models.DO_NOTHING, db_column='sifraArtikla')  # Field name made lowercase.
    idkat = models.AutoField(db_column='idKat', primary_key=True)  # Field name made lowercase.
    cena = models.FloatField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'KATALOG'
