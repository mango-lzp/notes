interface node {
  pre: any
  value: any
  next: any
}

type nodeArgs = Partial<node> & {
  value: any
}

class LinkedListNode {
  value
  pre: LinkedListNode | null = null
  next: LinkedListNode | null = null
  constructor (args: nodeArgs | string) {
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
  head = new LinkedListNode('head')

  constructor (ll: any[]) {
    const nodeList =  ll.map(value => new LinkedListNode({ value }))
    nodeList
      .forEach((node, index, arr) => {
        node.next = arr[index + 1] ?? null
        node.pre = arr[index - 1] ?? null
      })

    const firstNode = nodeList[0]

    this.head.next = firstNode
    return this
  }
  
  public showList() {
    const list = []
    let cur: LinkedListNode | null = this.head
    while(cur !== null){
      list.push(cur.value)
      cur = cur.next
    }
    console.log(list)
    return list
  }

  public reverse() {

  }
}

const ll1 = new LinkedList([1, 2, 3, 5])
console.log(ll1.showList())