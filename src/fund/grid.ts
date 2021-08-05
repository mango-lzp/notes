const gridPrice = (price, profitLevel = 0.05) => Number((price * (1 + profitLevel)).toFixed(3))

const getGrid = (price) => {
  console.table([
    [1.0, gridPrice(price)]
  ])
}

getGrid(0.676)