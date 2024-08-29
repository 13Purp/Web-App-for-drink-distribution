# Nikolina Grbović 0315-21
# Ilija Jakovljević 0542-21
# Iva Paunovic 0580-21
# Vojin Urošević 0397-21

from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.core.files.storage import FileSystemStorage
from django.core.mail import send_mail
from django.http import HttpResponse
from django.http import JsonResponse
from django.shortcuts import render, redirect
from django.urls import reverse
from django.utils import timezone
from django.db.models import F
from itertools import chain

from aplikacija.models import Korisnik, Komentar, PopustPib, Administracija, Artikal, Recenzija, FizickoLice, Adresa, \
    PravnoLice, PopustArtikal, Kupon, Narudzbina, NarudzbinaArtikal, Ocena, Katalog
from .decorators import custom_login_required, admin_login_required





# Create your views here.

def registracijaS(request):
    """

        Prikazuje stranicu za registraciju


        """
    return render(request, 'registracija.html')


def registracijaR(request):
    """

            Prima zahtev za registraciju putem ajax-a iz registracija.js i upisuje podatke novog korisnika u bazu
            Po potrebi ga upisuje u tabelu FizickoLice ili PravnoLice


            """

    if request.method == 'POST':
        email = request.POST.get('email')
        passw = request.POST.get('pass')
        tel = request.POST.get('tel')
        grad = request.POST.get('grad')
        ime = request.POST.get('ime')
        prezime = request.POST.get('prezime')
        adresa = request.POST.get('adresa')
        zipk = request.POST.get('zip')
        pib = request.POST.get('pib')
        flice = request.POST.get('fLice')

        print(str(flice))

        if str(flice) == 'on':
            print("Postoji li " + str(email))
            if FizickoLice.objects.filter(mail=email).exists():
                print(FizickoLice.objects.get(mail=email).mail + "Postoji")
                return JsonResponse({'val': '-1'})
            print("Ne postoji")

            kor = Korisnik(ime=ime, prezime=prezime, telefon=tel, grad=grad, zip=zipk)
            print("kor")

            kor.save()
            print("korsave")

            idK = Korisnik.objects.get(ime=ime, prezime=prezime, telefon=tel, grad=grad, zip=zipk).idk
            print("idk")

            fizickoLice1 = FizickoLice(idk_id=idK, lozinka=passw, mail=email)

            try:
                fizickoLice1.save()
                print("FizickoLice object saved successfully")
            except Exception as e:
                print("Exception occurred while saving FizickoLice:", e)

            return JsonResponse({
                'val': '1',
                'url': '/loginS/'
            })

        else:
            print("Postoji li " + str(email))
            if PravnoLice.objects.filter(mail=email).exists():
                print(PravnoLice.objects.get(mail=email).mail + "Postoji")
                return JsonResponse({'val': '-1'})
            print("Ne postoji")

            kor = Korisnik(ime=ime, prezime=prezime, telefon=tel, grad=grad, zip=zipk)
            print("kor")

            kor.save()
            print("korsave")

            idK = Korisnik.objects.get(ime=ime, prezime=prezime, telefon=tel, grad=grad, zip=zipk).idk
            print("idk")

            PravnoLice1 = PravnoLice(idk_id=idK, lozinka=passw, mail=email, pib=pib, odobren=True)
            print("fLice")

            PravnoLice1.save()
            print("fLiceSave")

            print("fLiceGet")

            return JsonResponse({
                'val': '1',
                'url': '/loginS/'
            })


    else:
        return JsonResponse({'val': '1'}, status=400)


def loginS(request):
    """

        Prikazuje stranicu za login i sluzi kao stranica za redirect svih neautorizovanih pokusaja pristupa stranicama


    """
    if request.method == 'POST':
        logout(request)
        redirect_url = reverse('loginS')
        return JsonResponse({'redirect': redirect_url})

    return render(request, 'login.html')


def loginR(request):
    """

          Procesuira ajax zahtev za logovanje i odobrava dalji pristup ili ga odbija
          Loguje korisnika putem email adrese i sifre, proverava da li je korisnik Fizicko ili Pravno lice i loguje ga
          kao takvo


        """
    if request.method == 'POST':
        email = request.POST.get('email')
        passw = request.POST.get('pass')
        print(f"Received email: {email}, password: {passw}")

        obj = None

        try:
            obj = FizickoLice.objects.get(mail=email)
        except FizickoLice.DoesNotExist:
            try:
                obj = PravnoLice.objects.get(mail=email)
            except PravnoLice.DoesNotExist:
                return JsonResponse({'val': '3'}, status=404)

        if obj:
            if obj.lozinka == passw:
                if not User.objects.filter(email=email).exists():
                    user = User.objects.create_user(username=email, email=email, password=passw)
                else:
                    user = User.objects.get(email=email)

                user = authenticate(username=email, password=passw)
                if user is not None:
                    login(request, user)
                    request.session['logovan'] = 1
                    return JsonResponse({'val': '1', 'url': '/uspesnoLogovanje/'})
                else:
                    return JsonResponse({'val': '0'}, status=401)
            else:
                return JsonResponse({'val': '3'}, status=401)
        else:
            return JsonResponse({'val': '-1'}, status=404)
    else:
        return JsonResponse({'val': '1'}, status=400)


@custom_login_required(login_url='loginS')
def uspesnoLogovanje(request):
    """

            Nakon uspesnog logovanja ucitava glavnu stranicu sajta i vraca artikle koji ce biti prikazani na vrtesci


          """
    artikli = Artikal.objects.all()
    artikli_json = json.dumps(list(artikli.values()))

    return render(request, 'index.html', {'artikli': artikli_json})


