import type { AlertProps } from "@nextui-org/react";
import {
	createCookieSessionStorage,
	type Session,
	type SessionStorage,
} from "react-router";

class FlashMessage<T extends Record<string, unknown>> {
	private flashMessageSessionKey: keyof T & string;
	public sessionStorage: SessionStorage<T>;

	constructor(flashMessageSessionKey: keyof T & string) {
		this.flashMessageSessionKey = flashMessageSessionKey;
		this.sessionStorage = createCookieSessionStorage<T>({
			cookie: {
				name: "flash_message_session",
				sameSite: "lax",
				httpOnly: true,
				secure: process.env.NODE_ENV === "production",
			},
		});
	}

	public async get({ request }: { request: Request }): Promise<{
		data:
			| (keyof T & string extends keyof T ? T[keyof T & string] : undefined)
			| undefined;
		cookie: string;
	}> {
		const session = await this.sessionStorage.getSession(
			request.headers.get("Cookie"),
		);
		return {
			data: session.get(this.flashMessageSessionKey),
			cookie: await this.commit(session),
		};
	}

	public async set({
		request,
		data,
	}: { request: Request; data: T[keyof T & string] }): Promise<{
		cookie: string;
	}> {
		const session = await this.sessionStorage.getSession(
			request.headers.get("Cookie"),
		);
		session.flash(this.flashMessageSessionKey, data);
		return { cookie: await this.commit(session) };
	}

	private commit(session: Session<T>): Promise<string> {
		return this.sessionStorage.commitSession(session);
	}
}

const FLASH_MESSAGE_SESSION_KEY = "flash_message";

export const flashMessage = new FlashMessage<{
	[FLASH_MESSAGE_SESSION_KEY]: {
		color?: AlertProps["color"];
		message: string;
	};
}>(FLASH_MESSAGE_SESSION_KEY);
