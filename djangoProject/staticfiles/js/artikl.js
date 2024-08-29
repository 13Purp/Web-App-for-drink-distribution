function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

var cenaArtikla;
var ocena = 0;
$(document).ready(function () {

    //proverava da li je logovan da bi stavio logout umesto login
    var logovanData = sessionStorage.getItem('logovan');
    if (logovanData) {

        document.getElementById("logOut").hidden = false;
        document.getElementById("logIn").hidden = true;


        console.log('Logovan:', logovanData);
    }


    $('form').on('submit', function (event) {
        event.preventDefault();
    });
    $("#pretraga").click(function (e) {
        var naziv = $("#nazivPretrage").val()
        localStorage.setItem('Prosledjeno', naziv);
        const csrftoken = getCookie('csrftoken');
        var dataToSend = {
            zahtev: naziv
        };

        $.ajax({
            url: '/katalogS/',
            type: 'POST',
            data: dataToSend,
            beforeSend: function (xhr, settings) {
                xhr.setRequestHeader('X-CSRFToken', csrftoken);
            },
            success: function (response) {

                window.location.href = response.redirect;

            },
            error: function (xhr, status, error) {
                console.error('Error:', error);
                // Handle error response
                alert("Ne valja")
            }
        });

    });

    //logout
    $("#logOut").click(function (e) {
        const csrftoken = getCookie('csrftoken');
        var dataToSend = {
            zahtev: 0
        };

        $.ajax({
            url: '/loginS/',
            type: 'POST',
            data: dataToSend,
            beforeSend: function (xhr, settings) {
                xhr.setRequestHeader('X-CSRFToken', csrftoken);
            },
            success: function (response) {

                sessionStorage.clear();
                localStorage.clear();
                window.location.href = response.redirect;

            },
            error: function (xhr, status, error) {
                console.error('Error:', error);
                // Handle error response
                alert("Ne valja")
            }
        });

    });

    $("#dodajKorpa").click(function (e) {
        e.preventDefault();
        var kolicinaElement = document.getElementById("kolicina");
        var kolicina;
        if (kolicinaElement) {
            if (kolicinaElement.value == '') {

                kolicina = 1;
            } else if (!isNaN(kolicinaElement.value)) {

                kolicina = parseInt(kolicinaElement.value);
            } else {

                kolicina = -1;
            }
        } else {

            kolicina = 1;
        }

        if (kolicina != -1) {
            var korpa = [];
            var probaj = localStorage.getItem("korpa");
            if (probaj != null) korpa = JSON.parse(probaj);
            var indeks = korpa.findIndex(function (item) {
                return item.sifraArtikla == artikal.sifra;
            });

            if (indeks == -1) {
                var nov = {sifraArtikla: artikal.sifra, kolicinaArtikla: kolicina, cena: cenaArtikla};
                korpa.push(nov);
            } else {
                korpa[indeks].kolicinaArtikla += kolicina;
                korpa[indeks].cena = cenaArtikla;
            }
            localStorage.setItem("korpa", JSON.stringify(korpa));

            document.getElementById("kolicina").value = 'DODATO U KORPU';
            document.getElementById("kolicina").style.color = "red"

            setTimeout(function () {
                document.getElementById("kolicina").value = '';
                document.getElementById("kolicina").placeholder = "Količina";
                document.getElementById("kolicina").style.color = "black";
            }, 2000);
        } else {
            document.getElementById("kolicina").value = '';
            document.getElementById("kolicina").placeholder = "Unesi kolicinu kao broj!";
            setTimeout(function () {
                document.getElementById("kolicina").placeholder = "Količina";
            }, 3000);
        }
    });
    $("#kontaktiraj").click(function (e) {
        e.preventDefault();
        const csrftoken = getCookie('csrftoken');
        //dodaj kako se kontaktira
        if (anoniman == 1) {
            document.getElementById("spec1").hidden = false;
            setTimeout(function () {
                document.getElementById("spec1").hidden = true;
            }, 3000);
        } else {
            $.ajax({
                url: '/naruciSpec/',
                type: 'POST',
                data: {
                    'sifra': artikal.sifra
                },
                headers: {
                    'X-CSRFToken': csrftoken
                },
                success: function (response) {
                    if (response.val === '1') {
                        document.getElementById("spec2").hidden = false;
                        setTimeout(function () {
                            document.getElementById("spec2").hidden = true;
                        }, 3000);
                    } else if (response.val === '-2') {

                    }
                },
                error: function (xhr, status, error) {
                    alert("GRESKA");
                }
            });

        }
    })
    $("#dodajKomentar").click(function (e) {
        e.preventDefault();
        var kom = document.getElementById("textKomentar").value;
        const csrftoken = getCookie('csrftoken');
        if (kom != '') {
            $.ajax({
                url: '/dodajKomentar/',
                type: 'POST',
                data: {
                    'komentar': kom,
                    'sifra': artikal.sifra
                },
                headers: {
                    'X-CSRFToken': csrftoken
                },
                success: function (response) {
                    if (response.val === '1') {
                        location.reload();
                    } else if (response.val === '-2') {
                        document.getElementById("anoniman").hidden = false;
                        setTimeout(function () {
                            document.getElementById("anoniman").hidden = true;
                        }, 3000);
                    }
                },
                error: function (xhr, status, error) {
                    alert("GRESKA");
                }
            });
        } else {
            document.getElementById("nijePopunjeno").hidden = false;
            setTimeout(function () {
                document.getElementById("nijePopunjeno").hidden = true;
            }, 3000);
        }

    })

    $("#z1").click(function () {
        this.style.backgroundColor = "lightyellow";
        ocena = 1;
        document.getElementById("z2").style.backgroundColor = "white";
        document.getElementById("z3").style.backgroundColor = "white";
        document.getElementById("z4").style.backgroundColor = "white";
        document.getElementById("z5").style.backgroundColor = "white";
    });
    $("#z2").click(function () {
        this.style.backgroundColor = "lightyellow";
        ocena = 2;
        document.getElementById("z1").style.backgroundColor = "white";
        document.getElementById("z3").style.backgroundColor = "white";
        document.getElementById("z4").style.backgroundColor = "white";
        document.getElementById("z5").style.backgroundColor = "white";
    });
    $("#z3").click(function () {
        this.style.backgroundColor = "lightyellow";
        ocena = 3;
        document.getElementById("z2").style.backgroundColor = "white";
        document.getElementById("z1").style.backgroundColor = "white";
        document.getElementById("z4").style.backgroundColor = "white";
        document.getElementById("z5").style.backgroundColor = "white";
    });
    $("#z4").click(function () {
        this.style.backgroundColor = "lightyellow";
        ocena = 4;
        document.getElementById("z2").style.backgroundColor = "white";
        document.getElementById("z3").style.backgroundColor = "white";
        document.getElementById("z1").style.backgroundColor = "white";
        document.getElementById("z5").style.backgroundColor = "white";
    });
    $("#z5").click(function () {
        this.style.backgroundColor = "lightyellow";
        ocena = 5;
        document.getElementById("z2").style.backgroundColor = "white";
        document.getElementById("z3").style.backgroundColor = "white";
        document.getElementById("z4").style.backgroundColor = "white";
        document.getElementById("z1").style.backgroundColor = "white";
    });

    $("#oceni").click(function () {
        if (ocena == 0) {
            document.getElementById("greskaOcena").hidden = false;
        } else {
            var dataToSend = {
                'sifra': artikal.sifra,
                'ocena': ocena
            }; // Data to send
            console.log(dataToSend);
            const csrftoken = getCookie('csrftoken');
            $.ajax({
                url: '/oceni/',
                type: 'POST',
                data: {
                    'sifra': artikal.sifra,
                    'ocena': ocena
                },
                headers: {
                    'X-CSRFToken': csrftoken
                },
                success: function (response) {
                    if (response.val == '1') {
                        document.getElementById("uspesno").hidden = false;
                        location.reload();

                    } else if (response.val == '2') {
                        document.getElementById("nijeUlogovan").hidden = true;
                    } else if (response.val == '3') {
                        document.getElementById("greskaOcena").hidden = false;
                    }
                },
                error: function (xhr, status, error) {
                    alert("GRESKA");
                }
            });


        }
    })

});