import json


@custom_login_required(login_url='loginS')
def nalogS(request):
    """

        Vraca prikaz stranice koja sluzi za izmenu podataka fizickog/pravnog lica kome pripada trenutno logovan korisnik
        Ista stranica sluzi za dodavanje nove adrese kao i brisanje starih adresa


    """

    user = request.user.username
    try:
        lice = FizickoLice.objects.get(mail=user)
        korisnik = Korisnik.objects.get(idk=lice.idk.idk)
        korisnik_json = json.dumps({'idk': lice.idk.idk, 'mail': lice.mail, 'pib': '-1',
                                    'ime': korisnik.ime, 'prezime': korisnik.prezime, 'telefon': korisnik.telefon,
                                    'grad': korisnik.grad, 'zip': korisnik.zip})
    except FizickoLice.DoesNotExist:
        lice = PravnoLice.objects.get(mail=user)
        korisnik = Korisnik.objects.get(idk=lice.idk.idk)
        korisnik_json = json.dumps({'idk': lice.idk.idk, 'mail': lice.mail, 'pib': lice.pib,
                                    'ime': korisnik.ime, 'prezime': korisnik.prezime, 'telefon': korisnik.telefon,
                                    'grad': korisnik.grad, 'zip': korisnik.zip})

    adrese = Adresa.objects.filter(idk=lice.idk).values('adresa')
    adrese_list = list(adrese)
    adrese_json = json.dumps(adrese_list)

    return render(request, 'nalog.html', {'korisnik': korisnik_json, 'adrese': adrese_json})


def dodajAdresu(request):
    """

           Prima ajax zahtev (sa stranice koju prikazuje nalogS) za dodavanje nove adrese trenutnog korisnika i upisuje adresu u bazu

       """
    if request.method == 'POST':
        idK = request.POST.get('idk')
        adresa = request.POST.get('adresa')

        try:

            korisnik = Korisnik.objects.get(idk=idK)
            a = Adresa(idk=korisnik, adresa=adresa)
            a.save()
            return JsonResponse({'val': '1'})
        except Korisnik.DoesNotExist:
            return JsonResponse({'val': '-1', 'message': 'Korisnik ne postoji'})
        except Exception as e:
            return JsonResponse({'val': '-1', 'message': str(e)})
    else:
        return JsonResponse({'val': '1'}, status=400)


def izbrisiAdresu(request):
    """

               Prima ajax zahtev (sa stranice koju prikazuje nalogS) za brisanje adrese trenutnog korisnika i brise je iz baze

    """
    if request.method == 'POST':
        idK = request.POST.get('idk')
        adresa = request.POST.get('adresa')
        print("Korisnik ID: ", idK)
        print("Adresa: ", adresa)

        try:
            korisnik = Korisnik.objects.get(idk=idK)
            adrese = Adresa.objects.filter(idk=korisnik, adresa=adresa)
            adrese.delete()
            return JsonResponse({'val': '1'})
        except Korisnik.DoesNotExist:

            return JsonResponse({'val': '-1', 'message': 'Korisnik ne postoji'})
        except Adresa.DoesNotExist:

            return JsonResponse({'val': '-1', 'message': 'Adresa ne postoji'})
        except Exception as e:
            print(str(e))
            return JsonResponse({'val': '-1', 'message': str(e)})

    else:
        return JsonResponse({'val': '1'}, status=400)


def zavrsiIzmene(request):
    """

        Prima ajax zahtev (sa stranice koju prikazuje nalogS izazvan klikom na dugme zavrsi izmene)
        Zahtev sadrzi informacije o korisniku koje su potencijalno menjane i upisuje ih u bazu
        vraca odgovor vezan za uspesnost operacije

      """
    if request.method == 'POST':
        ime = request.POST.get('ime')
        prezime = request.POST.get('prezime')
        grad = request.POST.get('grad')
        zipR = request.POST.get('zip')
        idk = request.POST.get('idk')
        sifra = request.POST.get('sifra')

        try:
            korisnik = Korisnik.objects.get(idk=idk)

            korisnik.ime = ime
            korisnik.prezime = prezime
            korisnik.grad = grad
            korisnik.zip = zipR
            korisnik.save(force_update=True)

            try:
                lice = FizickoLice.objects.get(idk=korisnik)

            except FizickoLice.DoesNotExist:
                lice = PravnoLice.objects.get(idk=korisnik)

            if sifra != '':
                lice.lozinka = sifra
                lice.save()
                korisnik.save()

                return JsonResponse({'val': '1'})

        except Korisnik.DoesNotExist:
            return JsonResponse({'val': '-1', 'message': 'Korisnik ne postoji'})
        except Exception as e:
            print(str(e))
            return JsonResponse({'val': '-1', 'message': str(e)})

    else:
        return JsonResponse({'val': '1'}, status=400)

    return JsonResponse({'val': '1'}, status=200)


def korpaS(request):
    """

           Sluzi za prikazivanje korpe korisniku i vraca sadrzaj korpe kako bi se on prikazao

          """
    artikli = Artikal.objects.all()
    artikli_json = json.dumps(list(artikli.values()))
    kupon = Kupon.objects.all()
    kuponi_json = json.dumps([{"naziv": pa.naziv, "vrednost": pa.vrednost} for pa in kupon])

    return render(request, 'korpa.html', {'artikli': artikli_json, 'kuponi': kuponi_json})


