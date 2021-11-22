

const useReplacer = (replaceStr: string, indexList?: number[]) => {
  let count = 1
  const replacer = match => {
    const _r = () => indexList.includes(count++) ? replaceStr : match
    return indexList === void 0 ? replaceStr : _r()
  }
  return replacer
}

const str = '云主机aaabbbccc云主机55云主机'
const replacer = useReplacer('物理机', [1, 2])
console.log(str.replace(/云主机/g, replacer))