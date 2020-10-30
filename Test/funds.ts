import * as gracely from "gracely"
import * as authly from "authly"
import * as cardModel from "@payfunc/model-card"
import * as Authorization from "../Authorization"
import * as Card from "../Card"
import { addCommand } from "./module"

addCommand({
	name: "funds",
	description: "Insufficient funds (40413)",
	examples: [],
	execute: async (connection, argument, flags) => {
		const card = connection && await Card.create(connection, {
			pan: "420000404130000",
			expires: [ 2, 22 ],
			csc: "987",
		})
		const creatable = authly.Token.is(card) && {
			amount: 13.37,
			currency: "SEK",
			card,
		}
		const token = connection && cardModel.Authorization.Creatable.is(creatable) && await Authorization.create(connection, creatable, true)
		return gracely.client.malformedContent.is(token) &&
			token.content.property == "card.pan" &&
			token.content.description == "Invalid card number."
	}
})
