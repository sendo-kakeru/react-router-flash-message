import { flashMessage } from "~/libs/flash-message";
import type { Route } from "./+types/flash-message.success";
import { redirect } from "react-router";

export async function loader({ request }: Route.LoaderArgs) {
	const { cookie } = await flashMessage.set({
		request,
		data: {
			color: "success",
			message: "success!!",
		},
	});
	return redirect("/", {
		headers: { "Set-Cookie": cookie },
	});
}
