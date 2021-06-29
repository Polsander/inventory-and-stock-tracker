// const cabinetStocks = await Stock.find({cabinet:{$size: 1}}); //this will only select cabinet stocks (not unit)
//     console.log(cabinetStocks);
//     console.log('stocks that pertain to cabinets^');

let counter = 0

function update() {
    counter ++
    console.log(counter);

}

setInterval(update, 1000*3);