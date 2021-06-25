// this code is to confirm values inputted into the modals

function modalValue() {
    document.querySelector("#modal-submit").onclick = () => {
        const url = window.location.pathname.split("/");
        const field = document.querySelector("input#langley.form-control");
        //field.value captures the numerical value the user inputted

        if(url[1] === "in" && url[2] === "cabinets") {
            const cabinetName = document.querySelector("#cabinetName").value
            document.querySelector(".modal-body").innerHTML = `Are you sure you want to take <strong> IN </strong> ${field.value} ${cabinetName} cabinets?`
        }

        if(url[1] === "in" && url[2] === "units") {
            const unitName = document.querySelector("#unitName").value
            document.querySelector(".modal-body").innerHTML = `Are you sure you want to take <strong> IN </strong> ${field.value} ${unitName} units?`
        }

        if(url[1] === "out" && url[2] === "cabinets") {
            const cabinetName = document.querySelector("#cabinetName").value
            document.querySelector(".modal-body").innerHTML = `Are you sure you want to send <strong> OUT </strong> ${field.value} ${cabinetName} cabinets?`
        }

        if(url[1] === "out" && url[2] === "units") {
            const unitName = document.querySelector("#unitName").value
            document.querySelector(".modal-body").innerHTML = `Are you sure you want to take <strong> OUT </strong> ${field.value} ${unitName} units?`
        }
    };
}

modalValue();