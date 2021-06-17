/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 * 2021年05月30日23:06
 */
/**
 * @param {TreeNode} root
 * @return {void} Do not return anything, modify root in-place instead.
 */ 
 var flatten = function(root) {
    if(root===null) return null
    // 先序遍历
    return traverse(root , traverse(root.right) );
};

function traverse(root , temp ){
    if(root === null){return null}

    if(root.left !== null){
        return traverse(root.left, traverse(root.right))
    }else if(root.right !== null){
        return traverse(root.right);
    }else{
        root.right = temp
        return root;
    }
}


