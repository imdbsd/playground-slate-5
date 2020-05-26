import { Text } from 'slate'
import { DecorateHandlers } from '../composeDecorate'
import { getStartMention } from './utils'

const decorate: DecorateHandlers = (
  [node, path],
  prevDecorates,
  editor,
  next
) => {
  const decorates = [...prevDecorates]
  const { selection } = editor
  if (Text.isText(node)) {
    // console.log('mention plugin decorates: ', { decorates })
    const [isMentioning, mentionTo] = getStartMention(editor)
    console.log({ isMentioning, mentionTo })
    if (isMentioning && selection) {
      decorates.push({
        anchor: {
          ...selection.anchor,
          offset: selection.anchor.offset - (mentionTo.length + 1),
        },
        focus: selection.focus,
        type: 'mention-index',
      })
    }
  }
  // console.log('mention decorates', { decorates })
  if (next) return next([node, path], decorates, editor)
  return decorates
}

export default decorate
