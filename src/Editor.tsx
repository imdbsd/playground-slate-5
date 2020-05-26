import * as React from 'react'
import { createEditor, Node, Editor } from 'slate'
import { Slate, Editable, withReact } from 'slate-react'
import { withHistory } from 'slate-history'
import { composeDecorate, composeOnChange, composeRenderLeaf } from './plugins'
import {
  onChange as _onChangeMention,
  decorate as decorateMention,
  renderLeaf as renderLeafMention,
} from './plugins/mention-plugin'

type ModalType = {
  modal: { type: 'MENTION_MODAL' }
}

const AppEditor = () => {
  console.log('editor comp')
  const [showModal, setShowModal] = React.useState<ModalType | null>(null)
  const [editorValue, setEditorValue] = React.useState<Node[]>([
    {
      type: 'paragraph',
      children: [{ text: 'A line of text in a paragraph.' }],
    },
  ])
  const handleChangeEditorValue = (
    value: Node[],
    editor: Editor,
    next: (value: Node[]) => void
  ) => {
    console.log({ value })
    next(value)
  }

  const composedDecorate = composeDecorate(decorateMention)
  const composedOnChange = composeOnChange(
    handleChangeEditorValue,
    _onChangeMention({
      isShowModal: !!showModal,
      onShowModal: () => {
        setShowModal({
          modal: { type: 'MENTION_MODAL' },
        })
      },
      onCloseModal: () => {
        setShowModal(null)
      },
    })
  )

  const editor = React.useMemo(() => withHistory(withReact(createEditor())), [])

  const handleDecorate = React.useMemo(() => composedDecorate(editor), [
    composedDecorate,
    editor,
  ])
  const handlerRenderLeaf = React.useMemo(
    () => composeRenderLeaf(renderLeafMention),
    []
  )
  const handleOnChange = composedOnChange(editor, (value) => {
    setEditorValue(value)
  })

  return (
    <Slate editor={editor} value={editorValue} onChange={handleOnChange}>
      <Editable decorate={handleDecorate} renderLeaf={handlerRenderLeaf} />
    </Slate>
  )
}

export default AppEditor
