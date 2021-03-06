import * as paramly from "paramly"
import * as authly from "authly"
import { Connection } from "../Connection"
import { Credentials } from "./Credentials"

export async function add(
	connection: Connection,
	name: string,
	privateKey: authly.Token,
	publicKey: authly.Token,
	agentKey: authly.Token,
	user?: string,
	password?: string
): Promise<boolean> {
	const credential: Credentials = { name, keys: { private: privateKey, public: publicKey, agent: agentKey } }
	if (user && password)
		credential.administrator = { user, password }
	return connection.storage.save(credential) ?? false
}

export namespace add {
	export const command: paramly.Command<Connection> = {
		name: "add",
		description: "Adds a new server.",
		examples: [
			["<name> <private key> <public key> <agent key>", "Add server without admin user."],
			["<name> <private key> <public key> <agent key> <user> <password>", "Add server and admin user."],
		],
		execute: async (connection, argument, flags) =>
			!!connection && add(connection, argument[0], argument[1], argument[2], argument[3], argument[4], argument[5]),
	}
}
