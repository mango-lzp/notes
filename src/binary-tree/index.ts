interface TreeNode {
  left: TreeNode
  right: TreeNode
  value: any
}

class TreeNode {
  constructor (value) {
    this.value = value
  }
}

const printNode = (treeNode: TreeNode) => {
  console.log(treeNode.value)
}

const preOrder = (bTree: TreeNode) => {
  printNode(bTree)

  if(bTree.left) {
    preOrder(bTree.left)
  }
  if(bTree.right) {
    preOrder(bTree.right)
  }
}

const treeLike = {
  value: 'A',
  left: {
    value: 'B',
    left: {
      value: 'D'
    },
    right: {
      value: 'E'
    }
  }
}

const tree = new TreeNode('A')
tree.left = new TreeNode('B')
tree.right = new TreeNode('C')
tree.left.left = new TreeNode('D')
tree.left.right = new TreeNode('E')
tree.right.left = new TreeNode('F')
tree.right.right = new TreeNode('G')

preOrder(tree)