// Example starter JavaScript for disabling form submissions if there are invalid fields
(() => {
  "use strict";

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll(".needs-validation");

  // Loop over them and prevent submission
  Array.from(forms).forEach((form) => {
    form.addEventListener(
      "submit",
      (event) => {
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
        }

        form.classList.add("was-validated");
      },
      false
    );
  });
})();

// index page --> check button
let taxSwtich = document.getElementById("flexSwitchCheckDefault");
taxSwtich.addEventListener("click", () => {
  let amount = document.getElementsByClassName("amount");
  let amountAfterTax = document.getElementsByClassName("amount-after-tax");
  console.log(amount);
  console.log(amountAfterTax);

  for (amt of amount) {
    if (amt.style.display != "none") {
      amt.style.display = "none";
    } else {
      amt.style.display = "inline";
    }
  }

  for (amt of amountAfterTax) {
    if (amt.style.display != "inline") {
      amt.style.display = "inline";
    } else {
      amt.style.display = "none";
    }
  }
});
