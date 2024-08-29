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
    $("#nastavi").click(function (e) {
        e.preventDefault();

        if (ukupno != null) {
            localStorage.setItem("ukupno", ukupno);
            var vrednost = 0;

            kuponi.forEach(function (item) {
                if (item.naziv == k) {
                    vrednost = item.vrednost;
                }
            })
            var kod = $('#kupon').val();
            localStorage.setItem("kupon", kod);
            const csrftoken = getCookie('csrftoken');

            const korpaData = localStorage.getItem('korpa');


            var dataToSend = {
                korpa: korpaData,
                id: kod
            };

            $.ajax({
                url: '/finalizacija/',
                type: 'POST',
                data: dataToSend,
                beforeSend: function (xhr, settings) {
                    xhr.setRequestHeader('X-CSRFToken', csrftoken);
                },
                success: function (response) {

                    window.location.href = "/finalizacija/";

                },
                error: function (xhr, status, error) {
                    console.error('Error:', error);
                    // Handle error response
                    alert("Ne valja")
                }
            });
        }
    })

});
var ukupno = 0;

function inicijalizuj() {
    console.log(kuponi);

    var korpa = localStorage.getItem("korpa");
    if (korpa != null) {

        korpa = JSON.parse(korpa);
        var sve = document.getElementById("sve");
        var korpaItem = document.getElementById("korpa")
        korpaItem.innerHTML = '';
        korpa.forEach(function (item) {
            var ul = document.createElement("ul");
            ul.className = "list-group list-group-horizontal mx-4 my-1";

            var slika = document.createElement("li");
            slika.className = "d-flex list-group-item col align-items-center justify-content-center";
            slika.style.borderColor = "#C20407";
            var img = document.createElement("img");
            img.className = "border-0";

            img.alt = "...";
            img.style.height = "auto";
            img.style.width = "33%";
            img.style.border = "transparent";
            img.style.alignSelf = "center";
            slika.appendChild(img);

            var naziv = document.createElement("li");
            naziv.className = "d-flex list-group-item col align-items-center justify-content-center";
            naziv.style.textAlign = "center";
            naziv.style.borderColor = "#C20407";
            var p = document.createElement("p");
            p.style.justifySelf = "center";

            var indeks = artikli.findIndex(function (i) {
                return item.sifraArtikla == i.sifraartikla; // Provera da li sifraArtikla odgovara sifri koju tražimo
            });
            p.textContent = artikli[indeks].naziv;
            img.src = "../static/slike/" + artikli[indeks].naziv + ".jpg";
            naziv.appendChild(p);

            var li3 = document.createElement("li");
            li3.className = "d-flex list-group-item col align-items-center justify-content-center";
            li3.style.textAlign = "center";
            li3.style.borderColor = "#C20407";
            var inputDiv = document.createElement("div");
            inputDiv.className = "input-group";
            var input = document.createElement("input");
            input.type = "text";
            input.className = "form-control";
            input.placeholder = "";
            input.setAttribute("aria-label", "Quantity");
            input.setAttribute("aria-describedby", "button-addon2");
            input.value = item.kolicinaArtikla;

            var buttonUp = document.createElement("button");
            buttonUp.className = "btn btn-outline-secondary";
            buttonUp.type = "button";
            buttonUp.id = "button-addon2";
            buttonUp.textContent = "^";
            buttonUp.addEventListener("click", function (sifra) {
                // Dodajte funkciju koja će izbaciti artikal iz korpe
                return function () {
                    item.kolicinaArtikla += 1;
                    localStorage.setItem("korpa", JSON.stringify(korpa));
                    location.reload();
                }
            }(item.sifraArtikla));

            var buttonDown = document.createElement("button");
            buttonDown.className = "btn btn-outline-secondary";
            buttonDown.type = "button";
            buttonDown.id = "button-addon6";
            buttonDown.textContent = "v";
            buttonDown.addEventListener("click", function (sifra) {

                return function () {
                    item.kolicinaArtikla -= 1;
                    if (item.kolicinaArtikla == 0) {
                        var nova = korpa.filter(function (i) {
                            return i.sifraArtikla != sifra;
                        })
                        localStorage.setItem("korpa", JSON.stringify(nova));
                    } else {
                        localStorage.setItem("korpa", JSON.stringify(korpa));
                    }

                    location.reload();
                }
            }(item.sifraArtikla));


            inputDiv.appendChild(input);
            inputDiv.appendChild(buttonUp);
            inputDiv.appendChild(buttonDown);
            li3.appendChild(inputDiv);

            var li4 = document.createElement("li");
            li4.className = "d-flex list-group-item col align-items-center justify-content-center";
            li4.style.textAlign = "center";
            li4.style.borderColor = "#C20407";
            li4.textContent = item.kolicinaArtikla + "x" + item.cena.toFixed(2) + "din";

            var li5 = document.createElement("li");
            li5.className = "d-flex list-group-item col align-items-center justify-content-center";
            li5.style.textAlign = "center";
            li5.style.borderColor = "#C20407";
            li5.textContent = (item.kolicinaArtikla * item.cena).toFixed(2) + "din";

            var li6 = document.createElement("li");
            li6.className = "d-flex list-group-item col align-items-center justify-content-center p-0";
            li6.style.textAlign = "center";
            li6.style.borderColor = "#C20407";
            var buttonRemove = document.createElement("button");
            buttonRemove.className = "btn btn-danger rounded-0 w-100 h-100";
            buttonRemove.type = "button";
            buttonRemove.textContent = "Izbaci iz korpe";
            buttonRemove.addEventListener("click", function (sifra) {

                return function () {
                    var nova = korpa.filter(function (i) {
                        return i.sifraArtikla != sifra;
                    })
                    localStorage.setItem("korpa", JSON.stringify(nova));
                    location.reload();
                }
            }(item.sifraArtikla));
            li6.appendChild(buttonRemove);

            ul.appendChild(slika);
            ul.appendChild(naziv);
            ul.appendChild(li3);
            ul.appendChild(li4);
            ul.appendChild(li5);
            ul.appendChild(li6);

            korpaItem.appendChild(ul);

            var r = document.createElement('li');
            r.innerText = " " + item.kolicinaArtikla + " x " + artikli[indeks].naziv + " - " + (item.kolicinaArtikla * item.cena).toFixed(2) + "din";
            sve.appendChild(r);
            ukupno += (item.kolicinaArtikla * item.cena);

        })
        document.getElementById("ukupno").innerText = "Ukupno - " + ukupno.toFixed(2) + "din";
        document.getElementById("prazna").hidden = true;

        console.log(ukupno);
        if (ukupno == null || ukupno == 0) document.getElementById("prazna").hidden = false;

    }

}