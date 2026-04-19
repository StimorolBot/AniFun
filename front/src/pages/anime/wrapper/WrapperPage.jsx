import { Outlet } from "react-router-dom"

import { Footer } from "../../../components/footer/Footer"
import { Header } from "../../../components/header/Header"

export const WrapperPage = () => {
	return (
		<div className="wrapper">
			<Header />
			<main className="main">
				<Outlet />
			</main>
			<Footer />
		</div>
	)
}
