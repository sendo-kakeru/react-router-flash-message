import { sessionStorage } from "~/libs/session-storage.server";
import type { Route } from "./+types/flash-message.success";
import { redirect } from "react-router";

export async function loader({ request }: Route.LoaderArgs) {
	const session = await sessionStorage.getSession(
		request.headers.get("Cookie"),
	);
	session.flash("flashMessage", {
		message: "message",
	});
	return redirect("/", {
		headers: { "Set-Cookie": await sessionStorage.commitSession(session) },
	});
}
