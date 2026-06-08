import { Config } from '../store'
import { computeGrid } from '../actions/reunite'

const BASE_CONFIG: Config = {
  activate: false,
  apps: ['Terminal'],
  bounds: [0, 26, 1440, 900],
  columns: 3,
  display: [0, 0, 1440, 900],
  rows: 2,
  size: [1440, 874]
}

describe('computeGrid()', () => {
  it('returns empty array when windowCount is 0 and no add/fill', () => {
    expect(computeGrid(BASE_CONFIG, 0)).toEqual([])
  })

  it('returns correct number of positions for existing windows', () => {
    const positions = computeGrid(BASE_CONFIG, 4)
    expect(positions).toHaveLength(4)
  })

  it('adds extra slots when add is provided', () => {
    const positions = computeGrid(BASE_CONFIG, 2, 1)
    expect(positions).toHaveLength(3)
  })

  it('fills to rows*columns when fill=true and window count is below capacity', () => {
    const positions = computeGrid(BASE_CONFIG, 2, undefined, true)
    expect(positions).toHaveLength(6)
  })

  it('does not expand beyond windowCount when fill=true and grid is already full', () => {
    const positions = computeGrid(BASE_CONFIG, 6, undefined, true)
    expect(positions).toHaveLength(6)
  })

  it('computes correct x,y for a 3-column layout', () => {
    const config: Config = { ...BASE_CONFIG, columns: 3, rows: 1, size: [1440, 874] }
    const positions = computeGrid(config, 3)
    expect(positions[0]).toBe('0,26')
    expect(positions[1]).toBe('480,26')
    expect(positions[2]).toBe('960,26')
  })

  it('wraps to the next row after filling all columns', () => {
    const config: Config = { ...BASE_CONFIG, columns: 3, rows: 2, size: [1440, 874] }
    const positions = computeGrid(config, 6)
    expect(positions[3]).toBe('0,463')
    expect(positions[4]).toBe('480,463')
    expect(positions[5]).toBe('960,463')
  })

  it('wraps back to row 1 after filling all rows', () => {
    const positions = computeGrid(BASE_CONFIG, 7)
    expect(positions[6]).toBe('0,26')
  })

  it('respects non-zero bounds offset', () => {
    const config: Config = { ...BASE_CONFIG, bounds: [100, 50, 1540, 950], columns: 2, rows: 1, size: [1440, 900] }
    const positions = computeGrid(config, 2)
    expect(positions[0]).toBe('100,50')
    expect(positions[1]).toBe('820,50')
  })
})
