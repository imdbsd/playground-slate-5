import * as React from 'react'
import { HandlerRenderLeaf } from '../composeRenderLeaf'

type Options = {
  mentionAnchorRef: React.RefObject<HTMLAnchorElement>
}

type Handler = (options: Options) => HandlerRenderLeaf

const renderLeaf: Handler = (options) => (props, next) => {
  const { leaf } = props
  switch (leaf.type) {
    case 'mention-index': {
      return (
        <a
          ref={options.mentionAnchorRef}
          href="https://kumparan.com"
          className="mention-context"
          {...props.attributes}
        >
          <strong>{props.children}</strong>
        </a>
      )
    }
  }
  return next()
}
export default renderLeaf
