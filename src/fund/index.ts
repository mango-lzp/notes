const date1000 = 2005 // 2004.12.31
const today = new Date()
const thisMonth = today.getMonth() + 1
const months = (today.getFullYear() - date1000) * 12 + thisMonth

const getCMGR = (cagr: number) => Math.pow(1 + cagr, 1/12)// get Compound Month Growth Rate from Compound Annual Growth Rate

const getIndex = (cagr: number) => {
  const cmgr = getCMGR(cagr)
  const result = 1000 * Math.pow((cmgr), months)
  return Math.floor(result)
}

const CAGR_UP = 0.11 // Compound Annual Growth Rate
const CAGR_MID = 0.1
const CAGR_DOWN = 0.09

const IndexUp = getIndex(CAGR_UP)
const IndexMid = getIndex(CAGR_MID)
const IndexDown = getIndex(CAGR_DOWN)

console.log(IndexUp, IndexMid, IndexDown)