def katalogS(request):
    """

    Sluzi za prikazivanje kataloga
    Buduci da je u katalog moguce uci iz svake stranice putem pretrage, ovaj view prima ajax zahtev sa bilo koje stranice
    i vraca odgovor koji sadrzi url kataloga

    U slucaju da je katalogu pristupljeno regularnim putem (ne putem pretrage sa drugih stranica) uzima sve artikle iz baze
    i vraca ih zajedno sa template-om katalog stranice, uz to vraca i sve relavantne popuste za prikazane artikle kako bi
    njihova cena mogla da se prikaze uz popust



    """
    if request.method == 'POST':
        naziv = request.POST.get('zahtev')

        request.session['prosledjeno'] = naziv
        print(request.session['prosledjeno'])
        redirect_url = reverse('katalogS')
        return JsonResponse({'redirect': redirect_url})

    json_data = json.dumps({"src": request.session.get('prosledjeno')})
    print(request.session.get('prosledjeno'))
    if json_data is not None:
        print('prazan')
    else:
        json_data = json.dumps({"src": ""})



    p = 0
    popustP = PopustPib.objects.all()
    if request.user.is_authenticated:
        mail = request.user.username
        try:
            lice = PravnoLice.objects.get(mail=mail)
            pib = lice.pib
            artikli = Katalog.objects.filter(pib=pib).select_related('sifraartikla').values(
                mera=F('sifraartikla__mera'),
                stanje=F('sifraartikla__stanje'),
                kolicinapakovanje=F('sifraartikla__kolicinapakovanje'),
                tip=F('sifraartikla__tip'),
                pdv=F('sifraartikla__pdv'),
                naziv=F('sifraartikla__naziv'),
                sadrzialkohol=F('sifraartikla__sadrzialkohol'),
                uvoz=F('sifraartikla__uvoz'),
                gazirano=F('sifraartikla__gazirano'),
                specijalan=F('sifraartikla__specijalan'),

            )
            p = 1
            artikli_json = json.dumps(list(artikli.values()))
            popust = PopustArtikal.objects.all()
            popust_json = json.dumps(
                [{"sifraartikla": pa.sifraartikla.sifraartikla, "popust": pa.popust} for pa in popust])


        except PravnoLice.DoesNotExist:
            artikli = Artikal.objects.all()
            artikli_json = json.dumps(list(artikli.values()))
            popust = PopustArtikal.objects.all()
            popust_json = json.dumps(
                [{"sifraartikla": pa.sifraartikla.sifraartikla, "popust": pa.popust} for pa in popust])
    else:
        artikli = Artikal.objects.all()
        artikli_json = json.dumps(list(artikli.values()))
        popust = PopustArtikal.objects.all()
        popust_json = json.dumps([{"sifraartikla": pa.sifraartikla.sifraartikla, "popust": pa.popust} for pa in popust])

    popustP_json = json.dumps([{"sifraartikla": pa.sifraartikla.sifraartikla, "popust": pa.popust} for pa in popustP])

    return render(request, 'katalog.html',
                  {'artikli': artikli_json, 'popust': popust_json, 'firma': p, 'popustP': popustP_json,
                   'prosledjeno': json_data})


def indexS(request):
    """

       Prikazuje glavnu stranicu i vraca sve artikle kako bi bili prikazani u vrtesci


       """
    artikli = Artikal.objects.all()
    artikli_json = json.dumps(list(artikli.values()))

    return render(request, 'index.html', {'artikli': artikli_json})


def katalogPretraga(request):
    """

           Nekorisceni deo koda, ova funckija je integrisana u sam katalog view


    """
    # izvrsi pretragu
    pretraga = request.GET.get('pretraga')
    print(pretraga)
    return render(request, 'katalog.html')


def zabLozinkaS(request):
    """

        Vraca prikaz stranice za zaboravljenu lozinku


        """
    return render(request, 'zablozinka.html')


def posaljiMail(request):
    """

           Prima ajax zahtev za regulisanje zaboravljene lozinke i vraca poruku o uspesnosti slanja mejla koji sadrzi lozinku


            """
    if request.method == 'POST':
        email = request.POST.get('email')

        if not email:
            return JsonResponse({'val': '-1', 'message': 'Email nije prosleđen'}, status=400)

        try:
            try:

                stara_lozinka = FizickoLice.objects.get(mail=email).lozinka
            except FizickoLice.DoesNotExist:
                stara_lozinka = PravnoLice.objects.get(mail=email).lozinka

            send_mail(
                'Zaboravljena lozinka',
                'U prilogu se nalazi Vasa stara sifra savetujemo vam da je odmah promenite! \n' + "Stara sifra: " + stara_lozinka,
                'prodavnicapsi@outlook.com',
                [email],
                fail_silently=False,
            )

            return JsonResponse({'val': '1'})
        except PravnoLice.DoesNotExist:
            return JsonResponse({'val': '-2', 'message': 'Korisnik ne postoji'})
        except Exception as e:
            print(str(e))
            return JsonResponse({'val': '-1', 'message': str(e)}, status=500)
    else:
        return JsonResponse({'val': '-1', 'message': 'Pogrešan metod'}, status=400)


def finalizacijaGostS(request):
    """

        Vraca prikaz stranice za finalizaciju porudzbine kod gosta


    """
    return render(request, 'finalizacijapGost.html')


