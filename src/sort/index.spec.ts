import { merge, merge_sort } from './index'

const testMerge = () => {
  const arr1 = [1, 2, 3, 8, 9, 15]
  const arr2 = [5, 8, 9, 15, 20]
  const result = merge(arr1, arr2).toString() === '1,2,3,5,8,8,9,9,15,15,20'
  result ? console.log('merge pass') : console.error('merge failed')
}

testMerge()

const testMergeSort = () => {
  const arr = [1,2,6,10,8,5]
  const result = merge_sort(arr).toString() === '1,2,5,6,8,10'
  result ? console.log('merge-sort pass') : console.error('merge-sort failed')
}

testMergeSort()