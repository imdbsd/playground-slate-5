import { Node, Editor } from 'slate'

export type OnChangeHandler = (
  value: Node[],
  editor: Editor,
  next: (value: Node[]) => void
) => void

type ComposeOnChange = (
  ...handlers: OnChangeHandler[]
) => (
  editor: Editor,
  setValue: (value: Node[]) => void
) => (value: Node[]) => void
const composeOnChange: ComposeOnChange = (...handlers) => (
  editor,
  setValue
) => {
  const composed = handlers.reduceRight((sum, reduce) => {
    return (value, editor, next) =>
      sum(value, editor, (value) => reduce(value, editor, next))
  })
  return (value) => {
    return composed(value, editor, (value) => {
      setValue(value)
    })
  }
}

export default composeOnChange
