import type { AlertProps } from "@nextui-org/react";
import { createCookieSessionStorage } from "react-router";

export const sessionStorage = createCookieSessionStorage<{
	flashMessage: {
		color?: AlertProps["color"];
		message: string;
	};
}>({
	cookie: {
		name: "flash_message_session",
		sameSite: "lax",
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
	},
});