import * as React from 'react'
import { createEditor, Node } from 'slate'
import { Slate, Editable, withReact } from 'slate-react'

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
  const editor = React.useMemo(() => withReact(createEditor()), [])

  return (
    <Slate
      editor={editor}
      value={editorValue}
      onChange={handleChangeEditorValue}
    >
      <Editable />
    </Slate>
  )
}

export default Editor
