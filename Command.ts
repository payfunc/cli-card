import { Connection } from "./Connection"

export interface Command {
	readonly name: string
	readonly description: string
	readonly examples: [string, string][]
	execute(connection: Connection, argument: string[], flags: { [flag: string]: string[] }): Promise<boolean>
}