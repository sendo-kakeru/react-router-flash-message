import { Alert, type AlertProps } from "@nextui-org/react";
import { useEffect, useState } from "react";

export default function FlashMessage(props: AlertProps) {
	const [isTimeOut, setIsTimeOut] = useState(false);
	useEffect(() => {
		setIsTimeOut(true);
		const timeoutId = setTimeout(() => {
			setIsTimeOut(false);
		}, 2000);
		return () => {
			clearTimeout(timeoutId);
		};
	}, []);

	return (
		<Alert
			{...props}
			classNames={{
				base: `z-50 absolute left-1/2 -translate-x-1/2 duration-700 ease-in-out w-full ${isTimeOut ? "top-0" : "-top-[50vh]"}`,
			}}
		/>
	);
}