@custom_login_required(login_url='loginS')
def finalizacijaKorisnikS(request):
    """

            Vraca prikaz stranice za finalizaciju porudzbine kod korisnika, dekorater iznad dopusta ulaz u slucaju da
            je korisnik registrovan, u suprotnom salje na stranicu za prijavu


        """
    return render(request, 'finalizacijaKorisnik.html')


def artikalS(request):
    """
      Ovaj view procesuira zahtev za prikazivanje detalja o određenom artiklu,
     priprema podatke u JSON formatu o artiklu, recenziji i komentarima,
     i renderuje odgovarajući HTML šablon u zavisnosti od uloge korisnika

     """

    ad=0
    a=1
    sifra = request.GET.get('sifra')
    artikal = Artikal.objects.get(sifraartikla=sifra)
    cena=artikal.cena
    if request.user.is_authenticated:
        a = 0
        ad = 0
        if request.user.is_authenticated:
            mail = request.user.username
            if(PravnoLice.objects.filter(mail=mail).exists()):
                p=1
                pib=PravnoLice.objects.get(mail=mail).pib
                cena=Katalog.objects.get(sifraartikla_id=sifra,pib=pib).cena/(1+artikal.pdv/100)
            try:
                lice = Administracija.objects.get(mail=mail)
                ad = 1
            except Administracija.DoesNotExist:
                ad = 0
        else:
            a = 1

    else:
        a = 1


    artikal_json = json.dumps({
        'sifra': artikal.sifraartikla,
        'naziv': artikal.naziv,
        'cena': cena,
        'mera': artikal.mera,
        'tip': artikal.tip,
        'kolicinaPakovanje': artikal.kolicinapakovanje,
        'pdv': artikal.pdv,
        'stanje': artikal.stanje,
        'specijalan': artikal.specijalan,

    })
    recenzija = Recenzija.objects.get(sifraartikla=sifra)
    recencija_json = json.dumps({
        'opis': recenzija.opis,
        'ocena': recenzija.ocena,
        'proizvodjac': recenzija.proizvodjac,
        'gazirano': recenzija.gazirano,
        'procenatAlkohola': recenzija.procenatalkohola,
        'zemljaPorekla': recenzija.zemljaporekla,
    })

    komentari = Komentar.objects.filter(sifraartikla=sifra)
    rezultati = []

    for komentar in komentari:
        korisnik = Korisnik.objects.get(idk=komentar.idk.idk)

        rezultat = {
            'komentar': komentar.komentar,
            'ime': korisnik.ime,
            'idk': korisnik.idk
        }
        rezultati.append(rezultat)
    rezultati_json = json.dumps(rezultati)


    popust = PopustArtikal.objects.all()
    popust_json = json.dumps([{"sifraartikla": pa.sifraartikla.sifraartikla, "popust": pa.popust} for pa in popust])



    if ad == 1:
        if not request.user.is_authenticated:
            return redirect('loginS')
        email = request.user.email
        if not Administracija.objects.filter(mail=email).exists():
            return redirect('loginS')
        return render(request, 'artiklMod.html',
                      {'artikal': artikal_json, 'recenzija': recencija_json, 'komentari': rezultati_json, 'anoniman': a,
                       'admin': ad, 'firma': p, 'popust': popust_json, })


    else:
        return render(request, 'artikl.html',
                      {'artikal': artikal_json, 'recenzija': recencija_json, 'komentari': rezultati_json, 'anoniman': a,
                       'admin': ad, 'firma': p, 'popust': popust_json, })


@admin_login_required(login_url='loginS')
def dodavanjeProizvoda(request):
    """

            Omogucen pristup samo korisniku sa admin privilegijama koriscenjem dekoratera iznad
            Regulise dodavanje novog artikla i promenu slike starog
            Prima 3 vrste ajax zahteva koje razlikuje putem vrednosti kljuca  upload
            U slucaju da je nula, radi se o zahtevu za brisanje artikla, brise artikal iz baze i vraca listu preostalih artikala

            U slucaju da sifra nije poslata, radi se o promeni slike vec postojeceg artikla poslate sa stranice ArtikalMod
            Prepisuje postojecu sliku novom slikom i postavlja joj ime na naziv artikla

            U trecem slucaju se radi o dodavanju potpuno novog artikla, upisuje se u bazu i ponovo vraca listu artikala koji ce biti prikazani u tabeli svih artikala
            na stranici za dodavanje artikla


            """
    if request.method == 'POST':
        if request.POST.get('upload') == 0:
            Artikal.objects.filter(sifraartikla=request.POST.get('id')).delete()

            proizvodi = json.dumps(
                [
                    {
                        "sifra": obj.sifraartikla,
                        "naziv": obj.naziv,
                        "cena": obj.cena,
                        "stanje": obj.stanje,
                        "gazirano": obj.gazirano,
                        "tip": obj.tip,
                        "sadrzialkohol": obj.sadrzialkohol,
                        "uvoz": obj.uvoz
                    }
                    for obj in Artikal.objects.all()
                ])

            return JsonResponse({'proizvodi': proizvodi})

        if request.POST.get('sifra') is None:
            print("menjam sliku")
            slika = request.FILES.get('slika')
            naziv = request.POST.get('naziv')
            if slika:
                product_images_dir = "static/slike"
                fs = FileSystemStorage(location=product_images_dir)
                filename = fs.save(naziv + ".jpg", slika)
                uploaded_file_url = fs.url(filename)
            else:
                uploaded_file_url = None

        else:

            naziv = request.POST.get('naziv')
            sifra = request.POST.get('sifra')
            cena = request.POST.get('cena')
            stanje = request.POST.get('stanje')
            gaz = bool(request.POST.get('gazirano'))
            uvoz = bool(request.POST.get('uvoz'))
            salk = bool(request.POST.get('sAlk'))
            slika = request.FILES.get('slika')
            print(naziv, sifra, cena, stanje, gaz, uvoz)

            if slika:
                product_images_dir = "static/slike"
                fs = FileSystemStorage(location=product_images_dir)
                filename = fs.save(naziv + ".jpg", slika)
                uploaded_file_url = fs.url(filename)
            else:
                uploaded_file_url = None

            new_product = Artikal(
                mera='Litar',
                stanje=stanje,
                kolicinapakovanje=1,
                tip='sok',
                cena=cena,
                pdv=20,
                sifraartikla=sifra,
                naziv=naziv,
                gazirano=gaz,
                uvoz=uvoz,
                sadrzialkohol=salk,
                specijalan=True,
            )

            print("pre save")
            new_product.save()

            rec = Recenzija(sifraartikla_id=new_product.sifraartikla, ocena=5, proizvodjac="", gazirano=False,
                            procenatalkohola=0, zemljaporekla="", povratnaambalaza=False, brojocena=1, slika="da")
            rec.save()
            print("posle save")

            return HttpResponse("Form submitted successfully!")

    proizvodi = json.dumps(
        [
            {
                "sifra": obj.sifraartikla,
                "naziv": obj.naziv,
                "cena": obj.cena,
                "stanje": obj.stanje,
                "gazirano": obj.gazirano,
                "tip": obj.tip,
                "sadrzialkohol": obj.sadrzialkohol,
                "uvoz": obj.uvoz
            }
            for obj in Artikal.objects.all()
        ])

    return render(request, 'dodavanjeProizvoda.html', {"proizvodi": proizvodi})


