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

    $("#zavrsi").click(function (e) {

        var proiz = $("#proizvodjac").val();
        var gaz = $("#gazirano").val();
        var alk = $("#alkohol").val();
        var zemlja = $("#zemlja").val();
        var pova = $("#povratnaAmbalaza").val();
        var stanje = $("#unosStanja").val();
        var opis = $("#opis").val();
        var cena = $("#unosCene").val();
        var sifra = artikal.sifra;
        var naziv = artikal.naziv;



        const csrftoken = getCookie('csrftoken');
        var dataToSend = {
            sifra: sifra,
            opis: opis,
            proiz: proiz,
            gaz: gaz,
            alk: alk,
            zemlja: zemlja,
            pova: pova,
            cena: cena,
            stanje: stanje

        };

        $.ajax({
            url: '/izmeneArtikla/',
            type: 'POST',
            data: dataToSend,
            beforeSend: function (xhr, settings) {
                xhr.setRequestHeader('X-CSRFToken', csrftoken);
            },
            success: function (response) {

                alert("uspesna izmena")

            },
            error: function (xhr, status, error) {
                console.error('Error:', error);
                // Handle error response
                alert("Ne valja")
            }
        });
        var imageFile = $('#formFile').prop('files')[0];
        var formData = new FormData();
        formData.append("slika", imageFile);
        formData.append("upload", 1);
        formData.append("naziv", naziv);
        $.ajax({
            url: '/dodavanjeProizvoda/',
            type: 'POST',
            data: formData,
            contentType: false,
            processData: false,
            beforeSend: function (xhr, settings) {
                xhr.setRequestHeader('X-CSRFToken', csrftoken);
            },
            success: function (response) {


                // Handle response from the server
            },
            error: function (xhr, status, error) {
                console.error('Error:', error);
                // Handle error response
                alert("Ubacivanje slike neuspesno")
            }
        });

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

});

function inicijalizuj() {
    console.log(artikal);
    document.getElementById("slika").src = "../static/slike/" + artikal.naziv + ".jpg";


    var cena = document.getElementById("unosCene");
    cena.placeholder = artikal.cena;
    cena.value = artikal.cena;
    var stanje = document.getElementById("unosStanja");
    stanje.placeholder = artikal.stanje;
    stanje.value = artikal.stanje;

    console.log(recenzija);
    document.getElementById("proizvodjac").value = recenzija.proizvodjac;
    document.getElementById("gazirano").value = (recenzija.gazirano == '0' ? "Ne" : "Da");;
    document.getElementById("alkohol").value =  recenzija.procenatAlkohola;
    document.getElementById("zemlja").value = recenzija.zemljaPorekla;
    document.getElementById("povratnaAmbalaza").value =  (recenzija.povratnaAmbalaza == '0' ? "Ne" : "Da");
    document.getElementById("opis").value = recenzija.opis;


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
    console.log(komentari);
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

        var clearBtn = document.createElement("button");
        clearBtn.textContent = "X";
        clearBtn.style.backgroundColor = "red";
        clearBtn.style.color = "white";
        clearBtn.style.border = "none";
        clearBtn.style.cursor = "pointer";
        clearBtn.style.padding = "5px 10px";
        clearBtn.style.borderRadius = "5px";
        clearBtn.style.fontSize = "14px";
        clearBtn.style.marginLeft = "10px";

        clearBtn.onmouseover = function () {
            clearBtn.style.backgroundColor = "darkred";
        };

        clearBtn.onmouseout = function () {
            clearBtn.style.backgroundColor = "red";
        };
        clearBtn.dataset.komentar = komentar.komentar;
        clearBtn.dataset.sifra = artikal.sifra;
        clearBtn.dataset.idk = komentar.idk;


        clearBtn.onclick = function () {
            var komentarData = this.dataset.komentar;
            var sifraData = this.dataset.sifra;
            var idkData = this.dataset.idk;
            const csrftoken = getCookie('csrftoken');

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
                success: function (response) {
                    if (response.val === '1') {
                        location.reload();
                    } else {
                        alert("Nije obrisan");
                    }
                },
                error: function (xhr, status, error) {
                    alert("GRESKA");
                }
            });
        };


        if (admin == '1') {
            clearBtn.hidden = false;
        } else {
            clearBtn.hidden = true;
        }

        container.appendChild(textarea);
        container.appendChild(clearBtn);
        sekcija.appendChild(container);
    });


}