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

// 快速排序   nlogn
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

// 有序度是数组中具有有序关系的元素对的个数。
// 2,4,3,1,5,6 这组数据的有序度为11.
// 冒泡排序的交换次数为逆序度。
// 插入排序移动元素的次数也为逆序度
// 但冒泡排序需要三个赋值操作（元素交换）
// 插入排序只需要一个。
// 插入排序. n^2
const insert_sort = (arr: number[]) => {
  if(arr.length <= 1) return arr

  for(let i = 1; i < arr.length; i++){
    let j = i - 1
    let val = arr[i]
    while(j >= 0){
      if(arr[j] > val){
        arr[j+1] = arr[j--]
      } else {
        break
      }
    }
    //j自减，需要+1
    arr[j+1] = val
  }
  return arr
}

//选择排序，每次选出最小的，交换位置。

// Array.prototype.sort在数组长度26以下会用插入排序，26以上用快速排序


// 计数排序
const count_sort = (arr: number[]) => {
  const max = Math.max(...arr)
  const c = new Array(max + 1).fill(0)

  // 计数
  arr.forEach(i => c[i] ? c[i] += 1 : c[i] = 1)

  // 计数求和
  for(let i = 1; i < c.length; i++) {
    c[i] = c[i] + c[i-1]
  }

  const result = []
  // 倒序遍历，保证排序的稳定性
  for(let i = arr.length -1; i >= 0; i--) {
    result[ --c[arr[i]] ] = arr[i]
  }
  return result
}

export {
  merge,
  merge_sort,
  quick_sort,
  insert_sort,
  count_sort
}