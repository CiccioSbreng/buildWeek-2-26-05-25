document.addEventListener("DOMContentLoaded", function() {
    document.querySelectorAll(".carousel").forEach(carousel => {
        let myCarousel = new bootstrap.Carousel(carousel, {
            interval: false // Ho disabilitato lo scorrimento automatico
        });

        //Sto selezionando le immagini dentro il carosello 
        carousel.querySelectorAll(".carousel-inner img").forEach(img => {
            img.addEventListener("click", function() {
                myCarousel.next(); // cliccando sull immagine procede alla foto successiva (devo vedere capire bene come tornare anche indietro )
            });
        });
    });
});
