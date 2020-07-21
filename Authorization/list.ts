import * as gracely from "gracely"
import * as paramly from "paramly"
import * as cardfunc from "@cardfunc/model"
import { Connection } from "../Connection"

export function list(connection: Connection): Promise<cardfunc.Authorization[] | gracely.Error> {
	return connection.get<cardfunc.Authorization[]>("private", "authorization")
}
export namespace list {
	export const command: paramly.Command<Connection> = {
		name: "list",
		description: "Lists authorizations.",
		examples: [
			["", "List all authorizations."],
		],
		execute: async (connection, argument, flags) => {
			const result = connection &&
				await list(connection)
			console.info(JSON.stringify(result, undefined, "\t"))
			return Array.isArray(result)
		}
	}
}
