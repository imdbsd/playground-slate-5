import { Editor, Range, Node } from 'slate'
import { getClosestElement } from '../shared'

const MENTION_START_CAPTURE_REGEX = /@(\S*)$/

type StartMention = [boolean, string]
export const getStartMention = (editor: Editor): StartMention => {
  const { selection } = editor
  if (selection) {
    const [start] = Range.edges(selection)
    const [closestElement] = getClosestElement(editor, start.path) || []
    if (closestElement && Node.isNode(closestElement)) {
      const content = Node.string(closestElement)
      // console.log({ content })
      const textBeforeCursor = content.substr(0, start.offset)
      const result = MENTION_START_CAPTURE_REGEX.exec(textBeforeCursor)
      // console.log('get start mention result', { result })

      return result ? [true, result[1]] : [false, '']
    }
  }
  return [false, '']
}
