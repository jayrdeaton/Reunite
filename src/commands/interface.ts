export interface WindowRef {
  app: string
  id: string // opaque platform-specific identifier
}

export interface Platform {
  activateApp(app: string): void
  // Opens a new terminal window and optionally runs a script. Platform-specific — darwin only for now.
  doScript(script?: string): void
  getDisplaySize(): number[]
  // Returns all windows for the given apps, or all visible windows when the list is empty.
  getWindows(apps: string[]): WindowRef[]
  getWindowBounds(win: WindowRef): number[]
  repositionWindow(win: WindowRef, x: number, y: number, width: number, height: number): void
  resizeWindow(win: WindowRef, width: number, height: number): void
}
