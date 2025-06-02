console.log("reservation2.js loaded");

const MAX_GUESTS = 5;

// DA TESTARE!!!
//caricamento logo in base al tag title della pagina
window.addEventListener('DOMContentLoaded', function() {
  let logo = document.querySelector(".logo");
  if(document.title === 'Airbnb MOCK')
    logo.setAttribute('src', '/assets/logo.png'); 
});

window.addEventListener("load", setBtnState); //così perché se no i bottoni non sono ancora caricati

//set btn
function setBtnState() {
  console.log("setBtnState called");
  let decrBtns = document.querySelectorAll('.decrease');
  let incrBtns = document.querySelectorAll('.increase');

  console.log("decrBtns: ");
  console.log(decrBtns);

  console.log("incrBtns: ");
  console.log(incrBtns);
  decrBtns.forEach(decrBtn => {
    const qty = parseInt(decrBtn.parentElement.querySelector('.qty').textContent);
    qty == 0 ? decrBtn.classList.add('disabled') : decrBtn.classList.remove('disabled');
  });

  incrBtns.forEach(incrBtn => {
    const qty = parseInt(incrBtn.parentElement.querySelector('.qty').textContent);
    qty >= MAX_GUESTS ? incrBtn.classList.add('disabled') : incrBtn.classList.remove('disabled');
  })
  console.log("setBtnState ended");

}

///////////////////////////////////////
//gestione toggle per reservationBar///
///////////////////////////////////////
document.addEventListener('DOMContentLoaded', function () {
  const toggleBtn = document.getElementById('toggleReservationBar');
  const reservationBar = document.getElementById('reservationBar');

  toggleBtn.addEventListener('click', function () {
    // Solo mostra/nascondi su mobile
    if (window.innerWidth < 992) {
      reservationBar.classList.toggle('d-none');
      //modifica pulsante apri/chiudi 
      if (reservationBar.classList.contains('d-none')) {
        toggleBtn.innerHTML = '<span> <i class="bi bi-search"></i> Discover</span>';
        toggleBtn.classList.remove('closeBtn');
      } else {
        toggleBtn.innerHTML = '<i class="bi bi-x-lg"></i>'; //x di chiusura
        toggleBtn.classList.add('closeBtn'); //bottone piccolo
      }
    }
  });
});


///////////////////////////////////
/////gestione dropdown guests//////
///////////////////////////////////
document.addEventListener("DOMContentLoaded", function () {
  const wrapper = document.getElementById("dropdownWrapper");
  const guestInput = document.getElementById("guestInput");
  const guestDropdown = document.getElementById("guestDropdown");

  // Toggle guest dropdown 
  guestInput.addEventListener("click", function () {
    console.log("* input clicked");
    guestDropdown.classList.toggle("show");
  });

  guestDropdown.addEventListener("click", function (e) {
    let target = e.target;

    //ridalgo al bottone dal tag i
    if (target.tagName === "I") {
      target = target.closest("button");
    }

    if (target && target.tagName === "BUTTON") {
      const counter = target.closest(".counter"); //contenitore del contatore
      const qtyEl = counter.querySelector(".qty");
      let value = parseInt(qtyEl.textContent);

      if (target.classList.contains("increase") && value < MAX_GUESTS) {
        qtyEl.textContent = value + 1;
      } else if (target.classList.contains("decrease") && value > 0) {
        qtyEl.textContent = value - 1;
      }

      updateGuestSummary();
      setBtnState();
    }
  });

  function updateGuestSummary() {
    const rows = guestDropdown.querySelectorAll(".guestRow");
    const summary = [];
    let total = 0;
    let pets = false;

    rows.forEach(row => {
      const label = row.querySelector("span").textContent; // categoria ospite
      const qty = parseInt(row.querySelector(".qty").textContent);
      total += qty;
      if (label === "Pets" && qty > 0) {
        pets = true; // se ci sono animali
      }
    });

    if (total > 0) {
      summary.push(total === 1 ? "1 Guest" : `${total} Guests`);
      if (pets) summary.push("🦤");
      guestInput.value = summary.join(' '); // uniamo senza virgole
    } else {
      guestInput.value = "Add guests";
    }
  }

  //chiusura dropdown con click fuori
  document.addEventListener("click", function (e) {
    if (!wrapper.contains(e.target)) {
      guestDropdown.classList.remove("show");
    }
  });
});

///////////////////////////////////
/////gestione dropdown date////////
///////////////////////////////////

