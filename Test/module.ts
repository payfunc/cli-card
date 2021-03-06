import * as paramly from "paramly"
import { Connection } from "../Connection"

const commands: { [command: string]: paramly.Command<Connection> } = {}

export function addCommand(command: paramly.Command<Connection>) {
	commands[command.name] = command
}

export const module: paramly.Module<Connection> = {
	name: "test",
	description: "Runs tests.",
	commands,
}

addCommand({
	name: "_",
	description: "Runs tests.",
	examples: [["", "Invoke all tests."]],
	execute: async (connection, argument, flags) => {
		console.info("PayFunc-card Test\n")
		const result = (
			await Promise.all(
				Object.values(commands)
					.filter(c => c.name != "_")
					.map(async c => {
						const r = await c.execute(connection, argument, flags)
						console.info(c.name.padEnd(20, ".") + (r ? "ok" : "fail").padStart(4, "."))
						return r
					})
			)
		).every(r => r)
		console.info()
		return result
	},
})
