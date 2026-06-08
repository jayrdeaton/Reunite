import { Platform } from './interface'

export { WindowRef } from './interface'

function loadPlatform(): Platform {
  switch (process.platform) {
    case 'darwin':
      return require('./platforms/darwin').default as Platform
    case 'linux':
      return require('./platforms/linux').default as Platform
    default:
      throw new Error(`Unsupported platform: ${process.platform}`)
  }
}

const platform = loadPlatform()

export const activateApp = platform.activateApp.bind(platform)
export const doScript = platform.doScript.bind(platform)
export const getDisplaySize = platform.getDisplaySize.bind(platform)
export const getWindows = platform.getWindows.bind(platform)
export const getWindowBounds = platform.getWindowBounds.bind(platform)
export const repositionWindow = platform.repositionWindow.bind(platform)
export const resizeWindow = platform.resizeWindow.bind(platform)
