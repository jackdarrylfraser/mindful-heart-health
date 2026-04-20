import { Resend } from "resend";
import { env } from "@/src/lib/env";

let _resend: Resend | undefined;

export async function getResend() {
	if (!_resend) {
		_resend = new Resend(env.RESEND_API_KEY);
	}
	return _resend;
}
