import { Editor, Element } from 'slate'

const inLineList = ['link', 'kumslate-mention']

const withCore = <T extends Editor>(editor: T) => {
  const { isInline } = editor

  editor.isInline = (element: Element): boolean => {
    return (
      (typeof element.type === 'string' && inLineList.includes(element.type)) ||
      isInline(element)
    )
  }
  return editor
}

export default withCore
