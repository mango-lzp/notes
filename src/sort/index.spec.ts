import { merge, merge_sort, quick_sort } from './index'

const testMerge = () => {
  const arr1 = [1, 2, 3, 8, 9, 15]
  const arr2 = [5, 8, 9, 15, 20]
  const result = merge(arr1, arr2).toString() === '1,2,3,5,8,8,9,9,15,15,20'
  result ? console.log('merge pass') : console.error('merge failed')
}
testMerge()

const testMergeSort = () => {
  console.time('merge-sort')
  const arr = [1,2,6,10,8,5]
  const result = merge_sort(arr).toString() === '1,2,5,6,8,10'
  result ? console.log('merge-sort pass') : console.error('merge-sort failed')
  console.timeEnd('merge-sort')
}
testMergeSort()

const testQuickSort = () => {
  console.time('quick-sort')
  const arr = [1,2,6,10,8,5]
  const result = quick_sort(arr).toString() === '1,2,5,6,8,10'
  result ? console.log('quick-sort pass') : console.error('quick-sort failed')
  console.timeEnd('quick-sort')
}
testQuickSort()