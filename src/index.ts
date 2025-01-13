import type { Session, SessionStorage } from "react-router";

export class FlashMessage<T extends Record<string, unknown>> {
	private sessionKey: keyof T & string;
	private sessionStorage: SessionStorage<T>;

	constructor({
		sessionStorage,
		sessionKey,
	}: {
		sessionStorage: SessionStorage<T>;
		sessionKey: keyof T & string;
	}) {
		this.sessionKey = sessionKey;
		this.sessionStorage = sessionStorage;
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
			data: session.get(this.sessionKey),
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
		session.flash(this.sessionKey, data);
		return { cookie: await this.commit(session) };
	}

	private commit(session: Session<T>): Promise<string> {
		return this.sessionStorage.commitSession(session);
	}
}