document.addEventListener("DOMContentLoaded", function () {
  //gestisco il dropdown diversamente per mobile (bisogna però ricaricare la pagina per vederlo in funzione)
  const isMobile = window.matchMedia("(max-width: 991.98px)").matches;

  let checkIn = null, checkOut = null;
  const checkInInput = document.getElementById("resCheckIn");
  const checkOutInput = document.getElementById("resCheckOut");
  const dateDropdown = document.getElementById("dateDropdown");

  let checkInDate = null;
  let checkOutDate = null;

  if (isMobile) {
    // MOBILE: usa popup Flatpickr classico
    checkIn = flatpickr("#resCheckIn", {
      dateFormat: "d-m-Y",
      minDate: "today",
      onChange: function (selectedDates) {
        checkIn = selectedDates[0];
        checkInInput.value = formatDate(checkIn);
        checkOut.set("minDate", checkIn);
      },
    });

    checkOut = flatpickr("#resCheckOut", {
      dateFormat: "d-m-Y",
      minDate: "today",
      onChange: function (selectedDates) {
        checkOut = selectedDates[0];
        checkOutInput.value = formatDate(checkOut);
      }
    });
  } else {
    const checkInPicker = flatpickr("#checkInCalendar", {
      inline: true,
      minDate: "today",
      dateFormat: "d-m-Y",
      onChange: function (selectedDates) {
        checkInDate = selectedDates[0];
        checkInInput.value = formatDate(checkInDate);
        checkOutPicker.set("minDate", checkInDate);
        if (checkInDate && checkOutDate) {
          highlightRange(checkInDate, checkOutDate);
        }
      }
    });

    const checkOutPicker = flatpickr("#checkOutCalendar", {
      inline: true,
      minDate: "today",
      dateFormat: "d-m-Y",
      onChange: function (selectedDates) {
        checkOutDate = selectedDates[0];
        checkOutInput.value = formatDate(checkOutDate);
        if (checkInDate && checkOutDate) {
          highlightRange(checkInDate, checkOutDate);
        }
      }
    });
  }

  function highlightRange(fromDate, toDate) {
    const calendarDays = document.querySelectorAll(".flatpickr-day");

    calendarDays.forEach(day => {
      const date = day.dateObj;
      day.classList.remove("in-range", "selected-start", "selected-end");

      if (!date) return;

      //se è un giorno nel range e le date sono definite
      if (fromDate && toDate && date > fromDate && date < toDate) {
        day.classList.add("in-range");
      }

      // Aggiungi stile anche al check-in e check-out
      if (fromDate && date.toDateString() === fromDate.toDateString()) {
        day.classList.add("in-range", "selected-start");
      }

      if (toDate && date.toDateString() === toDate.toDateString()) {
        day.classList.add("in-range", "selected-end");
      }
    });
  }
  function formatDate(date) {
    return date.toLocaleDateString("it-IT");
  }

  // Formatta la data da mettere nell'input
  function formatDate(date) {
    return date.toLocaleDateString("it-IT");
  }

  // toggle apertura dropdown
  checkInInput.addEventListener("click", () => {
    console.log("Check-in input clicked");
    dateDropdown.classList.add("show");
    checkInInput.parentElement.classList.add("clicked"); //resSearch

  });

  checkOutInput.addEventListener("click", () => {
    console.log("Check-out input clicked");
    dateDropdown.classList.add("show");
    checkOutInput.parentElement.classList.add("clicked");
  });

  // chiusura clic fuori
  document.addEventListener("click", function (e) {
    if (
      !dateDropdown.contains(e.target) &&
      e.target !== checkInInput &&
      e.target !== checkOutInput
    ) {
      checkInInput.parentElement.classList.remove("clicked");
      checkOutInput.parentElement.classList.remove("clicked");
      dateDropdown.classList.remove("show");
    }
  });
});

///////////////////////////////////
//gestione footer #contentToShow///
///////////////////////////////////

