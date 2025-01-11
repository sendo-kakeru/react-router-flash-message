import { useEffect, useState } from "react";
import { Alert, type AlertProps } from "@nextui-org/react";

export default function FlashMessage({ title, ...props }: AlertProps) {
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

	const isVisible = title ? isTimeOut : false;

	return (
		<Alert
			{...{ ...props, title }}
			classNames={{
				base: `z-50 fixed left-1/2 -translate-x-1/2 duration-700 ease-in-out ${isVisible ? "top-0" : "-top-[50vh]"}`,
			}}
		/>
	);
}
