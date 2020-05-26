import * as React from 'react'
import { createEditor, Node } from 'slate'
import { Slate, Editable, withReact } from 'slate-react'
import { withHistory } from 'slate-history'
import { composeDecorate, composeOnChange, composeRenderLeaf } from './plugins'
import {
  decorate as decorateMention,
  renderLeaf as renderLeafMention,
} from './plugins/mention-plugin'

const Editor = () => {
  console.log('editor comp')
  const [editorValue, setEditorValue] = React.useState<Node[]>([
    {
      type: 'paragraph',
      children: [{ text: 'A line of text in a paragraph.' }],
    },
  ])
  const handleChangeEditorValue = (value: Node[]) => {
    console.log({ value })
    setEditorValue([...value])
  }

  const composedDecorate = composeDecorate(decorateMention)
  const composedOnChange = composeOnChange(handleChangeEditorValue)

  const editor = React.useMemo(() => withHistory(withReact(createEditor())), [])

  const handleDecorate = React.useMemo(() => composedDecorate(editor), [
    composedDecorate,
    editor,
  ])
  const handlerRenderLeaf = React.useMemo(
    () => composeRenderLeaf(renderLeafMention),
    []
  )
  const handleOnChange = composedOnChange(editor)

  return (
    <Slate editor={editor} value={editorValue} onChange={handleOnChange}>
      <Editable decorate={handleDecorate} renderLeaf={handlerRenderLeaf} />
    </Slate>
  )
}

export default Editor
