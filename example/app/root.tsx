import {
	data,
	isRouteErrorResponse,
	Links,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
	useHref,
	useNavigate,
} from "react-router";

import type { Route } from "./+types/root";
import stylesheet from "./styles/app.css?url";
import { NextUIProvider } from "@nextui-org/react";
import { flashMessage } from "./libs/flash-message";
import FlashMessage from "./components/FlashMessage";

export const links: Route.LinksFunction = () => [
	{ rel: "preconnect", href: "https://fonts.googleapis.com" },
	{
		rel: "preconnect",
		href: "https://fonts.gstatic.com",
		crossOrigin: "anonymous",
	},
	{
		rel: "stylesheet",
		href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
	},
	{ rel: "stylesheet", href: stylesheet },
];

export async function loader({ request }: Route.LoaderArgs) {
	const { data: flashMessageData, cookie } = await flashMessage.get({
		request,
	});
	return data(
		{
			flashMessage: { ...flashMessageData, key: Date.now() },
		},
		{
			headers: { "Set-Cookie":cookie },
		},
	);
}

export function Layout({ children }: { children: React.ReactNode }) {
	const navigate = useNavigate();
	return (
		<html lang="en">
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<Meta />
				<Links />
			</head>
			<body>
				<NextUIProvider navigate={navigate} useHref={useHref}>
					{children}
				</NextUIProvider>
				<ScrollRestoration />
				<Scripts />
			</body>
		</html>
	);
}

export default function App({ loaderData }: Route.ComponentProps) {
	return (
		<div className="mx-auto max-w-5xl relative">
			{loaderData.flashMessage && (
				<FlashMessage
					color={loaderData.flashMessage.color}
					title={loaderData.flashMessage.message}
					key={loaderData.flashMessage.key}
				/>
			)}
			<Outlet />
		</div>
	);
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
	let message = "Oops!";
	let details = "An unexpected error occurred.";
	let stack: string | undefined;

	if (isRouteErrorResponse(error)) {
		message = error.status === 404 ? "404" : "Error";
		details =
			error.status === 404
				? "The requested page could not be found."
				: error.statusText || details;
	} else if (import.meta.env.DEV && error && error instanceof Error) {
		details = error.message;
		stack = error.stack;
	}

	return (
		<main className="pt-16 p-4 container mx-auto">
			<h1>{message}</h1>
			<p>{details}</p>
			{stack && (
				<pre className="w-full p-4 overflow-x-auto">
					<code>{stack}</code>
				</pre>
			)}
		</main>
	);
}