//array con le varie categorie
const inspoSubCats = [
  [ //Popular
  {city: "Whitby", stay: "House"},
  {city: "Majorca" , stay: "Cottage"},
  {city: "Bath" , stay: "Serviced apartment"},
  {city: "Rome" , stay: "Holiday"},
  {city: "Cape Town" , stay: "Holiday"},
  {city: "Harrogate" , stay: "Cottage"},
  {city: "Athens" , stay: "Flat"},
  {city: "Donostia-San Sebastian" , stay: "Holiday"},
  {city: "Portrush" , stay: "Cottage"},
  {city: "Leicester" , stay: "Cabin"},
  {city: "Sydney" , stay: "Flat"},
  {city: "Lincoln" , stay: "House"},
  {city: "Bristol" , stay: "Cottage"},
  {city: "Seville" , stay: "Falt"},
  {city: "Tenby" , stay: "Cabin"},
  {city: "Poole" , stay: "Flat"},
  {city: "Windermere" , stay: "Cabin"},
  ],
  [ //Costals
  {city: "Sines", stay: "Monthly"},
  {city: "Chesil Beach" , stay: "Monthly"},
  {city: "Weymouth Beach" , stay: "Holiday"},
  {city: "El Postiguet Beach" , stay: "Monthly"},
  {city: "Sarasota" , stay: "House"},
  {city: "Victoria" , stay: "Cottage"},
  {city: "Paignton" , stay: "Cottage"},
  {city: "Viña del Mar" , stay: "Holiday"},
  {city: "Faro" , stay: "Villa"},
  {city: "Fistral Beach" , stay: "Cottage"},
  {city: "Santa Barbara" , stay: "House"},
  {city: "Worthing Beach" , stay: "Flat"},
  {city: "Portsmouth" , stay: "Holiday"},
  {city: "Playa de Amadores" , stay: "Holiday"},
  {city: "Patong Beach" , stay: "House"},
  {city: "Savannah" , stay: "Cottage"},
  {city: "Alcúdia" , stay: "Villa"},
  ],
  [ //Historic
  {city: "Caldicot", stay: "Holiday"},
  {city: "Zadelgem" , stay: "House"},
  {city: "Cowny Castle" , stay: "Holiday"},
  {city: "Glasgow Green" , stay: "Pet-friendly"},
  {city: "Campo de' Fiori" , stay: "Holiday"},
  {city: "Alnwick Castle" , stay: "Holiday"},
  {city: "Nyhavn" , stay: "Monthly"},
  {city: "Pirou" , stay: "Monthly"},
  {city: "Leuven" , stay: "Holiday"},
  {city: "Nizwa" , stay: "Monthly"},
  {city: "Endimburgh Castle" , stay: "Holiday"},
  {city: "Sudeley Castle" , stay: "Holiday"},
  {city: "Harvard University" , stay: "Holiday"},
  {city: "Noli" , stay: "Pet-friendly"},
  {city: "Blenheim Palace" , stay: "House"},
  {city: "Fredricksburg" , stay: "House"},
  {city: "Neuschwanstein Castle" , stay: "Holiday"},
  ],
  [ //Islands
  {city: "Biała Podlaska", stay: "Monthly"},
  {city: "Cérans-Foulletorte" , stay: "House"},
  {city: "Ibiúna" , stay: "Monthly"},
  {city: "Çorlu" , stay: "Monthly"},
  {city: "Gili Islands" , stay: "Holiday"},
  {city: "Chios" , stay: "Monthly"},
  {city: "Ilha de Gigóia" , stay: "House"},
  {city: "Benidorm Island" , stay: "Holiday"},
  {city: "Cuautla" , stay: "House"},
  {city: "Oued Laou" , stay: "Holiday"},
  {city: "Realp" , stay: "Monthly"},
  {city: "Pato Branco" , stay: "Monthly"},
  {city: "La Punt-Chamues-ch" , stay: "Holiday"},
  {city: "Sincelejo" , stay: "Holiday"},
  {city: "Mellingen" , stay: "Holiday"},
  {city: "Clare Island" , stay: "Holiday"},
  {city: "Târgu Secuiesc" , stay: "Monthly"},
  ],
  [ //Lakes
  {city: "Pasadena", stay: "Cottage"},
  {city: "Liepāja" , stay: "Pet-friendly"},
  {city: "Spiez" , stay: "Pet-friendly"},
  {city: "San Salvador" , stay: "Holiday"},
  {city: "Buffalo" , stay: "Villa"},
  {city: "Ithaca" , stay: "Villa"},
  {city: "Haecham" , stay: "Pet-friendly"},
  {city: "Daly City" , stay: "House"},
  {city: "Tintagel" , stay: "Flat"},
  {city: "Forest Row" , stay: "House"},
  {city: "Milwaukee" , stay: "Flat"},
  {city: "Füssen" , stay: "Pet-friendly"},
  {city: "Lake Havasu" , stay: "Holiday"},
  {city: "Austin" , stay: "Villa"},
  {city: "Woodstock" , stay: "Cottage"},
  {city: "Palm Beach Gardens" , stay: "Villa"},
  {city: "Montreux" , stay: "Holiday"},
  ],
  [ //toDo
  {city: "Appennine Mountains", stay: "Tours"},
  {city: "Great Britain" , stay: "Art and culture"},
  {city: "Oued Tensift" , stay: "Sightseeing"},
  {city: "Medina" , stay: "Things to do"},
  {city: "Rome" , stay: "Things to do"},
  {city: "Francavilla al mare" , stay: "Things to do"},
  {city: "Porto" , stay: "Sport activities"},
  {city: "Seine" , stay: "Nature and outdoors"},
  {city: "Barcelonés" , stay: "Art and culture"},
  {city: "Barcelona" , stay: "Entertainment"},
  {city: "Paris" , stay: "Tours"},
  {city: "Arcozelo" , stay: "Sightseeing"},
  {city: "Honshu" , stay: "Nature and outdoors"},
  {city: "Florence" , stay: "Sports activities"},
  {city: "Cyclades" , stay: "Tours"},
  {city: "Hebrides" , stay: "Things to do"},
  {city: "Santa Maria Mayor" , stay: "Tours"},
  ],
  [ //unique
  {city: "Yurt Rentals", stay: "United States"},
  {city: "Yurt Rentals" , stay: "United Kingdom"},
  {city: "Castle Rentals" , stay: "United States"},
  {city: "Houseboats" , stay: "United States"},
  {city: "Holiday Caravans" , stay: "United Kingdom"},
  {city: "Private Island Rentals" , stay: "United States"},
  {city: "Farm Houses" , stay: "United States"},
  {city: "Farm Cottages" , stay: "United Kingdom"},
  {city: "Cabin Rentals" , stay: "Australia"},
  {city: "Luxury Cabins" , stay: "United Kingdom"},
  {city: "Luxury Cabins" , stay: "United States"},
  {city: "Holiday Chalets" , stay: "United Kingdom"},
  {city: "Cottage Rentals" , stay: "United States"},
  {city: "Holiday Cottages" , stay: "United Kingdom"},
  {city: "Mansion Rentals" , stay: "United States"},
  {city: "Villa Rentals" , stay: "United Kingdom"},
  {city: "Holiday Bungalows" , stay: "United Kingdom"},
  ],
  [ //unique
  {city: "Amazing Pools", stay: ""},
  {city: "Arctic", stay: ""},
  {city: "Camping", stay: ""},
  {city: "Camper Vans", stay: ""},
  {city: "Castles", stay: ""},
  {city: "Containers", stay: ""},
  {city: "Countryside", stay: ""},
  {city: "Design", stay: ""},
  {city: "Earth Homes", stay: ""},
  {city: "Farms", stay: ""},
  {city: "National Parks", stay: ""},
  {city: "Vineyards", stay: ""},
  {city: "OMG!", stay: ""},
  {city: "Tiny Homes", stay: ""},
  {city: "Towers", stay: ""},
  {city: "Windmills", stay: ""},
  {city: "Luxe", stay: ""},
  ],
];

