declare module 'cosmetic' {
  const cosmetic: {
    green(s: string): string
    red(s: string): string
    yellow(s: string): string
    blue(s: string): string
    cyan(s: string): string
    magenta(s: string): string
    white(s: string): string
    gray(s: string): string
    bold(s: string): string
  }
  export = cosmetic
}

declare module 'termkit' {
  interface Options {
    [key: string]: unknown
    _parents: Record<string, Options>
  }
  interface OptionDef {
    _isOption: true
  }
  interface Command {
    version(v: string): this
    description(d: string): this
    options(opts: OptionDef[]): this
    action(fn: (options: Options) => void | Promise<void>): this
    commands(cmds: Command[]): this
    parse(argv: string[]): Promise<void>
  }
  function command(name: string, args?: string): Command
  function option(short: string, long: string, value: string | null, description: string): OptionDef
}
