/* eslint-disable no-console */
import cosmetic from 'cosmetic'

import program from './program'

async function run(argv: string[]): Promise<void> {
  try {
    await program.parse(argv)
  } catch (err) {
    if (err instanceof Error) {
      console.error(`${cosmetic.red(`${err.name}:`)} ${err.message}`)
    } else {
      console.error(err)
    }
  }
  process.exit()
}

run(process.argv)
