import * as React from 'react'
import { HandlerRenderLeaf } from '../composeRenderLeaf'

const renderLeaf: HandlerRenderLeaf = (props, next) => {
  const { leaf } = props
  console.log({ props })
  switch (leaf.type) {
    case 'mention-index': {
      console.log('masuk cuk')
      return (
        <a
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
