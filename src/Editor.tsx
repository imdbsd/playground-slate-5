import * as React from 'react'
import { createEditor, Node, Editor } from 'slate'
import { Slate, Editable, withReact } from 'slate-react'
import { withHistory } from 'slate-history'
import {
  composeDecorate,
  composeOnChange,
  composeOnKeyDown,
  composeRenderLeaf,
} from './plugins'
import {
  decorate as decorateMention,
  onChange as _onChangeMention,
  onKeyDown as onKeyDownMention,
  renderLeaf as renderLeafMention,
} from './plugins/mention-plugin'
import MentionModal from './components/MentionModal'

type ModalType = {
  modal: {
    type: 'MENTION_MODAL'
    data: {
      activeIndex: number
    }
  }
}

const AppEditor = () => {
  console.log('editor comp')
  const mentionAnchorRef = React.useRef<HTMLAnchorElement>(null)
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
          modal: {
            type: 'MENTION_MODAL',
            data: {
              activeIndex: 0,
            },
          },
        })
      },
      onCloseModal: () => {
        setShowModal(null)
      },
    })
  )

  const handlePressUpInModal = React.useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>): void => {
      event.preventDefault()
      setShowModal({
        modal: {
          type: 'MENTION_MODAL',
          data: {
            activeIndex: showModal ? showModal.modal.data.activeIndex - 1 : 0,
          },
        },
      })
    },
    [showModal]
  )
  const handlePressDownInModal = React.useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>): void => {
      event.preventDefault()
      setShowModal({
        modal: {
          type: 'MENTION_MODAL',
          data: {
            activeIndex: showModal ? showModal.modal.data.activeIndex + 1 : 0,
          },
        },
      })
    },
    [showModal]
  )
  const handlePressEnterInModal = React.useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>): void => {
      event.preventDefault()
      console.log(showModal)
    },
    [showModal]
  )
  const composedOnKeyDown = composeOnKeyDown(
    onKeyDownMention({
      onPressUpInModal: handlePressUpInModal,
      onPressDownInModal: handlePressDownInModal,
      onPressEnterInModal: handlePressEnterInModal,
    })
  )

  const editor = React.useMemo(() => withHistory(withReact(createEditor())), [])

  const handleDecorate = React.useMemo(() => composedDecorate(editor), [
    composedDecorate,
    editor,
  ])
  const handlerRenderLeaf = React.useMemo(
    () => composeRenderLeaf(renderLeafMention({ mentionAnchorRef })),
    [mentionAnchorRef]
  )
  const handleOnChange = composedOnChange(editor, (value) => {
    setEditorValue(value)
  })
  const handleOnKeyDown = React.useMemo(() => composedOnKeyDown(editor), [
    composedOnKeyDown,
    editor,
  ])

  return (
    <React.Fragment>
      <Slate editor={editor} value={editorValue} onChange={handleOnChange}>
        <Editable
          decorate={handleDecorate}
          onKeyDown={handleOnKeyDown}
          renderLeaf={handlerRenderLeaf}
        />
      </Slate>
      <MentionModal
        editor={editor}
        anchorRef={mentionAnchorRef}
        selectionIndex={showModal ? showModal.modal.data.activeIndex : null}
      />
    </React.Fragment>
  )
}

export default AppEditor
