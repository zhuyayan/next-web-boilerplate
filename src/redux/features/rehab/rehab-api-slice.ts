export interface RSMenuItem {
  id: number;
  name: string;
  path: string;
  icon: string;
  children: RSMenuItem[];
}

function ValidateDepth(menu: RSMenuItem, depth: number = 0): boolean {
  // 如果深度大于3，则返回false
  if (depth > 3) return false;

  // 如果没有子项，表示已经是最深的级别，直接返回true
  if (!menu.children || menu.children.length === 0) return true;

  // 对于每一个子项，进行递归检查
  for (let child of menu.children) {
    if (!ValidateDepth(child, depth + 1)) {
      return false;
    }
  }
  return true;
}
