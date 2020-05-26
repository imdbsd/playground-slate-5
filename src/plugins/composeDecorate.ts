import { Range, Editor, Node, Path, NodeEntry } from 'slate'

const defaultDecorate: Range[] = []

export type DecorateNodeEntry = [Node, Path]

export type DecorateHandlers = (
  [node, path]: NodeEntry<Node>,
  decorates: Range[],
  editor: Editor,
  next?: (entry: NodeEntry<Node>, decorates: Range[], editor: Editor) => Range[]
) => Range[]

const noDecorate: DecorateHandlers = ([node, path], decorates, editor) => {
  console.log('no Decorate', { entry: [node, path], decorates, editor })
  return decorates || defaultDecorate
}

type ComposeDecorate = (
  ...handlers: DecorateHandlers[]
) => (editor: Editor) => (entry: NodeEntry<Node>) => Range[]

const composeDecorate: ComposeDecorate = (...handlers) => (editor) => {
  const composed = handlers.reduceRight((sum, handler): DecorateHandlers => {
    console.log({ sum, handler })
    return (nodeEntry, decorate, editor, next) => {
      console.log({ nodeEntry, decorate, editor, next })
      return handler(
        nodeEntry,
        decorate,
        editor,
        (_nodeEntry, decorate, _editor) =>
          sum(_nodeEntry, decorate, _editor, next)
      )
    }
  }, noDecorate)
  return (nodeEntry) => {
    console.log({ nodeEntry })
    return composed(nodeEntry, defaultDecorate, editor, noDecorate)
  }
}

export default composeDecorate
