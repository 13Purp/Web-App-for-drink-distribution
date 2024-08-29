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

    $('#dodajArtikl').click(function () {
        const csrftoken = getCookie('csrftoken');
        console.log("Dodaj Artikl Kliknuto");

        var naziv = $('#fNaziv').val();
        var cena = $('#fCena').val();
        var stanje = $('#fStanje').val();
        var sifra = $('#fSifra').val();
        var uvoz = "";
        var gazirano = "";
        var sAlk = "";
        if ($('#cGazirano').is(":checked")) {
            gazirano = "1";
        }
        if ($('#cUvoz').is(":checked")) {
            uvoz = "1";

        }
        if ($('#csAlk').is(":checked")) {
            sAlk = "1";

        }

        console.log(gazirano);
        console.log(uvoz);
        console.log(sAlk);
        var imageFile = $('#formFile').prop('files')[0];
        var formData = new FormData();
        formData.append("slika", imageFile);
        formData.append("naziv", naziv);
        formData.append("cena", cena);
        formData.append("stanje", stanje);
        formData.append("sifra", sifra);
        formData.append("uvoz", uvoz);
        formData.append("gazirano", gazirano);
        formData.append("sAlk", sAlk);


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
                alert("Ne valja")
            }
        });
    });


    var proizvodi = []
    ucitaj();

    function ucitaj() {
        proizvodi = JSON.parse(document.getElementById("jsonProizvodi").innerHTML);
        print_all(proizvodi);
    }

    function print_all(products) {
        var div = document.getElementById("proizvodi");
        div.innerHTML = "";
        for (var i = 0; i < products.length; i++) {
            add_to_page(div, products[i], i);
        }
    }

    function obrisi(id) {
        console.log(id);

        const csrftoken = getCookie('csrftoken');


        var dataToSend = {
            upload: 0,
            id: id
        };

        $.ajax({
            url: '/dodavanjeProizvoda/',
            type: 'POST',
            data: dataToSend,
            beforeSend: function (xhr, settings) {
                xhr.setRequestHeader('X-CSRFToken', csrftoken);
            },
            success: function (response) {
                proizvodi = JSON.parse(response.proizvodi);
                console.log(proizvodi);
                print_all(proizvodi);


            },
            error: function (xhr, status, error) {
                console.error('Error:', error);
                // Handle error response
                alert("Ne valja")
            }
        });

    }

    $('#search').on('keypress', function () {

        var filterValue = $('#search').val().toLowerCase();
        var filteredProducts = proizvodi.filter(function (product) {
            return product.naziv.toLowerCase().includes(filterValue);
        });
        print_all(filteredProducts);
    });

    $('#cRast').on('click', function () {

        var filterValue = $('#search').val().toLowerCase();
        var filteredProducts = proizvodi;
        if (filterValue !== "") {
            filteredProducts = proizvodi.filter(function (product) {
                return product.naziv.toLowerCase().includes(filterValue);
            });
        }
        filteredProducts.sort((a, b) => parseFloat(a.cena) - parseFloat(b.cena));
        console.log(filteredProducts)
        print_all(filteredProducts);
    });
    $('#cOpad').on('click', function () {

        var filterValue = $('#search').val().toLowerCase();
        var filteredProducts = proizvodi;
        if (filterValue !== "") {
            filteredProducts = proizvodi.filter(function (product) {
                return product.naziv.toLowerCase().includes(filterValue);
            });
        }
        filteredProducts.sort((a, b) => parseFloat(b.cena) - parseFloat(a.cena));
        console.log(filteredProducts)
        print_all(filteredProducts);
    });
    $('#nRast').on('click', function () {

        var filterValue = $('#search').val().toLowerCase();
        var filteredProducts = proizvodi;
        if (filterValue !== "") {
            filteredProducts = proizvodi.filter(function (product) {
                return product.naziv.toLowerCase().includes(filterValue);
            });
        }
        filteredProducts.sort((a, b) => a.naziv.localeCompare(b.naziv));
        console.log(filteredProducts)
        print_all(filteredProducts);
    });
    $('#nOpad').on('click', function () {

        var filterValue = $('#search').val().toLowerCase();
        var filteredProducts = proizvodi;
        if (filterValue !== "") {
            filteredProducts = proizvodi.filter(function (product) {
                return product.naziv.toLowerCase().includes(filterValue);
            });
        }
        filteredProducts.sort((a, b) => b.naziv.localeCompare(a.naziv));
        console.log(filteredProducts)
        print_all(filteredProducts);
    });
    $('#sAlk').on('click', function () {

        console.log(proizvodi)
        var filterValue = true;
        filteredProducts = proizvodi.filter(function (product) {
            return product.sadrzialkohol === filterValue;
        });
        console.log(filteredProducts)
        print_all(filteredProducts);
    });
    $('#uvoz').on('click', function () {

        console.log(proizvodi)
        var filterValue = true;
        filteredProducts = proizvodi.filter(function (product) {
            return product.uvoz === filterValue;
        });
        console.log(filteredProducts)
        print_all(filteredProducts);
    });
    $('#gazirano').on('click', function () {

        console.log(proizvodi)
        var filterValue = true;
        filteredProducts = proizvodi.filter(function (product) {
            return product.gazirano === filterValue;
        });
        console.log(filteredProducts)
        print_all(filteredProducts);
    });
    $('#dProizvod').on('click', function () {

        console.log(proizvodi)
        var filterValue = false;
        filteredProducts = proizvodi.filter(function (product) {
            return product.uvoz === filterValue;
        });
        console.log(filteredProducts)
        print_all(filteredProducts);
    });
    $('#bez').on('click', function () {
        print_all(proizvodi);
    });
    $('#voda').on('click', function () {

        console.log(proizvodi)
        var filterValue = "voda";
        filteredProducts = proizvodi.filter(function (product) {
            return product.tip.toLowerCase().includes(filterValue);
        });
        console.log(filteredProducts)
        print_all(filteredProducts);
    });
    $('#sok').on('click', function () {

        console.log(proizvodi)
        var filterValue = "sok";
        filteredProducts = proizvodi.filter(function (product) {
            return product.tip.toLowerCase().includes(filterValue);
        });
        console.log(filteredProducts)
        print_all(filteredProducts);
    });


    $('#proizvodi').on('click', 'button.obrisi-btn', function () {
        var id = $(this).data('id');
        obrisi(id);
    });

    function add_to_page(div, item, i) {
        console.log("bruh")
        var newItem = document.createElement("tr");
        newItem.innerHTML = `
             <th scope="row">${i}</th>
              <td>${item.sifra}</td>
              <td>${item.naziv}</td>
              <td>${item.cena}</td>
              <td>${item.stanje}</td>
              <td class="text-center" ><button 
              class="obrisi-btn" data-id="${item.sifra}"
              style="background-color: transparent; border: transparent; text-decoration: underline;" >
              Obriši</button></td>
            
        `;

        div.appendChild(newItem);
    }

});