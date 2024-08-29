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
    $("#pretraganav").click(function (e) {

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
            return product.mail.toLowerCase().includes(filterValue);
        });
        print_all(filteredProducts);
    });




    $('#proizvodi').on('click', 'button.obrisi-btn', function () {
        var id = $(this).data('id');
        obrisi(id);
    });

    function add_to_page(div, item, i) {
        console.log("bruh")
        var newItem = document.createElement("tr");
        var val="Nije Odobren";
        if(item.odobren)
        {
            val="Odobren";
        }


        newItem.innerHTML = `
             <th scope="row">${i}</th>
              <td>${item.idk}</td>
              <td>${item.pib}</td>
              <td >
                  <a  href="/klijenti/?sifra=${item.mail}">
                  
                        ${item.mail}
                        
                  </a>
                
              </td>
               
              <td>${item.lozinka}</td>
              <td>${val}</td>
              <td class="text-center" ><button 
              class="obrisi-btn" data-id="${item.idk}"
              style="background-color: transparent; border: transparent; text-decoration: underline;" >
              Obriši</button></td>
            
        `;

        div.appendChild(newItem);
    }

});