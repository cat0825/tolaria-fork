import { describe, expect, it } from 'vitest'
import {
  isBeforeInputEventComposing,
  isKeyboardEventComposing,
} from './imeEvents'

function keyboardEvent(overrides: Partial<KeyboardEvent> = {}) {
  return {
    isComposing: false,
    key: 'a',
    keyCode: 65,
    ...overrides,
  } as KeyboardEvent
}

function beforeInputEvent(overrides: Partial<InputEvent> = {}) {
  return {
    inputType: 'insertText',
    isComposing: false,
    ...overrides,
  } as InputEvent
}

describe('IME event guards', () => {
  it('detects composing keyboard events from native, legacy, process-key, and editor-view state', () => {
    expect(isKeyboardEventComposing(keyboardEvent({ isComposing: true }))).toBe(true)
    expect(isKeyboardEventComposing(keyboardEvent({ keyCode: 229 }))).toBe(true)
    expect(isKeyboardEventComposing(keyboardEvent({ key: 'Process' }))).toBe(true)
    expect(isKeyboardEventComposing(keyboardEvent(), { composing: true })).toBe(true)
    expect(isKeyboardEventComposing(keyboardEvent(), { composing: false })).toBe(false)
  })

  it('detects composition beforeinput events from native, inputType, and editor-view state', () => {
    expect(isBeforeInputEventComposing(beforeInputEvent({ isComposing: true }))).toBe(true)
    expect(isBeforeInputEventComposing(beforeInputEvent({ inputType: 'insertCompositionText' }))).toBe(true)
    expect(isBeforeInputEventComposing(beforeInputEvent({ inputType: 'deleteCompositionText' }))).toBe(true)
    expect(isBeforeInputEventComposing(beforeInputEvent(), { composing: true })).toBe(true)
    expect(isBeforeInputEventComposing(beforeInputEvent(), { composing: false })).toBe(false)
  })
})
