// 合并俩个有序数组。
const merge = (arr1: number[], arr2: number[]) => {
  const sortedArr = []
  let i = 0, j = 0

  while(i < arr1.length || j < arr2.length) {
    if(i === arr1.length){
      sortedArr.push(...arr2.slice(j))
      //结束循环，将剩下的全部放入数组
      break
    }
    if(j === arr2.length){
      sortedArr.push(...arr1.slice(i))
      break
    }
    arr1[i] > arr2[j] ? sortedArr.push(arr2[j++]) : sortedArr.push(arr1[i++])
  }

  return sortedArr
}

// 归并排序
const merge_sort = (arr: number[]) => {
  const _merge_sort = (arr: number[], startIndex: number, endIndex: number) => {
    if(startIndex >= endIndex) return [arr[endIndex]]
  
    const middleIndex = Math.floor((endIndex + startIndex) / 2)
  
    return merge(_merge_sort(arr, startIndex, middleIndex), _merge_sort(arr, middleIndex + 1, endIndex))
  }
  return _merge_sort(arr, 0, arr.length - 1)
}


export {
  merge,
  merge_sort
}