def dodajKomentar(request):
    """
        Ovaj view omogućava dodavanje komentara na određeni artikal.
        Ukoliko je zahtev metod POST, izvlače se podaci o komentaru i šifri artikla iz zahteva.
        Zatim se proverava da li je korisnik autentifikovan, te se dodaje komentar u bazu podataka.
        Ukoliko korisnik nije autentifikovan, vraća se odgovarajući JSON odgovor

    """
    if request.method == 'POST':
        kom = request.POST.get('komentar')
        sifraArtikla = request.POST.get('sifra')

        try:
            if request.user.is_authenticated:

                user = request.user.username
                try:
                    lice = FizickoLice.objects.get(mail=user)
                    idk = lice.idk

                except FizickoLice.DoesNotExist:
                    lice = PravnoLice.objects.get(mail=user)
                    idk = lice.idk
                a = Artikal.objects.get(sifraartikla=sifraArtikla)
                k = Komentar(sifraartikla=a, idk=idk, komentar=kom)
                k.save()
                return JsonResponse({'val': '1'})

            else:
                return JsonResponse({'val': '-2'})
        except Exception as e:
            print(str(e))
            return JsonResponse({'val': '-1', 'message': str(e)})
    else:
        return JsonResponse({'val': '1'}, status=400)


def naruciSpec(request):
    """
        Buduci da se porucivanje specijalnih artikala ne moze izvrisiti isto kao i porucivanje ostatka artikala
        Ovaj view hvata ajax zahtev sa stranice specijalnog artikla i zatim salje mejl prodavnici o zahtevu za porucivanje
        Vraca json odgovore u zavisnosti od uspeha
    """
    if request.method == 'POST':

        sifraArtikla = request.POST.get('sifra')

        artikal = Artikal.objects.get(sifraartikla=sifraArtikla)
        admin = Administracija.objects.get(admin=True)

        try:
            if request.user.is_authenticated:

                user = request.user.username
                try:
                    lice = FizickoLice.objects.get(mail=user)
                    idk = lice.idk

                except FizickoLice.DoesNotExist:
                    lice = PravnoLice.objects.get(mail=user)
                    idk = lice.idk
                send_mail(
                    'Narucivanje specijalnog artikla',  # Naslov emaila
                    'Korisnik ' + idk.ime + " zeli da poruci " + artikal.naziv + "\n Korisnikov email i broj telefona: "
                    + idk.ime + " " + idk.prezime + " " + idk.telefon + " " + lice.mail,
                    # Tekst poruke
                    'prodavnicapsi@outlook.com',  # Pošiljatelj
                    ['prodavnicapsi@outlook.com', admin.mail],  # Lista primatelja
                    fail_silently=True,  # Postavka za ignoriranje grešaka prilikom slanja emaila
                )
                return JsonResponse({'val': '1'})

            else:
                return JsonResponse({'val': '-2'})
        except Exception as e:
            print(str(e))
            return JsonResponse({'val': '-1', 'message': str(e)})
    else:
        return JsonResponse({'val': '1'}, status=400)


def izbrisiKomentar(request):
    """
        Ovaj view omogućava brisanje korisničkog komentara na određenom artiklu
        Izvlače se podaci o komentaru, šifri artikla i korisnikovom ID-u iz zahteva.
        Zatim se proverava da li je korisnik autentifikovan i briše se odgovarajući komentar iz baze podataka
        Mogucnost brisanja komentara je jedino moguc iz moderatorskog prikaza artikla tj stranice artiklMod
    """
    if request.method == 'POST':
        kom = request.POST.get('komentar')
        sifraArtikla = request.POST.get('sifra')
        idk = request.POST.get('idk')

        try:
            if request.user.is_authenticated:

                komentar = Komentar.objects.get(sifraartikla=sifraArtikla, idk=idk, komentar=kom)
                komentar.delete()
                return JsonResponse({'val': '1'})
            else:
                return JsonResponse({'val': '-2'})
        except Exception as e:
            print(str(e))
            return JsonResponse({'val': '-1', 'message': str(e)})
    else:
        return JsonResponse({'val': '1'}, status=400)


