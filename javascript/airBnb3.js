
//Questo codice serve per animare l'icona in alto a destra che ti permette di salvare gli alloggi tra i preferiti 
let firstImg = document.querySelector('.rightImgHeaderInfo div:nth-child(2) img:nth-child(1)');
let secondImg = document.querySelector('.rightImgHeaderInfo div:nth-child(2) img:nth-child(2)');
if (firstImg && secondImg) {
    firstImg.addEventListener("click", () => {
        firstImg.style.display = 'none';
        secondImg.style.display = 'block';
    })
    secondImg.addEventListener("click", () => {
        secondImg.style.display = 'none';
        firstImg.style.display = 'block';
    })
}

