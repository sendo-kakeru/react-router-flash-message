import type { AlertProps } from "@heroui/react";
import { createCookieSessionStorage } from "react-router";
import { FlashMessage } from "react-router-flash-message";

const FLASH_MESSAGE_SESSION_KEY = "flash_message";

export type FlashMessageData = {
	[FLASH_MESSAGE_SESSION_KEY]: {
		color?: AlertProps["color"];
		message: string;
	};
};

export const sessionStorage = createCookieSessionStorage<FlashMessageData>({
	cookie: {
		name: "flash_message_session",
		sameSite: "lax",
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
	},
});

export const flashMessage = new FlashMessage<FlashMessageData>({
	sessionStorage,
	sessionKey: FLASH_MESSAGE_SESSION_KEY,
});
