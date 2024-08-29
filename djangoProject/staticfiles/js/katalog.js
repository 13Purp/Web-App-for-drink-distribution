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
    if (prosledjeno.src !== "" && prosledjeno.src != null) {
        var red1 = document.getElementById("lista");
        red1.innerHTML = '';
        var artikli21 = artikli.slice();

        console.log(prosledjeno.src + " je prosledjeno")
        artikli21 = artikli21.filter(function (artikal) {
            // Filtriraj tako da pronađeš naziv u artikal.naziv
            return artikal.naziv.toLowerCase().includes(localStorage.getItem('Prosledjeno').toLowerCase());
        });
        prosledjeno.src = "";
        console.log(artikli21);
        postavi(red1, artikli21);
    } else {
        inicijalizuj();
    }

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
                alert("Ne valja")
            }
        });

    });

    $("#pretraga").click(function (e) {
        e.preventDefault();
        let naziv = "";
        if (prosledjeno.src === "" || prosledjeno.src == null) {
            naziv = $("#nazivPretrage").val();
        } else
            naziv = prosledjeno.src;
        console.log("Naziv pretrage: " + naziv);

        var red = document.getElementById("lista");
        red.innerHTML = '';
        var artikli2 = artikli.slice();

        if (naziv) {
            artikli2 = artikli2.filter(function (artikal) {

                return artikal.naziv.toLowerCase().includes(naziv.toLowerCase());
            });
        }

        postavi(red, artikli2);
    });
    $("#voda").click(function () {
        var red = document.getElementById("lista");
        red.innerHTML = '';
        var artikli2 = artikli.slice();
        artikli2 = artikli2.filter(function (artikal) {
            return artikal.tip === 'voda';

        });
        postavi(red, artikli2);

    });
    $("#sok").click(function () {
        var red = document.getElementById("lista");
        red.innerHTML = '';
        var artikli2 = artikli.slice();
        artikli2 = artikli2.filter(function (artikal) {
            return artikal.tip === 'sok';
        });
        postavi(red, artikli2);

    });
    $("#gazirano").click(function () {

        var red = document.getElementById("lista");
        red.innerHTML = '';
        var artikli2 = artikli.slice();

        artikli2 = artikli2.filter(function (artikal) {

            return artikal.gazirano == true || artikal.gazirano == "true";
        });
        postavi(red, artikli2);
    });
    $("#alkohol").click(function () {

        var red = document.getElementById("lista");
        red.innerHTML = '';
        var artikli2 = artikli.slice();
        artikli2 = artikli2.filter(function (artikal) {
            return artikal.sadrzialkohol == true;
        });
        postavi(red, artikli2);

    });
    $("#uvoz").click(function () {
        var red = document.getElementById("lista");
        red.innerHTML = '';
        var artikli2 = artikli.slice();
        artikli2 = artikli2.filter(function (artikal) {
            return artikal.uvoz == true;
        });
        postavi(red, artikli2);

    });
    $("#domaci").click(function () {
        var red = document.getElementById("lista");
        red.innerHTML = '';
        var artikli2 = artikli.slice();
        artikli2 = artikli2.filter(function (artikal) {
            return artikal.uvoz == false;
        });
        postavi(red, artikli2);

    });
    $("#CR").click(function () {

        var red = document.getElementById("lista");
        red.innerHTML = '';
        var artikli2 = artikli.slice();
        artikli2.sort(function (a, b) {
            return a.cena - b.cena
        })
        postavi(red, artikli2);
    });
    $("#CO").click(function () {
        var red = document.getElementById("lista");
        red.innerHTML = '';
        var artikli2 = artikli.slice();
        artikli2.sort(function (a, b) {
            return b.cena - a.cena
        })
        postavi(red, artikli2);

    });
    $("#NR").click(function () {
        var red = document.getElementById("lista");
        red.innerHTML = '';
        var artikli2 = artikli.slice();
        artikli2.sort(function (a, b) {
            return a.naziv.localeCompare(b.naziv);
        });
        postavi(red, artikli2);
    });
    $("#NO").click(function () {
        var red = document.getElementById("lista");
        red.innerHTML = '';
        var artikli2 = artikli.slice();
        artikli2.sort(function (a, b) {
            return b.naziv.localeCompare(a.naziv);
        });
        postavi(red, artikli2);
    });

});

function inicijalizuj() {
    var red = document.getElementById("lista");
    var artikli2 = artikli.slice();
    postavi(red, artikli2);

}

function dodajKorpa(sifra, c, naziv) {

    var kolicinaElement = document.getElementById("kolicina" + sifra);
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
            return item.sifraArtikla == sifra;
        });

        if (indeks == -1) {
            var nov = {sifraArtikla: sifra, kolicinaArtikla: kolicina, cena: c, naziv: naziv};
            korpa.push(nov);
        } else {
            korpa[indeks].kolicinaArtikla += kolicina;
            korpa[indeks].cena = c;
        }
        localStorage.setItem("korpa", JSON.stringify(korpa));
        document.getElementById("kolicina" + sifra).value = 'DODATO U KORPU';
        document.getElementById("kolicina" + sifra).style.color = "red";
        setTimeout(function () {
            document.getElementById("kolicina" + sifra).value = '';
            document.getElementById("kolicina" + sifra).style.color = "black";
            document.getElementById("kolicina" + sifra).placeholder = "Količina";
        }, 2000);
    } else {
        document.getElementById("kolicina" + sifra).value = '';
        document.getElementById("kolicina" + sifra).placeholder = "Unesi kolicinu kao broj!";
        setTimeout(function () {
            document.getElementById("kolicina" + sifra).placeholder = "Količina";
        }, 3000);
    }

}

