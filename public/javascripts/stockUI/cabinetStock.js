
function stockStatus() {
    const cardSelector = document.querySelectorAll('.card-display');
    const stockSelector = document.querySelectorAll('.stock');
    const leadTimeSelector = document.querySelectorAll('.leadTime');
    const averageSelector = document.querySelectorAll('.average');

    const message = document.querySelectorAll(".warningText");
    console.log(message[0].innerHTML);

    for(let i=0; i<stockSelector.length; i++) {
         const stock = parseFloat(stockSelector[i].innerText);
         const leadTime = parseFloat(leadTimeSelector[i].innerText);
         const average = parseFloat(averageSelector[i].innerText);

         const estimatedDaysLeft = (stock/average) * 30

         if (!average) {
            message[i].innerHTML = "Still Collecting Data..."
            message[i].classList.toggle('message')
         }

         else if (estimatedDaysLeft > leadTime + 10 && estimatedDaysLeft < leadTime + 20) {
             cardSelector[i].classList.add('bg-warning');
             message[i].innerHTML = "Warning! Stock low, order in a few days so replenishment may arrive on time."
             message[i].classList.toggle('message')
         }
         else if (stock < 20 && estimatedDaysLeft <=! leadTime) {
            cardSelector[i].classList.add('bg-warning');
            message[i].innerHTML = "Warning! Stock low, order soon so replenishment may arrive on time."
            message[i].classList.toggle('message')
         }
         else if (estimatedDaysLeft <= leadTime + 10) {
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

stockStatus();