//prima inizializzazione della tendina #popular
document.addEventListener('DOMContentLoaded', fillContent(document.getElementById('contentToShow'), 0));

document.getElementById('footerNav').addEventListener('click', function (event) {
  let btns = document.querySelectorAll('#inspo button');
  let container = document.getElementById('contentToShow');
  let index; 
  //toglo la classe btnClicked all'elemento che l'aveva prima; 
  //non uso forEach perché mi serve tenere traccia dell'indice
  for(let i=0; i<btns.length; i++) {
    if (btns[i].classList.contains('btnClicked'))
      btns[i].classList.remove('btnClicked');
    if (btns[i].id === event.target.id)
      index = i;
  }
  console.log(index);
  //metto la classe btnClicked al btn clicked
  if (event.target.tagName === 'BUTTON')
    event.target.classList.add('btnClicked');
  //se ci sono elementi, li toglie
  if (container.hasChildNodes())
    clearContent(container);
  //aggiungo la tendina dell'elemento corrispondente dall'array inspoSubCats
  fillContent(container, index);
  //pulisce il container  
  function clearContent() {
    while (container.hasChildNodes()) 
      container.removeChild(container.firstChild);
  } 
});

//fuori dal blocco per caricare la prima tendina
function fillContent(container, index) {
  let html = ''; //stringa che metterò come innerHTML a container
  for (let i=0; i<inspoSubCats[index].length; i++) {
    html += `<div class="col-sm-6 col-lg-2"> <a href="#"> <h3 class="fs-6"> ${inspoSubCats[index][i].city} </h3>`;
    //#categories avrà solo .city -> categoria di viaggio
    if (index === inspoSubCats[index].length) {
      html += ' </div>'; //aggiungo la chiusura del tag
      continue; //passo alla prossima iterazione
    }

    html += `<h4 class="fs7 fw-light"> ${inspoSubCats[index][i].stay}`;
    //poi sono categorie senza rentals
    if ((index >= 0 && index <= 4))
      html += ' rentals'
    //in ogni caso aggiungi la chiusura dei tag
    html += ' </h4> </a> </div>';
  }
  //aggiungo al container
  container.innerHTML = html; 
}