function postavi(red, niz) {

    for (var i = 0; i < niz.length; i++) {
        var artikal = niz[i];
        console.log("red");
        console.log(red);
        console.log("artikal");
        console.log(artikal);


        var divElement = document.createElement('div');
        divElement.className = "card-container col-md-6 pr-0 col-lg-3 col-sm-12";
        divElement.style.width = "20rem";
        divElement.style.height = "100%";


        var cardElement = document.createElement('div');
        cardElement.className = "card mx-3 my-4 shadow";


        var imgElement = document.createElement('img');
        imgElement.className = "card-img-top";
        imgElement.src = "../static/slike/" + artikal.naziv + ".jpg";
        imgElement.alt = "...";
        imgElement.width="225";
        imgElement.height="225";
        imgElement.addEventListener('click', (function (sifra) {
            return function () {
                window.location.href = "/artikalS/?sifra=" + encodeURIComponent(sifra);
                return false;
            };
        })(artikal.sifraartikla));


        var cardBodyElement = document.createElement('div');
        cardBodyElement.className = "card-body";


        var naslovElement = document.createElement('h5');
        naslovElement.className = "card-title text-center";
        naslovElement.textContent = artikal.naziv;


        var cenaElement = document.createElement('div'); // Promenio sam na 'div' za bolju strukturu
        cenaElement.className = "card-text text-center";

        var cena1 = document.createElement('p');
        cena1.style.fontSize = "large";
        cena1.style.fontWeight = "bold";
        cena1.style.color = "#c20407";
        cena1.textContent = (artikal.cena * (100 + artikal.pdv) / 100).toFixed(2) + ' din/' + artikal.mera;
        var price = artikal.cena;
        var cena2 = document.createElement('p');
        var popustProcenat = 0; // Default popust je 0%


        if (firma != '1') {
            for (var j = 0; j < popust.length; j++) {

                if (popust[j].sifraartikla == artikal.sifraartikla) {

                    popustProcenat = popust[j].popust;
                    break;
                }
            }
        } else {
            for (var j = 0; j < popustP.length; j++) {

                if (popustP[j].sifraartikla == artikal.sifraartikla) {

                    popustProcenat = popustP[j].popust;
                    break;
                }
            }
        }
        var p = document.createElement('p');
        p.style.height = "2.78vh"

        if (popustProcenat > 0) {
            var cenaSaPopustom = artikal.cena * (1 - popustProcenat / 100) * (100 + artikal.pdv) / 100;
            price = artikal.cena * (1 - popustProcenat / 100) * (100 + artikal.pdv) / 100;
            cena2.style.fontSize = "larger";
            cena2.style.fontWeight = "bold";
            cena2.style.color = "#C20407";
            cena2.textContent = cenaSaPopustom.toFixed(2) + ' din/' + artikal.mera;


            cenaElement.appendChild(cena1);
            cena1.style.fontSize = "small";
            cena1.style.textDecoration = "line-through";
            cena1.style.color = "black";
            cenaElement.appendChild(cena2);
        } else {

            cenaElement.appendChild(p);
            cenaElement.appendChild(cena1);
            cenaElement.style.height = "100%";
        }

        var buttonElement = document.createElement('button');
        buttonElement.style.backgroundColor = "#C20407";
        buttonElement.id = artikal.sifraartikla;
        buttonElement.className = "zaKorpu";
        buttonElement.style.borderColor = "red";
        let naziv = artikal.naziv;

        if (artikal.specijalan == false || artikal.specijalan == null) {
            buttonElement.addEventListener('click', (function (sifra, cena) {
                return function () {
                    dodajKorpa(sifra, cena, naziv);
                    return false;
                };
            })(artikal.sifraartikla, price));
        } else {
            buttonElement.addEventListener('click', (function (sifra) {
                return function () {
                    document.getElementById("kolicina" + sifra).value = '';
                    window.location.href = "/artikalS/?sifra=" + encodeURIComponent(sifra);

                };
            })(artikal.sifraartikla));
        }

        var imgButtonElement = document.createElement('img');
        imgButtonElement.src = "../static/slike/belaKolicaTake2.png";
        imgButtonElement.alt = "Slika";
        imgButtonElement.style.minHeight = "auto";
        imgButtonElement.style.width = "25%";
        imgButtonElement.style.height = "50%";


        var inputElement = document.createElement('input');
        inputElement.className = "form-control p-2";
        inputElement.type = "text";
        inputElement.placeholder = "Količina";
        inputElement.style.width = "100%";
        inputElement.style.height = "max-content";
        inputElement.style.marginTop = "3%";
        inputElement.id = "kolicina" + artikal.sifraartikla;


        buttonElement.appendChild(imgButtonElement);
        cardBodyElement.appendChild(naslovElement);
        cardBodyElement.appendChild(cenaElement);
        cardBodyElement.appendChild(buttonElement);
        cardBodyElement.appendChild(inputElement);
        cardElement.appendChild(imgElement);
        cardElement.appendChild(cardBodyElement);
        divElement.appendChild(cardElement);
        red.appendChild(divElement);
    }
}