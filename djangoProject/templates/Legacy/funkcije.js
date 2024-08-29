$(document).ready(function() {
    
    $(".artikli").click(function(){
        //this.pa uzmi naziv p aonda dodaj taj artikal
        //this ce dad zna koji je kliknut
        //dodaj artikal u korpu
        
    })
    $("#fizickoLice").change(function(){
        if($("#fizickoLice").is(":checked")){
            $("#pib").prop("disabled", true);
        }
    });

    $("#pravnoLice").change(function(){
        if($("#pravnoLice").is(":checked")){
            $("#pib").prop("disabled", false);
        }
    });
})



function dodajKartice(){
    //dodaj karticce iz baze koje su na popustu ili ako nema nijedna onda tri odabrana
    //115,127,139,156,167,179,196,208,220
}