@admin_login_required(login_url='loginS')
def adminStranica(request):
    """
          Regulise prikaz admin stranice (ulaz je omogucen samo adminu putem dekoratera iznad)
          View prima 4 tipa ajax zahteva i prikazuje samu AdminStranicu
          zahtev:0 je zahtev za dodavanje popusta na neki artikal, vraca poruku o uspehu
          zahtev:1 je zahtev za dodavanje moderatorskih privilegija nekom fizickom licu, vraca poruku o uspehu
          zahtev:2 je zahtev za oduzimanje moderatorskih privilegija nekom fizickom licu, vraca poruku o uspehu
          zahtev:3 je zahtev za dodavanje popusta na neki artikl nekom pravnom licu, vraca poruku o uspehu
       """
    if request.method == 'POST':
        if request.POST.get('zahtev') == '0':
            popust = request.POST.get('popust')
            sifra = request.POST.get('sifra')
            print(str(popust) + " " + str(sifra))

            try:
                art = Artikal.objects.get(sifraartikla=sifra).sifraartikla
                pop = PopustArtikal(sifraartikla_id=art, popust=popust)
                pop.save()
                return JsonResponse({'val': '1'})
            except:
                return JsonResponse({'val': '-1'})

        if request.POST.get('zahtev') == '1':
            email = request.POST.get('email')
            pasw = request.POST.get('sifra')
            print("Ima korisnik " + str(User.objects.filter(email=email).count()))
            if User.objects.filter(email=email).count() != 0:
                pasw = FizickoLice.objects.get(mail=email).lozinka
                mod = Administracija(mail=email, lozinka=pasw, admin=False)
                mod.save()
                return JsonResponse({'val': '1'})

        if request.POST.get('zahtev') == '2':
            email = request.POST.get('email')
            print("Ima moderator " + str(Administracija.objects.filter(mail=email).count()))
            if Administracija.objects.filter(mail=email).count() != 0:
                Administracija.objects.get(mail=email, admin=False).delete()
                return JsonResponse({'val': '1'})
            else:
                return JsonResponse({'val': '-1'})

        if request.POST.get('zahtev') == '3':
            popust = request.POST.get('popust')
            sifra = request.POST.get('sifra')
            pib = request.POST.get('pib')

            print(str(popust) + " " + str(sifra))

            try:
                art = Artikal.objects.get(sifraartikla=sifra).sifraartikla
                pop = PopustPib(pib=pib, sifraartikla_id=art, popust=popust)
                pop.save()
                return JsonResponse({'val': '1'})
            except:
                return JsonResponse({'val': '-1'})


        else:
            return JsonResponse({'val': '-1'})

    else:
        return render(request, 'adminStranica.html')


def finalizacija(request):
    """
     Ovaj view omogućava finalizaciju kupovine.
     Ukoliko je zahtev metod POST, prihvata se AJAX zahtev koji sadrži informacije o korpi sa proizvodima koje korisnik želi da kupi
     U suprotnom, proverava se da li je korisnik autentifikovan i priprema se odgovarajući JSON objekat sa podacima o korisniku i adresama, te se renderuje odgovarajući HTML šablon za finalizaciju kupovine
     Ukoliko korisnik nije autentifikovan, renderuje se HTML šablon za finalizaciju kupovine kao gosta
     Ovaj view ne upisuje nista u bazu, taj posao je delegiran view-u uspesnaNarudzbina

    """

    if request.method == 'POST':
        print("primljen ajax")
        korpa_data = request.POST.get('korpa')

        try:
            korpa_json = json.loads(korpa_data)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON data.'}, status=400)

        for item in korpa_json:
            sifra_artikla = item.get('sifraArtikla')
            kolicina_artikla = item.get('kolicinaArtikla')
            cena = item.get('cena')

            print(f"Sifra Artikla: {sifra_artikla}, Kolicina Artikla: {kolicina_artikla}, Cena: {cena}")

        return JsonResponse({'message': 'Data received successfully.'})

    if request.user.is_authenticated:
        user = request.user.username
        try:
            lice = FizickoLice.objects.get(mail=user)
            korisnik = Korisnik.objects.get(idk=lice.idk.idk)
            korisnik_json = json.dumps({'idk': lice.idk.idk, 'mail': lice.mail, 'pib': '-1',
                                        'ime': korisnik.ime, 'prezime': korisnik.prezime, 'telefon': korisnik.telefon,
                                        'grad': korisnik.grad, 'zip': korisnik.zip})
        except FizickoLice.DoesNotExist:
            lice = PravnoLice.objects.get(mail=user)
            korisnik = Korisnik.objects.get(idk=lice.idk.idk)
            korisnik_json = json.dumps({'idk': lice.idk.idk, 'mail': lice.mail, 'pib': lice.pib,
                                        'ime': korisnik.ime, 'prezime': korisnik.prezime, 'telefon': korisnik.telefon,
                                        'grad': korisnik.grad, 'zip': korisnik.zip})

        adrese = Adresa.objects.filter(idk=lice.idk).values('adresa')
        adrese_list = list(adrese)
        adrese_json = json.dumps(adrese_list)

        return render(request, 'finalizacijaKorisnik.html', {'korisnik': korisnik_json, 'adrese': adrese_json})

    return render(request, 'finalizacijapGost.html')


