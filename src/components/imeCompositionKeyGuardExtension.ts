import { createExtension } from '@blocknote/core'
import { isKeyboardEventComposing, type ComposingEditorView } from '../utils/imeEvents'

function isEnterKey(event: KeyboardEvent): boolean {
  return event.key === 'Enter'
    || event.code === 'Enter'
    || event.code === 'NumpadEnter'
    || event.keyCode === 13
}

export function shouldStopComposingEnterKey(
  event: KeyboardEvent,
  view?: ComposingEditorView | null,
): boolean {
  return isEnterKey(event) && isKeyboardEventComposing(event, view)
}

export const createImeCompositionKeyGuardExtension = createExtension(({ editor }) => {
  const readView = () => editor._tiptapEditor?.view ?? editor.prosemirrorView

  const handleKeyDown = (event: KeyboardEvent) => {
    if (!shouldStopComposingEnterKey(event, readView())) return

    event.stopImmediatePropagation()
  }

  return {
    key: 'imeCompositionKeyGuard',
    mount: ({ dom, signal }) => {
      dom.addEventListener('keydown', handleKeyDown, {
        capture: true,
        signal,
      })
    },
  } as const
})
