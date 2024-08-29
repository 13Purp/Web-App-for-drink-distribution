//Nikolina Grbović 0315/21
//Vojin Urošević 0397/21
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
    $("#posalji").click(function (e) {
        e.preventDefault();

        var email = $('#mail').val();
        console.log(email);
        if (email != "") {
            document.getElementById("greska").hidden = true;
            const csrftoken = getCookie('csrftoken');
            $.ajax({
                url: '/posaljiMail/',
                type: 'POST',
                data: {
                    'email': email
                },
                headers: {
                    'X-CSRFToken': csrftoken
                },
                success: function (response) {
                    if (response.val == '1') {

                    } else if (response.val == '-1') {
                        alert('greska');
                    } else if (response.val == '-2') {
                        document.getElementById("greska").hidden = false;
                    }
                },
                error: function (xhr, status, error) {
                    alert("GRESKA");
                }
            });
        } else {
            document.getElementById("greska").hidden = false;
        }

    })

});