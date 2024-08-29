//Nikolina Grbović 0315/21
//Iva Paunovic 0580/21
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
    document.getElementById("heder").textContent= 'PIB: '+pib;
    if (logovanData) {

        document.getElementById("logOut").hidden = false;
        document.getElementById("logIn").hidden = true;


        console.log('Logovan:', logovanData);
    }

    $('form').on('submit', function (event) {
        event.preventDefault();
    });

    inicijalizuj();


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

function dodajKorpa(sifra, c, naziv,ubaci) {

    var kolicinaElement = document.getElementById("kolicina" + sifra);
    var kolicina;
    var cena=kolicinaElement.value;
    console.log(ubaci+'--ubaci');
    console.log(cena);
    if((isNaN(cena) || cena==="") && ubaci!=0)
    {
        console.log("Klik");
        document.getElementById("kolicina" + sifra).placeholder="Prvo unesite cenu";
    }
    else {
        //
        // ovde ajax
        var dataToSend = {
            pib: pib,
            sifra: sifra,
            cena: cena,
            ubaci:ubaci
        };
        const csrftoken = getCookie('csrftoken');


        $.ajax({
            url: '/katalogPLS/',
            type: 'POST',
            data: dataToSend,
            beforeSend: function (xhr, settings) {
                xhr.setRequestHeader('X-CSRFToken', csrftoken);
            },
            success: function (response) {

                if(response.val=='1') {
                    document.getElementById(sifra).style.backgroundColor = "#C20407";
                    document.getElementById(sifra).style.borderColor = "red";
                    document.getElementById('slika' + sifra).classList.remove('gray');
                }
                else
                {
                    document.getElementById(sifra).style.backgroundColor = "gray";
                    document.getElementById(sifra).style.borderColor = "dimgray";
                    document.getElementById('slika' + sifra).classList.add('gray');
                    document.getElementById("kolicina" + sifra).value="";

                }

            },
            error: function (xhr, status, error) {
                console.error('Error:', error);
                alert("Greska")
            }
        });
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
        imgElement.classList.add('mt-2');
        imgElement.src = "../static/slike/" + artikal.naziv + ".jpg";
        imgElement.alt = "...";
        imgElement.width = "225";
        imgElement.height = "225";
        imgElement.id='slika'+artikal.sifraartikla;
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


        var cenaElement = document.createElement('div');
        cenaElement.className = "card-text text-center";

        var cena1 = document.createElement('p');
        cena1.style.fontSize = "large";
        cena1.style.fontWeight = "bold";
        cena1.style.color = "#c20407";
        cena1.textContent = (artikal.cena ).toFixed(2) + ' din' ;
        var price = artikal.cena;
        var cena2 = document.createElement('p');
        var popustProcenat = 0; // Default popust je 0%
        var stdcn = document.createElement('p');
        stdcn.style.color = "#2b2b2b"
        stdcn.style.fontWeight = "bold";
        stdcn.textContent = 'standardna cena:';


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


        cenaElement.appendChild(stdcn);
        cenaElement.appendChild(cena1);
        cenaElement.style.height = "100%";
        console.log(liceArtikli);
        var ima = 0;
        var liceCena=0;
        for (var j = 0; j < liceArtikli.length; j++) {
            console.log(artikal.sifraartikla+'=='+liceArtikli[j].sifra);
            if (artikal.sifraartikla == liceArtikli[j].sifraartikla_id) {
                ima = 1;
                liceCena=liceArtikli[j].cena;
            }
        }
        if(ima!=1)
            imgElement.classList.add('gray');


        var buttonElement = document.createElement('button');
        if (ima == 1) {
            buttonElement.style.backgroundColor = "#C20407";
            buttonElement.style.borderColor = "red";
        } else {

        buttonElement.style.backgroundColor = "gray";
        buttonElement.style.borderColor = "red";

    }

        buttonElement.id = artikal.sifraartikla;
        buttonElement.className = "zaKorpu";
        buttonElement.classList.add('m-3');
        buttonElement.classList.add('mb-1');
        let naziv = artikal.naziv;





        buttonElement.addEventListener('click', (function (sifra, cena) {
            return function () {
                dodajKorpa(sifra, cena, naziv,1);
                return false;
            };
        })(artikal.sifraartikla, price));


        var buttonElement2 = document.createElement('button');
        if (ima == 1) {
            buttonElement2.style.backgroundColor = "#C20407";
            buttonElement2.style.borderColor = "red";
        } else {

        buttonElement2.style.backgroundColor = "gray";
        buttonElement2.style.borderColor = "dimgray";

    }

        buttonElement2.id = artikal.sifraartikla+'b';
        buttonElement2.className = "zaKorpu";
        buttonElement2.classList.add('m-3');
        buttonElement2.classList.add('mt-1');





        buttonElement2.addEventListener('click', (function (sifra, cena) {
            return function () {
                dodajKorpa(sifra, cena, naziv,0);
                return false;
            };
        })(artikal.sifraartikla, price));





        var imgButtonElement = document.createElement('img');
        imgButtonElement.src = "../static/slike/stiklica.png";
        imgButtonElement.alt = "Slika";
        imgButtonElement.style.minHeight = "auto";
        imgButtonElement.style.width = "25%";
        imgButtonElement.style.height = "50%";

        var imgButtonElement2 = document.createElement('img');
        imgButtonElement2.src = "../static/slike/iksic.png";
        imgButtonElement2.alt = "Slika";
        imgButtonElement2.style.minHeight = "auto";
        imgButtonElement2.style.width = "12.5%";
        imgButtonElement2.style.height = "25%";



        var inputElement = document.createElement('input');
        inputElement.className = "form-control p-2";
        inputElement.type = "text";
        if(ima==1) {
            inputElement.textContent = (liceCena ).toFixed(2);
            inputElement.value = (liceCena ).toFixed(2);
        }
        else
        {
            inputElement.placeholder="Nije obuhvacen";
        }

        inputElement.style.width = "100%";
        inputElement.style.height = "max-content";
        inputElement.style.marginTop = "3%";
        inputElement.id = "kolicina" + artikal.sifraartikla;


        buttonElement.appendChild(imgButtonElement);
        buttonElement2.appendChild(imgButtonElement2);
        cardBodyElement.appendChild(naslovElement);
        cardBodyElement.appendChild(cenaElement);
        cardBodyElement.appendChild(inputElement);
        cardBodyElement.appendChild(buttonElement);
        cardBodyElement.appendChild(buttonElement2);
        cardElement.appendChild(imgElement);
        cardElement.appendChild(cardBodyElement);
        divElement.appendChild(cardElement);
        red.appendChild(divElement);
    }
}