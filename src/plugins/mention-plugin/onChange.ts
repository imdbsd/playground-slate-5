import { OnChangeHandler } from '../composeOnChange'
import { getStartMention } from './utils'

type Options = {
  isShowModal: boolean
  onShowModal: () => void
  onCloseModal: () => void
}

type OnChange = (options: Options) => OnChangeHandler
const onChange: OnChange = (options) => (value, editor, next) => {
  const [isMentioning] = getStartMention(editor)
  if (isMentioning) {
    options.onShowModal()
  } else {
    options.onCloseModal()
  }
  return next(value)
}

export default onChange
