import { Node, Element, Editor, Path } from 'slate'

export const getClosestElement = (
  editor: Editor,
  path: Path,
  blockOnly: Boolean = false
): [Node | Element, Path] | undefined => {
  const ancestors = Node.ancestors(editor, path, { reverse: true })
  for (const [node, path] of ancestors) {
    if (Node.isNode(node) || Element.isElement(node)) {
      return [node, path]
    }
  }
}
