import { Outlet } from "react-router-dom"

import { SideBar } from "../aside/SideBar"

export const WrapperRootPage = () => {
	return (
		<div className="wrapper">
			<main className="main">
				<div style={{ display: "flex" }}>
					<SideBar />
					<Outlet />
				</div>
			</main>
		</div>
	)
}
