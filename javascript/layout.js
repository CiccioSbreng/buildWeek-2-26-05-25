console.log("reservation2.js loaded");

const MAX_GUESTS=5;

window.addEventListener("load", setBtnState); //così perché se no i bottoni non sono ancora caricati

//set btn
function setBtnState(){
  let decrBtns = document.querySelectorAll('.decrease');
  let incrBtns = document.querySelectorAll('.increase');

  decrBtns.forEach(decrBtn => {
    const qty = parseInt(decrBtn.parentElement.querySelector('.qty').textContent);
    qty == 0 ? decrBtn.classList.add('disabled') : decrBtn.classList.remove('disabled');
  }); 

  incrBtns.forEach(incrBtn => {
    const qty = parseInt(incrBtn.parentElement.querySelector('.qty').textContent);
    qty >= MAX_GUESTS ? incrBtn.classList.add('disabled') : incrBtn.classList.remove('disabled');
  })
}
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
  
      if (target.classList.contains("increase")) {
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

    rows.forEach(row => {
      const label = row.querySelector("span").textContent; //categoria ospite
      const qty = parseInt(row.querySelector(".qty").textContent); 
      if (qty > 0) summary.push(`${qty} ${label}`);
    });

    //se summary non è vuoto, cambio il valore del campo input
    guestInput.value = summary.length ? summary.join(", ") : "Add guests";
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

  const checkInInput = document.getElementById("resCheckIn");
  const checkOutInput = document.getElementById("resCheckOut");

  // Toggle date dropdown
  checkInInput.addEventListener("click", function () {
    console.log("* check-in input clicked");
    checkInInput.classList.toggle("show");
  });
  checkOutInput.addEventListener("click", function () {
    console.log("* check-out input clicked");
    checkOutInput.classList.toggle("show");
  });

});
