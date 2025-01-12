import type { Route } from "./+types/flash-message.success";
import { redirect } from "react-router";
import { flashMessage } from "~/libs/flash-message";

export async function loader({ request }: Route.LoaderArgs) {
	const { cookie } = await flashMessage.set({
		request,
		data: { message: "message" },
	});
	return redirect("/", {
		headers: { "Set-Cookie": cookie },
	});
}
