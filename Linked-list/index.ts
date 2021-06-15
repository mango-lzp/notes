interface node {
  pre: any
  value: any
  next: any
}

type nodeArgs = Partial<node> & {
  value: any
}

type INode = LinkedListNode | number | string
type INodes = INode | LinkedListNode[]

class LinkedListNode {
  value
  pre: LinkedListNode | null = null
  next: LinkedListNode | null = null
  constructor (args: nodeArgs | string | number) {
    if(typeof args === 'string'){
      this.value = args
    } else {
      // this.value = args.value
      // this.pre = args.pre ?? null
      // this.next = args.next ?? null
      Object.entries(args).forEach(([key, value]) => {
        this[key as 'next'] = value ?? null
      })
    }
    return this
  }

}

class LinkedList{
  private head = new LinkedListNode('head')
  private end = new LinkedListNode('end')

  constructor (ll: any[]) {
    this.head.next = this.end
    this.end.pre = this.head
    const nodeList =  ll.map(value => new LinkedListNode({ value }))
    this.insert(nodeList)
    return this
  }

  public isNode(node: any) {
    return !!node?.value
  }
  
  public showList(showHE = false) {
    const list = []
    let cur: LinkedListNode | null = showHE ? this.head : this.head.next
    while((showHE ? cur : cur?.next) !== null){
      list.push(cur?.value)
      cur = cur?.next ?? null
    }
    return list
  }

  private _insert (node: LinkedListNode) {
    this.end.pre!.next = node
    node.pre = this.end.pre

    node.next = this.end
    this.end.pre = node
  }

  private _arrInsert (nodeList: LinkedListNode[]) {
    nodeList.forEach((node, index, arr) => {
      node.pre = arr[index - 1] ?? this.end.pre
      node.next = arr[index + 1] ?? this.end
    })

    this.end.pre!.next = nodeList[0]
    this.end.pre = nodeList[nodeList.length - 1]
  }

  public insert (node: INodes) {
    if(Array.isArray(node)){
      this._arrInsert(node)
    } else {
      if(['number', 'string'].includes(typeof node)){
        this._insert(new LinkedListNode(node))
      } else {
        this._insert(node as LinkedListNode)
      }
    }
  }

  public find (node: INode) {
    let cur: LinkedListNode | null = this.head
    let val = this.isNode(node) ? (node as LinkedListNode).value : node
    while(cur !== null && cur.value !== val){
      cur = cur.next
    }
    return cur
  }

  public remove (node: INode) {
    const _node = this.find(node)
    if(_node === null) return console.log('node cant be found')
    if(_node.pre === null){
      return console.log('cant remove head')
    }
    if(_node.next === null){
      return console.log('cant remove end')
    }
    if(_node){
      _node.pre!.next = _node.next
      _node.next!.pre = _node.pre
    } else {
      console.log('node no found')
    }
  }

  public reverse() {
    
  }
}

const ll1 = new LinkedList([1, 2, 3, 5])
// ll1.remove(5)
// ll1.remove(6)
ll1.remove(ll1.find('head') as LinkedListNode)
console.log(ll1.showList())
console.log(ll1.showList(true))