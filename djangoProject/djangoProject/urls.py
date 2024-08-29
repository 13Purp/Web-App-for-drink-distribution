"""
URL configuration for djangoProject project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.conf.urls.static import static
from aplikacija import views

urlpatterns = [
    #path('',include('djangoProject.urls')),
    path('loginS/', views.loginS, name='loginS'),
    path('loginR/', views.loginR, name='loginR'),
    path('uspesnoLogovanje/', views.uspesnoLogovanje, name='uspesnoLogovanje'),
    path('registracijaS/',views.registracijaS,name='registracijaS'),
    path('registracijaR/',views.registracijaR,name='registracijaR'),
    path('nalogS/', views.nalogS, name='nalogS'),
    path('dodajAdresu/', views.dodajAdresu, name='dodajAdresu'),
    path('izbrisiAdresu/', views.izbrisiAdresu, name='izbrisiAdresu'),
    path('zavrsiIzmene/',views.zavrsiIzmene, name='zavrsiIzmene'),
    path('korpaS/',views.korpaS,name='korpaS'),
    path('katalogS/', views.katalogS,name='katalogS'),
    path('katalogPL/', views.katalogPL,name='katalogPL'),
    path('katalogPLS/', views.katalogPLS,name='katalogPLS'),
    path('indexS/', views.indexS, name='indexS'),
    path('katalogPretraga/',views.katalogPretraga,name='katalogPretraga'),
    path('zabLozinkaS/',views.zabLozinkaS,name='zabLozinkaS'),
    path('posaljiMail/',views.posaljiMail,name='posaljiMail'),
    path('finalizacijaGostS/',views.finalizacijaGostS,name='finalizacijaGostS'),
    path('finalizacijaKorisnikS/', views.finalizacijaKorisnikS, name='finalizacijaKorisnikS'),
    path('artikalS/',views.artikalS,name='artikalS'),
    path('dodavanjeProizvoda/', views.dodavanjeProizvoda, name='dodavanjeProizvoda'),
    path('klijenti/', views.klijenti, name='klijenti'),
    path('dodajKomentar/',views.dodajKomentar,name='dodajKomentar'),
    path('naruciSpec/',views.naruciSpec,name='naruciSpec'),
    path('adminStranica/',views.adminStranica,name='adminStranica'),
    path('finalizacija/',views.finalizacija,name='finalizacija'),
    path('uspesnaNarudzbina/',views.uspesnaNarudzbina,name='uspesnaNarudzbina'),
    path('izmeneArtikla/',views.izmeneArtikla,name='izmeneArtikla'),
    path('', views.indexS, name='indexS'),
    path('oceni/',views.oceni, name='oceni'),
    path('izbrisiKomentar/',views.izbrisiKomentar,name='izbrisiKomentar'),
    path('admin/doc/', include('django.contrib.admindocs.urls')),
    path('admin/', admin.site.urls),
]
