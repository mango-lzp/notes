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

let arr = [1,2,3,5,8,9,15,60]

bsearch(arr, 5)
