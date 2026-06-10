import { describe, expect, it } from 'vitest'
import { detectIntentionalMouseMovement, type MouseMovementSnapshot } from './mouseMovement'

function mouseEvent(overrides: Partial<MouseEvent> = {}) {
  return {
    clientX: 10,
    clientY: 20,
    screenX: 110,
    screenY: 120,
    movementX: 0,
    movementY: 0,
    ...overrides,
  } as Pick<MouseEvent, 'clientX' | 'clientY' | 'screenX' | 'screenY' | 'movementX' | 'movementY'>
}

describe('detectIntentionalMouseMovement', () => {
  it('ignores the first stationary mousemove while capturing its position', () => {
    const decision = detectIntentionalMouseMovement(mouseEvent(), null)

    expect(decision.moved).toBe(false)
    expect(decision.snapshot).toEqual({
      clientX: 10,
      clientY: 20,
      screenX: 110,
      screenY: 120,
    })
  })

  it('treats non-zero movement deltas as intentional movement', () => {
    const decision = detectIntentionalMouseMovement(mouseEvent({ movementY: 1 }), null)

    expect(decision.moved).toBe(true)
  })

  it('treats coordinate changes as intentional movement', () => {
    const previous: MouseMovementSnapshot = {
      clientX: 10,
      clientY: 20,
      screenX: 110,
      screenY: 120,
    }

    const decision = detectIntentionalMouseMovement(mouseEvent({ clientX: 11 }), previous)

    expect(decision.moved).toBe(true)
  })

  it('ignores repeated mousemove events at the same position', () => {
    const previous: MouseMovementSnapshot = {
      clientX: 10,
      clientY: 20,
      screenX: 110,
      screenY: 120,
    }

    const decision = detectIntentionalMouseMovement(mouseEvent(), previous)

    expect(decision.moved).toBe(false)
  })
})
