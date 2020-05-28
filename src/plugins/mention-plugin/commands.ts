import { Editor, Transforms } from 'slate'
import { User } from './index'
import { getStartMention } from './utils'

export const insertMention = (editor: Editor, user: User): void => {
  const [isMentioning, mentionTo] = getStartMention(editor)
  console.log('insertM Mention', isMentioning)
  if (isMentioning && editor.selection) {
    console.log('selection', editor.selection)
    console.log({ user })
    const position = {
      anchor: {
        ...editor.selection.anchor,
        offset: editor.selection.anchor.offset - (mentionTo.length + 1),
      },
      focus: editor.selection.focus,
    }
    Transforms.delete(editor, {
      at: position,
    })
    Transforms.insertNodes(editor, [
      {
        type: 'kumslate-mention',
        children: [
          {
            text: user.name,
          },
        ],
      },
    ])
  }
}
