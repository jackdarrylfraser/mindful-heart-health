import { Inngest } from "inngest";
import { env } from "@/src/lib/env";

let _inngest: Inngest | undefined;

export async function getInngest() {
	if (!_inngest) {
		_inngest = new Inngest({
			id: "healthy-blood-pressure", // Your app name
		});
	}
	return _inngest;
}
