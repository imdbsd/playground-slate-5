import { KeyboardEvent } from 'react'
import { OnKeyDownHandler } from '../composeOnKeyDown'
import { getStartMention } from './utils'

type Options = {
  onPressUpInModal: (event: KeyboardEvent<HTMLDivElement>) => void
  onPressDownInModal: (event: KeyboardEvent<HTMLDivElement>) => void
  onPressEnterInModal: (event: KeyboardEvent<HTMLDivElement>) => void
}

type Handler = (options: Options) => OnKeyDownHandler

const onKeyDown: Handler = (options) => (event, editor, next) => {
  const [isMentioning] = getStartMention(editor)
  if (isMentioning) {
    switch (event.key) {
      case 'ArrowUp': {
        return options.onPressUpInModal(event)
      }
      case 'ArrowDown': {
        return options.onPressDownInModal(event)
      }
      case 'Enter': {
        return options.onPressEnterInModal(event)
      }
    }
  }
  return next()
}

export default onKeyDown
