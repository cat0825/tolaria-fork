import { describe, expect, it } from 'vitest'
import { positionContextMenu } from './contextMenuPosition'

describe('positionContextMenu', () => {
  it('keeps a menu inside the right edge of the viewport', () => {
    expect(positionContextMenu(
      { x: 790, y: 40 },
      { width: 240, height: 120 },
      { width: 800, height: 600 },
    )).toEqual({ left: 552, top: 40 })
  })

  it('flips upward when there is not enough space below the click point', () => {
    expect(positionContextMenu(
      { x: 120, y: 590 },
      { width: 240, height: 160 },
      { width: 800, height: 600 },
    )).toEqual({ left: 120, top: 430 })
  })

  it('clamps oversized menus to the viewport padding', () => {
    expect(positionContextMenu(
      { x: 790, y: 590 },
      { width: 900, height: 900 },
      { width: 800, height: 600 },
    )).toEqual({ left: 8, top: 8 })
  })
})
