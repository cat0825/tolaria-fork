export interface ComposingEditorView {
  composing?: boolean
}

type KeyboardCompositionEvent = Pick<KeyboardEvent, 'isComposing' | 'key' | 'keyCode'>
type BeforeInputCompositionEvent = Pick<InputEvent, 'isComposing' | 'inputType'>

function isViewComposing(view?: ComposingEditorView | null): boolean {
  return Boolean(view?.composing)
}

function isCompositionInputType(inputType: string): boolean {
  return inputType.toLowerCase().includes('composition')
}

export function isKeyboardEventComposing(
  event: KeyboardCompositionEvent,
  view?: ComposingEditorView | null,
): boolean {
  return event.isComposing
    || event.keyCode === 229
    || event.key === 'Process'
    || isViewComposing(view)
}

export function isBeforeInputEventComposing(
  event: BeforeInputCompositionEvent,
  view?: ComposingEditorView | null,
): boolean {
  return event.isComposing
    || isCompositionInputType(event.inputType)
    || isViewComposing(view)
}
