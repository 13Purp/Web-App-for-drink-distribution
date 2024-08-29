//Ilija Jakovljević 0542-21
//Iva Paunovic 0580-21

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

     $('form').on('submit', function(event) {
             event.preventDefault();
         });

     //proverava da li je logovan da bi stavio logout umesto login
     var logovanData = sessionStorage.getItem('logovan');
     if (logovanData) {

         document.getElementById("logOut").hidden=false;
         document.getElementById("logIn").hidden=true;



    console.log('Logovan:', logovanData);
}

     //logout
       $("#logOut").click( function (e) {
        const csrftoken = getCookie('csrftoken');
            var dataToSend = {
                zahtev:0
            };

            $.ajax({
                url: '/loginS/' ,
                type: 'POST',
                data: dataToSend,
                  beforeSend: function(xhr, settings) {
                    xhr.setRequestHeader('X-CSRFToken', csrftoken);
                },
                success: function(response) {

                    sessionStorage.clear();
                    localStorage.clear();
                    window.location.href = response.redirect;

                },
                error: function(xhr, status, error) {
                    console.error('Error:', error);
                    // Handle error response
                    alert("Ne valja")
                }
            });

        });

    $("#pretraga").click( function (e) {

        var naziv=$("#nazivPretrage").val()
        localStorage.setItem('Prosledjeno',naziv);
        const csrftoken = getCookie('csrftoken');
            var dataToSend = {
                zahtev:naziv
            };

            $.ajax({
                url: '/katalogS/' ,
                type: 'POST',
                data: dataToSend,
                  beforeSend: function(xhr, settings) {
                    xhr.setRequestHeader('X-CSRFToken', csrftoken);
                },
                success: function(response) {
                     window.location.href = response.redirect;

                },
                error: function(xhr, status, error) {
                    console.error('Error:', error);
                    // Handle error response
                    alert("Ne valja")
                }
            });

        });


    $("#dPopust").click( function (e) {

        var popust=$('#aPopust').val();
        var sifra=$('#aSifra').val();

        const csrftoken = getCookie('csrftoken');

            var dataToSend = {
                zahtev:0,
                popust:popust,
                sifra:sifra
            };

            $.ajax({
                url: '/adminStranica/' ,
                type: 'POST',
                data: dataToSend,
                  beforeSend: function(xhr, settings) {
                    xhr.setRequestHeader('X-CSRFToken', csrftoken);
                },
                success: function(response) {

                    alert("dodat popust za sifru: ", sifra);
                },
                error: function(xhr, status, error) {
                    console.error('Error:', error);
                    // Handle error response
                    alert("Ne valja")
                }
            });

        });

    $("#dMod").click( function (e) {

        var mejl=$('#email').val();
        var sifra=$('#mSifra').val();



        const csrftoken = getCookie('csrftoken');

            var dataToSend = {
                zahtev:1,
                email:mejl,
                sifra:sifra
            };

            $.ajax({
                url: '/adminStranica/' ,
                type: 'POST',
                data: dataToSend,
                  beforeSend: function(xhr, settings) {
                    xhr.setRequestHeader('X-CSRFToken', csrftoken);
                },
                success: function(response) {

                    alert("dodate moderatorske privilegije za  ", mejl);

                },
                error: function(xhr, status, error) {
                    console.error('Error:', error);
                    // Handle error response
                    alert("Ne valja")
                }
            });

        });

    $("#bMod").click( function (e) {

        var mejl=$('#dEmail').val();

        const csrftoken = getCookie('csrftoken');


            var dataToSend = {
                zahtev:2,
                email:mejl,
            };

            $.ajax({
                url: '/adminStranica/' ,
                type: 'POST',
                data: dataToSend,
                  beforeSend: function(xhr, settings) {
                    xhr.setRequestHeader('X-CSRFToken', csrftoken);
                },
                success: function(response) {
                     odg=response.val;

                    if (odg==='1')
                    {
                        alert("oduzete moderatorske privilegije za  ", mejl);
                    }
                    else
                    {
                        alert("Los unos  ");
                    }

                },
                error: function(xhr, status, error) {
                    console.error('Error:', error);
                    // Handle error response
                    alert("Ne valja")
                }
            });

        });

    $("#pdPopust").click( function (e) {

        var popust=$('#pPopust').val();
        var sifra=$('#pSifra').val();
        var pib=$('#pib').val();

        const csrftoken = getCookie('csrftoken');

            var dataToSend = {
                zahtev:3,
                popust:popust,
                sifra:sifra,
                pib:pib
            };

            $.ajax({
                url: '/adminStranica/' ,
                type: 'POST',
                data: dataToSend,
                  beforeSend: function(xhr, settings) {
                    xhr.setRequestHeader('X-CSRFToken', csrftoken);
                },
                success: function(response) {

                    alert("dodat popust za pib za sifru: ", sifra);

                },
                error: function(xhr, status, error) {
                    console.error('Error:', error);
                    // Handle error response
                    alert("Ne valja")
                }
            });

        });

});