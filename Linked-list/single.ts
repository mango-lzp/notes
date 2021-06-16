interface node {
  value: any
  next: any
}

type INode1 = number | string | null

class LinkedListNode1 {
  value: number | string | null
  next: LinkedListNode1 | null = null
  constructor (value: null | string | number) {
    this.value = value
    return this
  }
}

class LinkedList1{
  private head = new LinkedListNode1(null)

  constructor (ll: any[]) {
    this.insert(ll)
    return this
  }

  public isNode(node: any) {
    return !!node?.value
  }
  
  public showList(showHE = false) {
    const list = []
    let cur: LinkedListNode1 | null = showHE ? this.head : this.head.next
    while(cur !== null){
      list.push(cur?.value)
      cur = cur?.next ?? null
    }
    return list
  }

  private _insert (node: INode1) {
    const _node = new LinkedListNode1(node)
    let cur = this.head!

    while((cur.next !== null) && (node! >= cur.value!)){
      cur = cur.next
    }
    [_node.next, cur.next] = [cur.next, _node]
  }

  private _arrInsert (nodeList: INode1[]) {
    nodeList.forEach(node => this._insert(node))
  }

  public insert (node: INode1[]) {
    if(Array.isArray(node)){
      this._arrInsert(node)
    } else {
      this._insert(node)
    }
  }

  public find (node: INode1 | LinkedListNode1, preIndex = 0) {
    const findList = []
    let cur: LinkedListNode1 | null = this.head
    let val = this.isNode(node) ? (node as LinkedListNode1).value : node
    while(cur !== null && cur.value !== val){
      cur = cur.next
      findList.unshift(cur)
    }
    return cur?.value === val ? findList[preIndex as 0] : null
  }

  public remove (node: INode1) {
    const preNode = this.find(node, 1)
    if(preNode === null) return console.log('node cant be found')
    preNode.next = preNode.next!.next
  }

  public reverse() {
    // 无节点，无需反转
    if(this.head.next === null) return

    let cur = this.head.next!

    // while(cur.pre !== null){
    //   [cur.next, cur.pre] = [cur.pre, cur.next]
    //   cur = cur.pre as LinkedListNode1
    // }
    // if(cur.pre === null){
    //   cur.pre = this.head
    // }
    if(cur.next?.value === 'head'){
      cur.next = null
    }
  }
}

const ll11 = new LinkedList1([1, 2, 3, 5])
ll11.remove(5)
ll11.remove(6)
// ll1.reverse()
console.log(ll11.showList())