def uspesnaNarudzbina(request):
    """
    Ovaj view omogućava uspešnu obradu narudžbine.
    Ukoliko je zahtev metod POST i ne sadrži zahtev za prikazivanjem HTML stranice, prihvata se AJAX zahtev koji sadrži informacije o korpi sa proizvodima koje je korisnik naručio, kupon, adresu i ukupnu cenu narudžbine.
    Zatim se kreira nova narudžbina u bazi podataka sa odgovarajućim informacijama.
    Nakon toga se za svaki proizvod iz korpe dodaju artikli prisutni u narudžbini, u tabelu NarudzbinaArtikal.

    """
    if request.method == 'POST':
        if request.POST.get('zahtev') is None:
            print("primljen ajax")
            korpa_data = request.POST.get('korpa')
            kupon = request.POST.get('kupon')
            adresa = request.POST.get('adresa')
            ukupno = 0
            p=0
            status = "primljeno"
            current_datetime = timezone.now()
            current_time = current_datetime.time()
            if request.user.is_authenticated:
                mail = request.user.email
                try:
                    idk = FizickoLice.objects.get(mail=mail).idk
                except:
                    pl=PravnoLice.objects.get(mail=mail)
                    idk=pl.idk
                    pib=pl.pib
                    p=1
            else:
                idk = Korisnik.objects.get(ime='gost', prezime='gostic', grad='nigde', zip='0', telefon='000000000')

            try:
                korpa_json = json.loads(korpa_data)
            except json.JSONDecodeError:
                return JsonResponse({'error': 'Invalid JSON data.'}, status=400)

            for item in korpa_json:
                sifra_artikla = item.get('sifraArtikla')
                kolicina_artikla = item.get('kolicinaArtikla')
                if(p==0):
                    ukupno = ukupno + float(Artikal.objects.get(sifraartikla=sifra_artikla).cena * kolicina_artikla)
                else:
                    ukupno = ukupno + float(Katalog.objects.get(sifraartikla=sifra_artikla,pib=pib).cena * kolicina_artikla)

                ukupno = round(ukupno, 2)

            nar = Narudzbina(idk=idk, status=status, ukupnacena=ukupno, adresa=adresa, datum=current_datetime,
                             vreme=current_time)
            nar.save()
            print(korpa_json)

            for item in korpa_json:
                sifra_artikla = item.get('sifraArtikla')
                kolicina_artikla = item.get('kolicinaArtikla')
                artikal = Artikal.objects.get(sifraartikla=sifra_artikla)
                print(" sifra " + str(artikal.sifraartikla) + "  " + str(kolicina_artikla))

                narA = NarudzbinaArtikal(
                    idnar=nar,
                    cena=artikal.cena * kolicina_artikla,
                    kolicina=kolicina_artikla,
                    sifraartikla=artikal
                )
                narA.save()

            print(ukupno)
            return JsonResponse({'message': 'Data received successfully.'})

    return render(request, 'uspesnaNarudzbina.html')


def izmeneArtikla(request):
    """
    Ovaj view omogućava izmene informacija o određenom artiklu u bazi podataka. Ukoliko je zahtev metod POST, izvlače se podaci o artiklu iz zahteva
    Buduci da se neki od podataka nalaze u tabeli recenzija, a neki u tabeli Artikal, view menja informacije u obe tabele
    """
    if request.method == 'POST':
        sifra = request.POST.get('sifra')
        opis = request.POST.get('opis')
        proiz = request.POST.get('proiz')
        gaz = request.POST.get('gaz')
        alk = request.POST.get('alk')
        zemlja = request.POST.get('zemlja')
        pova = request.POST.get('pova')
        cena = request.POST.get('cena')
        stanje = request.POST.get('stanje')
        if gaz == 'da' or gaz == 'Da' or gaz == 'DA':
            gaz = True
        else:
            gaz = False

        if pova == 'da' or pova == 'Da' or pova == 'DA':
            pova = True
        else:
            pova = False
        print(cena)
        # sifra = request.POST.get('slika')

        Rec = Recenzija.objects.get(sifraartikla=sifra)
        Rec.opis = opis
        Rec.proizvodjac = proiz
        Rec.gazirano = gaz
        Rec.procenatalkohola = alk
        Rec.povratnaambalaza = pova
        Rec.zemljaporekla = zemlja
        Rec.save()

        Art = Artikal.objects.get(sifraartikla=sifra)
        Art.stanje = stanje
        Art.cena = cena
        Art.save()

    return JsonResponse({'message': 'Podaci promenjeni'})


