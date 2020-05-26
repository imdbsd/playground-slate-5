import * as React from 'react'
import { createEditor, Node } from 'slate'
import { Slate, Editable, withReact } from 'slate-react'
import { withHistory } from 'slate-history'
import { composeDecorate } from './plugins'
import { decorate as decorateMention } from './plugins/mention-plugin'

const Editor = () => {
  console.log('editor comp')
  const [editorValue, setEditorValue] = React.useState<Node[]>([
    {
      type: 'paragraph',
      children: [{ text: 'A line of text in a paragraph.' }],
    },
  ])
  const handleChangeEditorValue = (value: Node[]) => {
    setEditorValue(value)
  }

  const composedDecorate = composeDecorate(decorateMention)

  const editor = React.useMemo(() => withHistory(withReact(createEditor())), [])

  const handleDecorate = composedDecorate(editor)

  return (
    <Slate
      editor={editor}
      value={editorValue}
      onChange={handleChangeEditorValue}
    >
      <Editable decorate={handleDecorate} />
    </Slate>
  )
}

export default Editor
