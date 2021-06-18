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
  const _merge_sort = (_arr: number[], startIndex: number, endIndex: number) => {
    if(startIndex >= endIndex) return [_arr[endIndex]]
  
    const middleIndex = Math.floor((endIndex + startIndex) / 2)
  
    return merge(_merge_sort(_arr, startIndex, middleIndex), _merge_sort(_arr, middleIndex + 1, endIndex))
  }

  return _merge_sort(arr, 0, arr.length - 1)
}

const quick_sort = (arr: number[]) => {
  if(arr.length <= 1) return arr
  const index = Math.floor(arr.length / 2)

  const point = arr.splice(index, 1)[0]
  const less = arr.filter(v => v <= point)
  const greater = arr.filter(v => v > point)
  
  return [...quick_sort(less), point, ...quick_sort(greater)]

  // 原地快排（不占用额外内存,非稳定排序）
  // if(arr.length <= 1) return arr
  // const index = Math.floor(arr.length / 2)
  // const point = arr[index]
  // let j = 0
  // for(let i = 0; i < arr.length; i++){
  //   if(arr[i] < point){
  //     // 从j=0开始交换，j下标之前的，都是比point小的
  //     [arr[j], arr[i]] = [arr[i], arr[j]]
  //     j++
  //   }
  // }
  // return [...quick_sort(arr.slice(0, j)), point, ...quick_sort(arr.slice(j + 1, arr.length))]
}

export {
  merge,
  merge_sort,
  quick_sort
}