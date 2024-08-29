//Ilija Jakovljević 0542/21

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

    $("#fizickoLice").change(function () {
        if ($("#fizickoLice").is(":checked")) {
            $("#pib").prop("disabled", true);
        }
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

    $("#pravnoLice").change(function () {
        if ($("#pravnoLice").is(":checked")) {
            $("#pib").prop("disabled", false);
        }
    });

    $('form').on('submit', function (event) {
        event.preventDefault();
    });

    $('#registrujSe').click(function () {
        const csrftoken = getCookie('csrftoken');

        var email = $('#mail').val()
        var sifra = $('#sifra').val()
        var telefon = $('#telefon').val()
        var grad = $('#grad').val()
        var ime = $('#ime').val()
        var prezime = $('#prezime').val()
        var adresa = $('#adresa').val()
        var zip = $('#zip').val()
        var pib = $('#pib').val()
        var fLice = $('#fizickoLice').val()

        var dataToSend = {
            email: email,
            pass: sifra,
            tel: telefon,
            grad: grad,
            ime: ime,
            prezime: prezime,
            adresa: adresa,
            zip: zip,
            pib: pib,
            fLice: fLice
        }; // Data to send

        $.ajax({
            url: '/registracijaR/',
            type: 'POST',
            data: dataToSend,
            beforeSend: function (xhr, settings) {
                xhr.setRequestHeader('X-CSRFToken', csrftoken);
            },
            success: function (response) {
                odg = response.val;

                if (odg === '1') {
                    window.location.href = response.url;
                }
                if (odg === '0') {
                    alert('Pogresna lozinka');
                }
                if (odg === '-1') {
                    alert('Nepoznat mail');
                }


            },
            error: function (xhr, status, error) {
                console.error('Error:', error);

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

})



