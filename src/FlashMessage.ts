import type { Session, SessionStorage } from "react-router";

export class FlashMessage<S extends Record<string, unknown>> {
	public session?: Session<S>;
	private messageKey: keyof S & string;
	private sessionStorage: SessionStorage<S>;

	constructor(
		sessionStorage: SessionStorage<S>,
		options: {
			messageKey: keyof S & string;
		},
	) {
		this.messageKey = options.messageKey;
		this.sessionStorage = sessionStorage;
	}

	public async updateSession(request: Request) {
		this.session = await sessionStorage.getSession(
			request.headers.get("Cookie"),
		);
	}

	private sessionExistGuard(session?: Session<S>): asserts session {
		// Todo: sessionが空の場合もfalse判定にならないかテスト
		if (!session) {
			throw new Error(
				"The session has not been initialized. Please call `updateSession` first.",
			);
		}
	}

	public get():
		| (keyof S & string extends keyof S ? S[keyof S & string] : undefined)
		| undefined {
		this.sessionExistGuard(this.session);
		return this.session.get(this.messageKey);
	}

	public set(message: S[keyof S & string]): void {
		this.sessionExistGuard(this.session);
		this.session.flash(this.messageKey, message);
	}

	public commit(): Promise<string> {
		this.sessionExistGuard(this.session);
		return this.sessionStorage.commitSession(this.session);
	}
}
