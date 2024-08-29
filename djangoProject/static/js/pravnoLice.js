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

function inicijalizuj() {

    document.getElementById("ime").value = korisnik.ime;
    document.getElementById("prezime").value = korisnik.prezime;
    document.getElementById("telefon").value = korisnik.telefon;
    document.getElementById("grad").value = korisnik.grad;
    document.getElementById("zip").value = korisnik.zip;
    document.getElementById("email").value = korisnik.mail;
    document.getElementById("pib").value = korisnik.pib;
    console.log(korisnik.odobren)
    if(!korisnik.odobren)
    {
        document.getElementById("odobri").hidden=false


    }
    else
    {
        document.getElementById("katalog").hidden=false
        document.getElementById("katalog").href="/katalogPL/?sifra="+korisnik.pib;
    }
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
                alert("Ne valja")
            }
        });

    });

     $("#odobri").click(function () {


          let text = "Da li ste sigurni da želite da odobrite klijenta?\nPritisak na OK, će mu omogućiti da koristi sitem za poručivanje.";
          if (confirm(text) === true) {

                  const csrftoken = getCookie('csrftoken');
                $.ajax({
                    url: '/klijenti/?sifra="'+korisnik.mail,
                    type: 'POST',
                    data: {
                        'adresa': korisnik.mail
                    },
                    headers: {
                        'X-CSRFToken': csrftoken
                    },
                    success: function (response) {
                        if (response.val === '1') {
                            console.log("Uspesno Odobren");
                            location.reload();
                        } else if (response.val === '-1') {
                            alert('Nepoznat korisnik');
                        }
                    },
                    error: function (xhr, status, error) {
                        alert("GRESKA");
                    }
                });
          }



    });


    $("#brisi").click(function () {

        var selectedAddress = $('#adresa').find('option:selected').text();

        if (selectedAddress) {
            document.getElementById("nijeSelektovana").hidden = true;
            const csrftoken = getCookie('csrftoken');
            $.ajax({
                url: '/izbrisiAdresu/',
                type: 'POST',
                data: {
                    'idk': korisnik.idk,
                    'adresa': selectedAddress
                },
                headers: {
                    'X-CSRFToken': csrftoken
                },
                success: function (response) {
                    if (response.val === '1') {
                        location.reload();
                    } else if (response.val === '-1') {
                        alert('Nepoznat korisnik');
                    }
                },
                error: function (xhr, status, error) {
                    alert("GRESKA");
                }
            });
        } else {
            document.getElementById("nijeSelektovana").hidden = false;
        }
    });

    $("#dodaj").click(function () {
        var novaAdresa = $('#novaAdresa').val();

        if (novaAdresa != "") {
            document.getElementById("nijeUneta").hidden = true;
            const csrftoken = getCookie('csrftoken');
            $.ajax({
                url: '/dodajAdresu/',
                type: 'POST',
                data: {
                    'idk': korisnik.idk,
                    'adresa': novaAdresa
                },
                headers: {
                    'X-CSRFToken': csrftoken
                },
                success: function (response) {
                    if (response.val == '1') {
                        location.reload();
                    } else if (response.val == '-1') {
                        alert('Nepoznat korisnik');
                    }
                },
                error: function (xhr, status, error) {
                    alert("GRESKA");
                }
            });
        } else {
            document.getElementById("nijeUneta").hidden = false;
        }
    });

    $("#zavrsi").click(function () {
        let ime = document.getElementById("ime").value;
        let prezime = document.getElementById("prezime").value;
        let telefon = document.getElementById("telefon").value;
        let grad = document.getElementById("grad").value;
        let zip = document.getElementById("zip").value;
        let email = document.getElementById("email").value;
        let sifra = document.getElementById("sifra").value;
        console.log("sifra: " + sifra);
        console.log(ime + " " + prezime + " " + telefon + " " + grad + " " + zip + " " + email);
        const csrftoken = getCookie('csrftoken');
        if (ime != "" && prezime != "" && telefon != "" && grad != "" && zip != "" && email != "") {
            $.ajax({
                url: '/zavrsiIzmene/',
                type: 'POST',
                data: {
                    'idk': korisnik.idk,
                    'ime': ime,
                    'prezime': prezime,
                    'telefon': telefon,
                    'grad': grad,
                    'zip': zip,
                    'email': email,
                    'sifra': sifra

                },
                headers: {
                    'X-CSRFToken': csrftoken
                },
                success: function (response) {
                    if (response.val === '1') {

                    } else if (response.val === '-1') {
                        alert('greska2');
                    }
                },
                error: function (xhr, status, error) {
                    alert("GRESKA");
                }
            });
        } else {
            document.getElementById("nijePopunjeno").hidden = false;
        }

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

                alert("Ne valja")
            }
        });

    });

});

