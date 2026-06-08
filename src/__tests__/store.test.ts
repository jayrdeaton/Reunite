import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'

jest.mock('node:fs')

const mockExistsSync = existsSync as jest.MockedFunction<typeof existsSync>
const mockMkdirSync = mkdirSync as jest.MockedFunction<typeof mkdirSync>
const mockReadFileSync = readFileSync as jest.MockedFunction<typeof readFileSync>
const mockWriteFileSync = writeFileSync as jest.MockedFunction<typeof writeFileSync>

import { Config, find, save } from '../store'

const DISPLAY: [number, number, number, number] = [0, 0, 1440, 900]
const SIZE: [number, number] = [1440, 874]

function makeConfig(apps: string[] = []): Config {
  return {
    activate: false,
    apps,
    bounds: [0, 26, 1440, 900],
    columns: 3,
    display: DISPLAY,
    rows: 2,
    size: SIZE
  }
}

beforeEach(() => {
  jest.clearAllMocks()
})

describe('find()', () => {
  it('returns undefined when no config file exists', () => {
    mockExistsSync.mockReturnValue(false)
    expect(find(DISPLAY)).toBeUndefined()
  })

  it('returns undefined when no config matches the display', () => {
    const other = makeConfig()
    other.display = [0, 0, 2560, 1440]
    mockExistsSync.mockReturnValue(true)
    mockReadFileSync.mockReturnValue(JSON.stringify([other]))
    expect(find(DISPLAY)).toBeUndefined()
  })

  it('returns the config matching the display', () => {
    const config = makeConfig(['Terminal', 'Google Chrome'])
    mockExistsSync.mockReturnValue(true)
    mockReadFileSync.mockReturnValue(JSON.stringify([config]))
    expect(find(DISPLAY)).toEqual(config)
  })

  it('picks the right config when multiple displays are saved', () => {
    const laptop = makeConfig(['Terminal'])
    const external = { ...makeConfig(['Terminal', 'Code']), display: [0, 0, 2560, 1440] as [number, number, number, number] }
    mockExistsSync.mockReturnValue(true)
    mockReadFileSync.mockReturnValue(JSON.stringify([laptop, external]))
    expect(find(DISPLAY)).toEqual(laptop)
    expect(find([0, 0, 2560, 1440])).toEqual(external)
  })
})

describe('save()', () => {
  it('appends a new config when none exists', () => {
    mockExistsSync.mockReturnValue(false)
    const config = makeConfig(['Terminal'])
    save(config)
    expect(mockWriteFileSync).toHaveBeenCalledWith(expect.any(String), JSON.stringify([config], null, 2))
  })

  it('replaces the existing config for the same display', () => {
    const existing = makeConfig(['Terminal'])
    mockExistsSync.mockReturnValue(true)
    mockReadFileSync.mockReturnValue(JSON.stringify([existing]))
    const updated = { ...existing, apps: ['Terminal', 'Google Chrome', 'Code'], columns: 4 }
    save(updated)
    expect(mockWriteFileSync).toHaveBeenCalledWith(expect.any(String), JSON.stringify([updated], null, 2))
  })

  it('leaves other display configs untouched when updating one', () => {
    const laptop = makeConfig(['Terminal'])
    const external = { ...makeConfig(['Terminal', 'Code']), display: [0, 0, 2560, 1440] as [number, number, number, number] }
    mockExistsSync.mockReturnValue(true)
    mockReadFileSync.mockReturnValue(JSON.stringify([laptop, external]))
    const updatedLaptop = { ...laptop, columns: 4 }
    save(updatedLaptop)
    const written = JSON.parse(mockWriteFileSync.mock.calls[0][1] as string) as Config[]
    expect(written).toHaveLength(2)
    expect(written[0].columns).toBe(4)
    expect(written[1]).toEqual(external)
  })

  it('creates the config directory if it does not exist', () => {
    mockExistsSync.mockReturnValue(false)
    save(makeConfig())
    expect(mockMkdirSync).toHaveBeenCalledWith(expect.any(String), { recursive: true })
  })
})
