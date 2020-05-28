import * as React from 'react'
import { createEditor, Node, Editor, Transforms } from 'slate'
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
  commands as commandsMention,
  User,
} from './plugins/mention-plugin'
import withCorePlugin from './plugins/core-plugin'
import MentionModal from './components/MentionModal'
import { CHARACTERS } from './utils'

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
  const editor = React.useMemo(
    () => withCorePlugin(withHistory(withReact(createEditor()))),
    []
  )
  const mentionAnchorRef = React.useRef<HTMLAnchorElement>(null)
  const [showModal, setShowModal] = React.useState<ModalType | null>(null)
  const [userList, setUserList] = React.useState<User[]>([])
  const [editorValue, setEditorValue] = React.useState<Node[]>([
    {
      type: 'paragraph',
      children: [{ text: 'A line of text in a paragraph.' }],
    },
  ])
  const fetchUserList = React.useCallback((mentionTo: string): void => {
    const chars = CHARACTERS.filter((c) =>
      c.name.toLowerCase().startsWith(mentionTo)
    ).slice(0, 10)
    setUserList(chars)
  }, [])
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
      if (showModal?.modal.type === 'MENTION_MODAL') {
        const selectedUser = userList[showModal.modal.data.activeIndex]
        console.log({ selectedUser })
        commandsMention.insertMention(editor, selectedUser)
      }
      console.log(showModal)
    },
    [editor, showModal, userList]
  )
  const composedOnKeyDown = composeOnKeyDown(
    onKeyDownMention({
      onPressUpInModal: handlePressUpInModal,
      onPressDownInModal: handlePressDownInModal,
      onPressEnterInModal: handlePressEnterInModal,
    })
  )

  const handleDecorate = React.useMemo(() => composedDecorate(editor), [
    composedDecorate,
    editor,
  ])
  const handlerRenderLeaf = composeRenderLeaf(
    renderLeafMention({ mentionAnchorRef })
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
      <div style={{ padding: '10px' }}>
        <button
          onClick={(e) => {
            e.preventDefault()
            Transforms.wrapNodes(
              editor,
              { type: 'link', url: 'kumparan.com', children: [] },
              { split: true }
            )
          }}
        >
          wrap link
        </button>
      </div>
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
        fetchUser={fetchUserList}
        users={userList}
      />
    </React.Fragment>
  )
}

export default AppEditor
