import { Node } from 'slate'
import { OnChangeHandler } from '../composeOnChange'

type Options = {
  isShowModal: boolean
  onShowModal: () => void
  onCloseModal: () => void
}

type OnChange = (options: Options) => OnChangeHandler
const onChange: OnChange = (options) => (value, editor, next) => {
  console.log({ options })
  if (value.length > 2) {
    options.onShowModal()
  }
  return next(value)
}

export default onChange
