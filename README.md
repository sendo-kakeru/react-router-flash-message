# React Router Flash Message

### Simple Flash Message for [React Router](https://reactrouter.com) apps.

<!-- ## Overview

React Router Flash Message is a complete open-source authentication solution for Remix and React Router applications. -->

## Installation
To use it, install it from npm (or yarn or pnpm):

```bash
npm i react-router-flash-message
```

## Usage

Import the `FlashMessage` class and initialize an instance by passing the following arguments:
- `sessionStorage`: A session storage to save flash message sessions.
- `sessionKey`: A key used for reading and writing flash message sessions.

You should provide the type of the flash message stored in the session as a generic. The type must be an object, and the object's key must match the `sessionKey`.

```ts
import { FlashMessage } from "react-router-flash-message";

const FLASH_MESSAGE_SESSION_KEY = "flash_message";

export type FlashMessageColor = "success" | "warning" | "danger" | undefined;

// Define the type for flash messages stored in the session.
// The type must be an object.
// The key must match the `sessionKey`.
export type FlashMessageData = {
  [FLASH_MESSAGE_SESSION_KEY]: {
    color?: FlashMessageColor;
    message: string;
  };
};

// It is recommended to set the flash message type for the session storage as a generic.
export const sessionStorage = createCookieSessionStorage<FlashMessageData>({
  cookie: {
    name: "flash_message_session",
    sameSite: "lax",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  },
});

// Create an instance of FlashMessage
// Pass `sessionStorage` and `sessionKey`
// Set the flash message type as a generic
export const flashMessage = new FlashMessage<FlashMessageData>({
  sessionStorage,
  sessionKey: FLASH_MESSAGE_SESSION_KEY,
});
```

To set a flash message, use the `flashMessage.set()` method.
The `flashMessage.set()` method takes `request` and flash message data as arguments and returns a cookie after writing the data.
Set the returned cookie in the `Set-Cookie` header of the response.
```ts
export async function loader({ request }: Route.LoaderArgs) {
…
  // Set the flash message
  const { cookie } = await flashMessage.set({
    request,
    data: {
      color: "success",
      message: "success!!",
    },
  });

  // Set the cookie in the `Set-Cookie` header and response
  return redirect("/", {
    headers: { "Set-Cookie": cookie },
  });
}
```

To display a flash message, execute `flashMessage.get()` in the server's route module.
The `flashMessage.get()` method takes `request` as an argument and returns the cookie after reading.
Set the returned cookie in the `Set-Cooki`e header of the response. Without response with the cookie, the session will not be destroyed after reading, and the flash message will continue to display.

In the component, receive the message and display it if a flash message exists.
```ts
export async function loader({ request }: Route.LoaderArgs) {
  // Read the flash message
  const { data: flashMessageData, cookie } = await flashMessage.get({
    request,
  });
  return data(
    {
      flashMessage: flashMessageData,
    },
    // Set the cookie in the `Set-Cookie` header and respond
    // Without this, the session will not be destroyed after reading, and the flash message will continue to display
    {
      headers: { "Set-Cookie": cookie },
    },
  );
}

…

export default function App({ loaderData }: Route.ComponentProps) {
  return (
    <>
      {/* Display the flash message */}
      {loaderData.flashMessage && (
        <Alert
          color={loaderData.flashMessage.color}
          title={loaderData.flashMessage.message}
        />
      )}
    </>
  );
}
```

<!-- ## Advanced Usage -->

<!-- ### プロジェクト全体に設定する -->

## License

See [LICENSE](./LICENSE).

## Author

- [Sendo Kakeru](https://github.com/sendo-kakeru)
