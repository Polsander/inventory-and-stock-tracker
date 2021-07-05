
function test() {
    const cardSelector = document.querySelectorAll('.card-display');
    const langleySelector = document.querySelectorAll('.langley');
    const leewaySelector = document.querySelectorAll('.leeway');
    const averageSelector = document.querySelectorAll('.average');

    const message = document.querySelectorAll(".warningText");
    console.log(message[0].innerHTML);

    for(let i=0; i<langleySelector.length; i++) {
         const langley = parseFloat(langleySelector[i].innerText);
         const leeway = parseFloat(leewaySelector[i].innerText);
         const average = parseFloat(averageSelector[i].innerText);

         const estimatedDaysLeft = (langley/average) * 30

         if (!average) {
            message[i].innerHTML = "Still Collecting Data..."
            message[i].classList.toggle('message')
         }

         else if (estimatedDaysLeft > leeway + 10 && estimatedDaysLeft < leeway + 20) {
             cardSelector[i].classList.add('bg-warning');
             message[i].innerHTML = "Warning! Stock low, order in a few days so replenishment may arrive on time."
             message[i].classList.toggle('message')
         }
         else if (langley < 20 && estimatedDaysLeft <=! leeway) {
            cardSelector[i].classList.add('bg-warning');
            message[i].innerHTML = "Warning! Stock low, order soon so replenishment may arrive on time."
            message[i].classList.toggle('message')
         }
         else if (estimatedDaysLeft <= leeway + 10) {
             cardSelector[i].classList.add('bg-danger');
             message[i].innerHTML = "Alert! Stock crucially low, predicted to run out before replenishment."
             message[i].classList.toggle('message')
         }
         else {
             cardSelector[i].classList.add('bg-success');
             console.log("Green Light")
         }
    }   
};

test();