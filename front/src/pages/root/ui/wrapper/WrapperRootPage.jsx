import { Outlet } from "react-router-dom"

import { jwtDecode } from "jwt-decode"

import { cookies } from "../../../../cookie"
import { Error } from "../../../error/Error"
import { SideBar } from "../aside/SideBar"

import "./root.sass"

export const WrapperRootPage = () => {
	const accessToken = cookies.get("access_token")

	if (!accessToken) return <Error />

	const payload = jwtDecode(accessToken || "")

	if (payload?.role !== "superuser") return <Error />

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
