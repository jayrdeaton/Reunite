import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { dirname, join } from 'node:path'

export interface Config {
  activate: boolean
  apps: string[]
  bounds: [number, number, number, number]
  columns: number
  display: [number, number, number, number]
  rows: number
  size: [number, number]
}

const configPath = join(homedir(), '.config', 'reunite', 'configs.json')

function read(): Config[] {
  if (!existsSync(configPath)) return []
  return JSON.parse(readFileSync(configPath, 'utf-8')) as Config[]
}

function write(configs: Config[]): void {
  mkdirSync(dirname(configPath), { recursive: true })
  writeFileSync(configPath, JSON.stringify(configs, null, 2))
}

export function find(display: number[]): Config | undefined {
  return read().find((c) => c.display.toString() === display.toString())
}

export function save(config: Config): void {
  const configs = read()
  const index = configs.findIndex((c) => c.display.toString() === config.display.toString())
  if (index >= 0) configs[index] = config
  else configs.push(config)
  write(configs)
}
