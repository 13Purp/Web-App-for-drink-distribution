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

function dodajKartice() {
    for (var i = 0; i < artikli.length; i++) {
        if (i > 9) break;
        const cardDiv = document.createElement('div');
        cardDiv.className = 'card m-2 custom-card rounded';
        cardDiv.addEventListener('click', (function (sifra) {
            return function () {
                window.location.href = "/artikalS/?sifra=" + encodeURIComponent(sifra);
                return false;
            };
        })(artikli[i].sifraartikla));


        const img = document.createElement('img');
        img.src = "../static/slike/" + artikli[i].naziv + ".jpg";
        ;
        img.className = 'card-img-top';
        img.alt = '...';


        const cardBody = document.createElement('div');
        cardBody.className = 'card-body';

        const cardTitle = document.createElement('h5');
        cardTitle.className = 'card-title';
        cardTitle.style.textAlign = "center";
        cardTitle.textContent = artikli[i].naziv;


        const price = document.createElement('p');
        price.className = 'card-text my-0';
        price.style.textAlign = 'center';
        price.style.color = '#C20407';
        price.style.fontWeight = 'bolder';
        price.style.fontSize = 'large';
        price.textContent = (artikli[i].cena * (100 + artikli[i].pdv) / 100).toFixed(2) + "din";


        const button = document.createElement('button');
        button.className = 'btn artikli';
        button.style.backgroundColor = '#C20407';


        const buttonImg = document.createElement('img');
        buttonImg.src = '../static/slike/belaKolicaTake2.png'
        buttonImg.alt = 'Slika';
        buttonImg.style.minHeight = 'auto';
        buttonImg.style.width = '50%';
        buttonImg.style.height = '50%';
        buttonImg.addEventListener('click', (function (sifra) {
            return function () {
                window.location.href = "/artikalS/?sifra=" + encodeURIComponent(sifra);
                return false;
            }
        }(artikli[i].sifraartikla)));

        button.appendChild(buttonImg);


        cardBody.appendChild(cardTitle);
        cardBody.appendChild(price);

        cardBody.appendChild(button);


        cardDiv.appendChild(img);
        cardDiv.appendChild(cardBody);


        if (i < 3) document.getElementById('slike1').appendChild(cardDiv);
        else if (i < 6) document.getElementById('slike2').appendChild(cardDiv);
        else if (i < 9) document.getElementById('slike3').appendChild(cardDiv);
        else break;
    }
}