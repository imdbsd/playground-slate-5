import { KeyboardEvent } from 'react'
import { Editor } from 'slate'

export type OnKeyDownHandler = (
  event: KeyboardEvent<HTMLDivElement>,
  editor: Editor,
  next: () => void
) => void

type ComposeOnKeyDown = (
  ...handlers: OnKeyDownHandler[]
) => (editor: Editor) => (event: KeyboardEvent<HTMLDivElement>) => void

const composeOnKeyDown: ComposeOnKeyDown = (...handlers) => (editor) => {
  const composed = handlers.reduceRight((sum, handlers) => {
    return (event, editor, next) => {
      return sum(event, editor, () => {
        handlers(event, editor, next)
      })
    }
  })
  return (event) => {
    return composed(event, editor, () => {})
  }
}

export default composeOnKeyDown
