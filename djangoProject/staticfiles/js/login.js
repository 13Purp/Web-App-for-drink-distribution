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

                if(response.val=='3'){
                    //pogresan mejl ili lozinka
                }
                else if(response.val=='1'){
                    sessionStorage.clear();
                localStorage.clear();
                window.location.href = response.redirect;
                }
                else{
                    document.getElementById("g1").hidden=false;
                }


            },
            error: function (xhr, status, error) {
                console.error('Error:', error);
                document.getElementById("g2").hidden=false;
            }
        });

    });

    $("#pretraga").click(function (e) {

        var naziv = $("#nazivPretrage").val()
        localStorage.setItem('Prosledjeno', naziv);
        const csrftoken = getCookie('csrftoken');
        var dataToSend = {
            zahtev: naziv
        }; // Data to send
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

    $('#ulogujSe').click(function () {
        const csrftoken = getCookie('csrftoken');
        var email = $('#loginEmail').val()
        var sifra = $('#loginPass').val()
        var dataToSend = {
            email: email,
            pass: sifra
        };

        $.ajax({
            url: '/loginR/',
            type: 'POST',
            data: dataToSend,
            beforeSend: function (xhr, settings) {
                xhr.setRequestHeader('X-CSRFToken', csrftoken);
            },
            success: function (response) {
                odg = response.val;

                if (odg === '1') {
                    sessionStorage.setItem('logovan', '1');
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
});