def oceni(request):
    """
    Ovaj view omogućava korisnicima da ocene određeni artikal. Ukoliko je zahtev metod POST, izvlače se podaci o šifri artikla i oceni iz zahteva.
    Zatim se proverava da li je korisnik autentifikovan i dodaje se nova ocena za odgovarajući artikal u bazi podataka
    Buduci da bi ocena u tabeli recenzija trebalo da predstavlja prosecnu ocenu, broj ocena koje je Artikal dobio se povecava i sracunava se nova prosecna ocena
    Vraca poruku o uspehu
    """
    if request.method == 'POST':
        sifra = request.POST.get('sifra')
        ocena = int(request.POST.get('ocena'))
        artikal = Artikal.objects.get(sifraartikla=sifra)

        try:
            if request.user.is_authenticated:

                user = request.user.username
                try:
                    lice = FizickoLice.objects.get(mail=user)
                    korisnik = Korisnik.objects.get(idk=lice.idk.idk)
                except FizickoLice.DoesNotExist:
                    lice = PravnoLice.objects.get(mail=user)
                    korisnik = Korisnik.objects.get(idk=lice.idk.idk)

                if Ocena.objects.filter(sifraartikla=artikal, idk=korisnik).exists():
                    return JsonResponse({'val': '3'})

                o = Ocena(idk=korisnik, sifraartikla=artikal, ocena=ocena)
                o.save()

                print(1, type(ocena))
                recenzija = Recenzija.objects.get(sifraartikla=sifra)
                brOc = recenzija.brojocena
                print(2, type(brOc))

                trenutna = recenzija.ocena * brOc
                print(3, type(trenutna))
                print(4, type((trenutna + ocena) / (brOc + 1)))
                recenzija.ocena = (trenutna + ocena) / (brOc + 1)
                print(5)

                recenzija.brojocena = brOc + 1
                recenzija.save()

                return JsonResponse({'val': '1'})
            else:
                return JsonResponse({'val': '2'})
        except Exception as e:
            print(str(e))
            return JsonResponse({'val': '-1', 'message': str(e)})
    else:
        return JsonResponse({'val': '1'}, status=400)


def klijenti(request):
    if request.method == "POST":
        print("Odobravam")
        mail = request.POST.get('adresa')
        lice = PravnoLice.objects.get(mail=mail)
        lice.odobren = 1
        lice.save()
        return JsonResponse({'val': '1'})

    sifra = request.GET.get('sifra')

    if sifra is None:
        proizvodi = json.dumps(
            [
                {
                    "idk": obj.idk.idk,
                    "pib": obj.pib,
                    "mail": obj.mail,
                    "lozinka": obj.lozinka,
                    "odobren": obj.odobren,
                }
                for obj in PravnoLice.objects.all()
            ])

        return render(request, 'klijenti.html', {"proizvodi": proizvodi})
    else:
        user = sifra
        try:
            lice = PravnoLice.objects.get(mail=user)
            korisnik = Korisnik.objects.get(idk=lice.idk.idk)
            korisnik_json = json.dumps({'idk': lice.idk.idk, 'mail': lice.mail, 'pib': lice.pib,
                                        'lozinka': lice.lozinka, 'odobren': lice.odobren,
                                        'ime': korisnik.ime, 'prezime': korisnik.prezime, 'telefon': korisnik.telefon,
                                        'grad': korisnik.grad, 'zip': korisnik.zip})
        except PravnoLice.DoesNotExist:
            return render(request, 'greska.html', )

        adrese = Adresa.objects.filter(idk=lice.idk).values('adresa')
        adrese_list = list(adrese)
        adrese_json = json.dumps(adrese_list)

        return render(request, 'pravnoLice.html', {'korisnik': korisnik_json, 'adrese': adrese_json})


def katalogPL(request):
    if request.method == 'POST':
        naziv = request.POST.get('zahtev')

        request.session['prosledjeno'] = naziv
        print(request.session['prosledjeno'])
        redirect_url = reverse('katalogS')
        return JsonResponse({'redirect': redirect_url})

    json_data = json.dumps({"src": request.session.get('prosledjeno')})
    print(request.session.get('prosledjeno'))
    if json_data is not None:
        print('prazan')
    else:
        json_data = json.dumps({"src": ""})

    pib=request.GET.get('sifra')
    artikli = Artikal.objects.all()
    artikli_json = json.dumps(list(artikli.values()))
    liceArtikli=Katalog.objects.filter(pib=pib).values_list('pib','sifraartikla_id','cena')
    liceArtikli_json = json.dumps(list(liceArtikli.values()))
    print(liceArtikli_json)
    popust = PopustArtikal.objects.all()
    popust_json = json.dumps([{"sifraartikla": pa.sifraartikla.sifraartikla, "popust": pa.popust} for pa in popust])

    p = 0
    popustP = PopustPib.objects.all()
    if request.user.is_authenticated:
        if request.user.is_authenticated:
            mail = request.user.username
            try:
                lice = PravnoLice.objects.get(mail=mail)
                pib = lice.pib
                popustP = PopustPib.objects.get(pib=pib)
                p = 1

            except PravnoLice.DoesNotExist:
                p = 0

    popustP_json = json.dumps([{"sifraartikla": pa.sifraartikla.sifraartikla, "popust": pa.popust} for pa in popustP])

    return render(request, 'katalogPL.html',
                  {'artikli': artikli_json,'liceArtikli':liceArtikli_json, 'popust': popust_json, 'firma': p, 'popustP': popustP_json,
                   'prosledjeno': json_data,'pib':pib})


def katalogPLS(request):
    if request.method == 'POST':
        ubaci=request.POST.get('ubaci')
        print(ubaci)
        if ubaci=='1':
            print('uso')
            pib=request.POST.get('pib')
            id=request.POST.get('sifra')
            cena=request.POST.get('cena')
            kat=Katalog(pib=pib,sifraartikla_id=id,cena=cena)
            kat.save()
            return JsonResponse({'val': '1'})
        else:
            print('wtf')
            pib = request.POST.get('pib')
            id=request.POST.get('sifra')
            kat=Katalog.objects.get(pib=pib,sifraartikla_id=id)
            kat.delete()
            return JsonResponse({'val': '0'})

