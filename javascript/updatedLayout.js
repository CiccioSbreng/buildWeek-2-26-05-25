console.log("reservation2.js loaded");

const MAX_GUESTS = 5;

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
      }
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


