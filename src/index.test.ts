import type { AlertProps } from "@nextui-org/react";
import { createCookieSessionStorage } from "react-router";
import { beforeEach, describe, expect, it } from "vitest";
import { FlashMessage } from ".";

const FLASH_MESSAGE_SESSION_KEY = "flash_message";

type FlashMessageData = {
	[FLASH_MESSAGE_SESSION_KEY]: {
		color?: AlertProps["color"];
		message: string;
	};
};

describe("FlashMessage", () => {
	let sessionStorage: ReturnType<
		typeof createCookieSessionStorage<FlashMessageData>
	>;
	let flashMessage: FlashMessage<FlashMessageData>;

	beforeEach(() => {
		sessionStorage = createCookieSessionStorage<FlashMessageData>({
			cookie: {
				name: "test_flash_message_session",
				httpOnly: true,
				path: "/",
				sameSite: "lax",
				secure: false,
			},
		});

		flashMessage = new FlashMessage<FlashMessageData>({
			sessionStorage,
			sessionKey: FLASH_MESSAGE_SESSION_KEY,
		});
	});

	it("should set and get flash message", async () => {
		const mockRequest = new Request("http://localhost", {
			headers: {
				Cookie: "",
			},
		});

		const { cookie: setCookie } = await flashMessage.set({
			request: mockRequest,
			data: {
				color: "success",
				message: "Flash test message",
			},
		});

		const getRequest = new Request("http://localhost", {
			headers: {
				Cookie: setCookie,
			},
		});

		const { data, cookie: getCookie } = await flashMessage.get({
			request: getRequest,
		});

		expect(data).toEqual({
			color: "success",
			message: "Flash test message",
		});

		expect(typeof getCookie).toBe("string");
	});

	it("should clear flash message after get", async () => {
		const mockRequest = new Request("http://localhost", {
			headers: {
				Cookie: "",
			},
		});

		const { cookie: setCookie } = await flashMessage.set({
			request: mockRequest,
			data: {
				color: "warning",
				message: "Only once",
			},
		});

		const firstGetRequest = new Request("http://localhost", {
			headers: {
				Cookie: setCookie,
			},
		});
		const { data: firstData, cookie: firstGetCookie } = await flashMessage.get({
			request: firstGetRequest,
		});

		expect(firstData).toEqual({
			color: "warning",
			message: "Only once",
		});

		const secondGetRequest = new Request("http://localhost", {
			headers: {
				Cookie: firstGetCookie,
			},
		});
		const { data: secondData } = await flashMessage.get({
			request: secondGetRequest,
		});

		expect(secondData).toBeUndefined();
	});
});