function inicijalizuj() {
    document.getElementById("greskaOcena").hidden = true;
    document.getElementById("uspesno").hidden = true;

    document.getElementById("slika").src = "../static/slike/" + artikal.naziv + ".jpg";
    if (artikal.specijalan != '1') {
        document.getElementById("kontaktiraj").hidden = true;
        document.getElementById("kolicina").hidden = false;
        document.getElementById("dodajKorpa").hidden = false;

    } else {
        document.getElementById("kontaktiraj").hidden = false;
        document.getElementById("kolicina").hidden = true;
        document.getElementById("dodajKorpa").hidden = true;
    }

    var ime = document.getElementById("naziv");
    ime.innerText = artikal.naziv;
    ime.style.fontSize = "190%";
    ime.style.color = "#C20407";
    ime.style.fontWeight = "600";

    var price = artikal.cena;
    var popustProcenat = 0;
    if (admin == 0) {
        ;
        if (firma != 1) {


            for (var j = 0; j < popust.length; j++) {

                if (popust[j].sifraartikla == artikal.sifra) {

                    popustProcenat = popust[j].popust;
                    break;
                }
            }
        } else {
            for (var j = 0; j < popustP.length; j++) {


                if (popustP[j].sifraartikla == artikal.sifra) {

                    popustProcenat = popustP[j].popust;
                    break;
                }
            }
        }
        price = artikal.cena * (1 - popustProcenat / 100);
    }

    var cena = document.getElementById("cena");
    price = price * (100 + artikal.pdv) / 100;
    cena.innerText = price.toFixed(2) + "din/" + artikal.mera;
    cenaArtikla = price;


    document.getElementById("proizvodjac").innerText = recenzija.proizvodjac;
    document.getElementById("gazirano").innerText = recenzija.gazirano == '0' ? "Ne" : "Da";
    document.getElementById("alkohol").innerText = recenzija.procenatAlkohola;
    document.getElementById("zemljaPorekla").innerText = recenzija.zemljaPorekla;
    document.getElementById("povratnaAmbalaza").innerText = recenzija.povratnaAmbalaza == '0' ? "Ne" : "Da";
    document.getElementById("opis").innerText = recenzija.opis;

    if (1 <= recenzija.ocena && recenzija.ocena < 2) {
        document.getElementById("zvezda1").style.stroke = "red";
    } else if (2 <= recenzija.ocena && recenzija.ocena < 3) {
        document.getElementById("zvezda1").style.stroke = "red";
        document.getElementById("zvezda2").style.stroke = "red";
    } else if (3 <= recenzija.ocena && recenzija.ocena < 4) {
        document.getElementById("zvezda1").style.stroke = "red";
        document.getElementById("zvezda2").style.stroke = "red";
        document.getElementById("zvezda3").style.stroke = "red";
    } else if (4 <= recenzija.ocena && recenzija.ocena < 5) {
        document.getElementById("zvezda1").style.stroke = "red";
        document.getElementById("zvezda2").style.stroke = "red";
        document.getElementById("zvezda3").style.stroke = "red";
        document.getElementById("zvezda4").style.stroke = "red";
    } else if (recenzija.ocena >= 5) {
        document.getElementById("zvezda1").style.stroke = "red";
        document.getElementById("zvezda2").style.stroke = "red";
        document.getElementById("zvezda3").style.stroke = "red";
        document.getElementById("zvezda4").style.stroke = "red";
        document.getElementById("zvezda5").style.stroke = "red";
    }

    var sekcija = document.getElementById("komentari");
    komentari.forEach(function (komentar) {
        var container = document.createElement("div");
        container.style.display = "flex";
        container.style.alignItems = "center";
        container.style.width = "100%";
        container.style.marginBottom = "10px";

        var textarea = document.createElement("textarea");
        textarea.setAttribute("readonly", true);
        textarea.setAttribute("rows", 3);
        textarea.style.textAlign = "start";
        textarea.style.resize = "none";
        textarea.style.flex = "1";
        textarea.style.paddingRight = "10px";
        textarea.style.marginRight = "10px";
        textarea.classList.add("form-control");

        // Postavljamo sadržaj textarea elementa
        textarea.textContent = komentar.ime + ": " + komentar.komentar;

        /*var clearBtn = document.createElement("button");
        clearBtn.textContent = "X";
        clearBtn.style.backgroundColor = "red";
        clearBtn.style.color = "white";
        clearBtn.style.border = "none";
        clearBtn.style.cursor = "pointer";
        clearBtn.style.padding = "5px 10px";
        clearBtn.style.borderRadius = "5px";
        clearBtn.style.fontSize = "14px";
        clearBtn.style.marginLeft = "10px";

        clearBtn.onmouseover = function() {
            clearBtn.style.backgroundColor = "darkred";
        };

        clearBtn.onmouseout = function() {
            clearBtn.style.backgroundColor = "red";
        };
       clearBtn.dataset.komentar = komentar.komentar;
        clearBtn.dataset.sifra = artikal.sifra;
        clearBtn.dataset.idk = komentar.idk;

        // Postavljanje funkcije klikanja na dugme "X"
       clearBtn.onclick = function() {
            var komentarData = this.dataset.komentar;
            var sifraData = this.dataset.sifra;
            var idkData = this.dataset.idk;
             const csrftoken = getCookie('csrftoken');
            // AJAX zahtev sa podacima iz dugmeta "X"
            $.ajax({
                url: '/izbrisiKomentar/',
                type: 'POST',
                data: {
                    'komentar': komentarData,
                    'sifra': sifraData,
                    'idk': idkData
                },
                headers: {
                    'X-CSRFToken': csrftoken
                },
                success: function(response) {
                    if (response.val === '1') {
                        location.reload();
                    } else {
                        alert("Nije obrisan");
                    }
                },
                error: function(xhr, status, error) {
                    alert("GRESKA");
                }
            });
    };


        //dodaj da nije kad je admin ulogovan
            if(admin==1){
                 clearBtn.hidden=false;
            }
            else{
                 clearBtn.hidden=true;
            }*/

        container.appendChild(textarea);
        // container.appendChild(clearBtn);
        sekcija.appendChild(container);
    });
    if (anoniman == '1') {
        document.getElementById("textKomentar").disabled = true;
        document.getElementById("dodajKomentar").disabled = true;
        document.getElementById("anoniman").hidden = false;
    } else {
        document.getElementById("textKomentar").disabled = false;
        document.getElementById("dodajKomentar").disabled = false;
        document.getElementById("anoniman").hidden = true;
    }


}

