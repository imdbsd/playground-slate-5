import * as React from 'react'
import { RenderLeafProps } from 'slate-react'

export type HandlerRenderLeaf = (
  props: RenderLeafProps & { leaf: { type?: string } },
  next: () => JSX.Element
) => JSX.Element

const defaultRenderLeaf = (props: RenderLeafProps) => {
  return <span {...props.attributes}>{props.children}</span>
}

type ComposeRenderLeaf = (
  ...handlers: HandlerRenderLeaf[]
) => (props: RenderLeafProps) => JSX.Element

const composeRenderLeaf: ComposeRenderLeaf = (...handlers) => {
  const composed = handlers.reduceRight(
    (sum, handler): HandlerRenderLeaf => {
      return (props, next) => {
        return handler(props, () => sum(props, next))
      }
    }
  )
  return (props) => {
    return composed(props, () => defaultRenderLeaf(props))
  }
}

export default composeRenderLeaf
