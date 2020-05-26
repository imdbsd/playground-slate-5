import { Node, Editor } from 'slate'

export type OnChangeHandler = (value: Node[], next: () => void) => void

type ComposeOnChange = (
  ...handlers: OnChangeHandler[]
) => (editor: Editor) => (value: Node[]) => void
const composeOnChange: ComposeOnChange = (...handlers) => (editor) => {
  const composed = handlers.reduceRight((sum, reduce) => {
    return (value, next) => sum(value, () => reduce(value, next))
  })
  return (value) => {
    return composed(value, () => {})
  }
}

export default composeOnChange
