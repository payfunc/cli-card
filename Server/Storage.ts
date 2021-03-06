import * as KeyValueStore from "node-persist"
import { Credentials } from "./Credentials"

export class Storage {
	backend: KeyValueStore.LocalStorage
	name: string
	initialized: Promise<KeyValueStore.InitOptions>
	private constructor(name: string) {
		this.name = name
		this.backend = KeyValueStore.create({ dir: (process.env.HOME ?? ".") + "/." + name })
		this.initialized = this.backend.init()
	}
	async save(merchant: Credentials): Promise<boolean> {
		return !!((await this.initialized) && (await this.backend.setItem(merchant.name, merchant))).file
	}
	async load(name: string): Promise<Credentials | undefined> {
		return name == "env"
			? {
					name: "env",
					keys: {
						private: process.env.privateKey ?? undefined,
						public: process.env.publicKey ?? undefined,
						agent: process.env.agentKey ?? undefined,
					},
					administrator: { user: process.env.adminUser ?? undefined, password: process.env.adminPassword ?? undefined },
			  }
			: (await this.initialized) && this.backend.getItem(name)
	}
	async list(): Promise<string[]> {
		return (await this.initialized) && this.backend.keys()
	}
	async remove(name: string): Promise<boolean> {
		const result = (await this.initialized) && (await this.backend.removeItem(name))
		return result.removed
	}
	private static opened: { [name: string]: Storage } = {}
	static open(name: string): Storage {
		const result = this.opened[name] ?? new Storage(name)
		this.opened[name] = result
		return result
	}
}
