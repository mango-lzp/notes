// const date1000 = 2005 // 2004.12.31
const today = new Date()
const thisMonth = today.getMonth() + 1
const getMonths = (date: string = '2004-12') => {
  const [dateYear, dateMonth] = date.split('-').map(Number)
  const months = (today.getFullYear() - dateYear) * 12 + thisMonth - dateMonth
  return months
}

const getCMGR_By_CAGR = (cagr: number) => Math.pow(1 + cagr, 1/12)// get Compound Month Growth Rate from Compound Annual Growth Rate

const getIndex = (cagr: number, date?: string, price: number = 1000) => {
  const cmgr = getCMGR_By_CAGR(cagr)
  const months = getMonths(date)
  const result = price * Math.pow((cmgr), months)
  return Math.floor(result)
}

const CAGR_UP = 0.11 // Compound Annual Growth Rate
const CAGR_MID = 0.1
const CAGR_DOWN = 0.09

const IndexUp = getIndex(CAGR_UP)
const IndexMid = getIndex(CAGR_MID)
const IndexDown = getIndex(CAGR_DOWN)

const getCAGR_By_Price = (price: number, date?: string, priceAt: number = 1000) => {
  const months = getMonths(date)
  const times = price / priceAt

  const cmgr = Math.pow(times, 1 / months)
  const cagr = Math.pow(cmgr, 12)
  return Number((cagr - 1).toFixed(4))
}

const Tencent = ['2016-8', 196] as const
const TencentCAGR2 = getCAGR_By_Price(773, ...Tencent)
const TencentCAGR3 = getCAGR_By_Price(420, ...Tencent)
const TenCentPriceLow = getIndex(TencentCAGR3, ...Tencent)
const TenCentPriceHigh = getIndex(TencentCAGR2, ...Tencent)

console.log(IndexUp, IndexMid, IndexDown)
console.log(TencentCAGR3, TencentCAGR2, TenCentPriceLow, TenCentPriceHigh)
