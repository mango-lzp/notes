interface node {
  value: any
  next: any
}

type INode = number | string | null

class LinkedListNode {
  value: number | string | null
  next: LinkedListNode | null = null
  constructor (value: null | string | number) {
    this.value = value
    return this
  }
}

class LinkedList{
  private head = new LinkedListNode(null)

  constructor (ll: any[]) {
    this.insert(ll)
    return this
  }

  public isNode(node: any) {
    return !!node?.value
  }
  
  public showList(showHE = false) {
    const list = []
    let cur: LinkedListNode | null = showHE ? this.head : this.head.next
    while(cur !== null){
      list.push(cur?.value)
      cur = cur?.next ?? null
    }
    return list
  }

  private _insert (node: INode) {
    const _node = new LinkedListNode(node)
    let cur = this.head!

    while((cur.next !== null) && (node! >= cur.value!)){
      cur = cur.next
    }
    [_node.next, cur.next] = [cur.next, _node]
  }

  private _arrInsert (nodeList: INode[]) {
    nodeList.forEach(node => this._insert(node))
  }

  public insert (node: INode[]) {
    if(Array.isArray(node)){
      this._arrInsert(node)
    } else {
      this._insert(node)
    }
  }

  public find (node: INode | LinkedListNode, preIndex = 0) {
    const findList = []
    let cur: LinkedListNode | null = this.head
    let val = this.isNode(node) ? (node as LinkedListNode).value : node
    while(cur !== null && cur.value !== val){
      cur = cur.next
      findList.unshift(cur)
    }
    return cur?.value === val ? findList[preIndex as 0] : null
  }

  public remove (node: INode) {
    const preNode = this.find(node, 1)
    if(preNode === null) return console.log('node cant be found')
    preNode.next = preNode.next!.next
  }

  public reverse() {
    // 无节点，无需反转
    if(this.head.next === null) return

    let cur = this.head.next
    let pre = this.head

    while(cur !== null){
      const next = cur.next
      // 头节点置空
      cur.next = pre.value ? pre : null
      pre = cur;
      cur = next!;
      // [cur, cur!.next] = [cur.next as LinkedListNode, pre]   //node的解构赋值有问题,行为预期不同上面
    }

    this.head.next = pre
  }
}
const ll1 = new LinkedList([1, 2, 3, 5])
ll1.remove(5)
ll1.remove(6)
ll1.reverse()
console.log(ll1.showList())

// 模块化使得ts不报标识符重复的错误
export {}