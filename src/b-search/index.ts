const bsearch = (arr: number[], target: number) => {
  let middleIndex = Math.floor(arr.length / 2)
  
  const _bsearch = (_arr: number[], _target: number) => {
    let _middleIndex = Math.floor(_arr.length / 2)
    let point = _arr[_middleIndex]

    if(point === _target) return middleIndex

    if(point > _target){
      middleIndex -=  Math.floor(_middleIndex/2) || 1
      return _bsearch(_arr.slice(0, _middleIndex), _target)
    } else {
      middleIndex +=  Math.floor(_middleIndex/2) || 1
      return _bsearch(_arr.slice(_middleIndex, _arr.length), _target)
    }
  }

  return _bsearch(arr, target)
}

const bsearch_nice = (arr: number[], target: number) => {

  const _bsearch = (low: number, high: number, target: number) => {
    if(low > high) return -1
    
    let mid = Math.floor(low + (high - low)/2)
    if(arr[mid] === target) return mid

    return arr[mid] < target ? _bsearch(mid + 1, high, target) : _bsearch(low, mid - 1, target)
  }
  return _bsearch(0, arr.length -1, target)
}

let arr = [1,2,3,5,8,9,15,60]
console.time('bsearch')
console.log(bsearch(arr, 60))
console.time('bsearch_nice')
console.timeEnd('bsearch')
console.log(bsearch_nice(arr, 60))
console.timeEnd('bsearch_nice')
