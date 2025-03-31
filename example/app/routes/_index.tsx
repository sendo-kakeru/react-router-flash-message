import { Link } from "@heroui/react";

export default function Page() {
	return (
		<>
			<h1>Home</h1>
			<div className="grid">
				{/* <Link href="/flash-message/success" underline="hover">
					add flash message
				</Link> */}
				<Link href="/flash-message/default">add flash message: default</Link>
				<Link href="/flash-message/success">add flash message: success</Link>
				<Link href="/flash-message/danger">add flash message: danger</Link>
			</div>
		</>
	);
}
