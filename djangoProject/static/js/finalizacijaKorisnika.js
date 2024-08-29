//Ilija Jakovljević 0542/21
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

function inicijalizuj() {

    document.getElementById("ime").value = korisnik.ime;
    document.getElementById("prezime").value = korisnik.prezime;
    document.getElementById("telefon").value = korisnik.telefon;
    document.getElementById("grad").value = korisnik.grad;
    document.getElementById("zip").value = korisnik.zip;
    document.getElementById("mail").value = korisnik.mail;


    if (Array.isArray(adrese) && adrese.length > 0) {
        const adresaSelect = document.getElementById('adresa');
        adrese.forEach(addr => {
            let option = document.createElement('option');
            option.text = addr.adresa;
            option.value = addr.redni_broj;
            adresaSelect.add(option);
        });
    }
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


    var ukupno = 0;
    ucitaj();
    inicijalizuj();

    function ucitaj() {
        const korpaData = localStorage.getItem('korpa');
        proizvodi = JSON.parse(korpaData);
        print_all(proizvodi);
    }

    function print_all(products) {

        var div = document.getElementById("proizvodi");
        div.innerHTML = "";
        for (var i = 0; i < products.length; i++) {
            add_to_page(div, products[i], i);
        }
        addDost(div);

    }

    function add_to_page(div, item, i) {
        console.log("bruh")
        ukupno = ukupno + item.cena * item.kolicinaArtikla;
        var newItem = document.createElement("li");
        newItem.classList.add("list-group-item");
        newItem.innerHTML = `
             
             &emsp;${item.kolicinaArtikla}x ${item.naziv} - ${(item.cena * item.kolicinaArtikla).toFixed(2)}din
              
        `;

        div.appendChild(newItem);
    }

    function addDost(div) {
        console.log("bruh")
        var newItem = document.createElement("li");
        newItem.classList.add("list-group-item");
        newItem.innerHTML = `
             
             &emsp;Dostava - 300din
              
        `;
        ukupno = (ukupno + 300).toFixed(2);
        console.log(ukupno);

        div.appendChild(newItem);
        document.getElementById("ukupno").innerHTML = `
      
      Ukupno - ${ukupno}din
      
      
      `;
    }

    $("#zavrsi").click(function (e) {

        let ime = document.getElementById("ime").value;
        let prezime = document.getElementById("prezime").value;
        let telefon = document.getElementById("telefon").value;
        let grad = document.getElementById("grad").value;
        let zip = document.getElementById("zip").value;
        let email = document.getElementById("mail").value;
        let adresa = document.getElementById("adresa");
        adresa=adresa.options[adresa.selectedIndex].text;

        if (ime !== "" && prezime !== "" && telefon !== "" && grad !== "" && zip !== "" && email !== "" && adresa !== "") {
            document.getElementById("nijePopunjeno").hidden = true;
            localStorage.setItem("adresa", adresa);
            const csrftoken = getCookie('csrftoken');

            $.ajax({
                url: '/uspesnaNarudzbina/',
                type: 'POST',
                data: {
                    zahtev: 1

                },
                headers: {
                    'X-CSRFToken': csrftoken
                },
                success: function (response) {
                    window.location.href = "/uspesnaNarudzbina/";
                },
                error: function (xhr, status, error) {
                    alert("GRESKA");
                }
            });
        } else {
            document.getElementById("nijePopunjeno").hidden = false;
        }

    });

});