import { memo, useEffect, useRef, useState } from "react"

import Skeleton from "react-loading-skeleton"
import { Link, NavLink, useNavigate } from "react-router-dom"
import { CSSTransition } from "react-transition-group"

import { api } from "../../api"
import { useQuery } from "@tanstack/react-query"

import { Logo } from "../../ui/icon/Logo"
import { Random } from "../../ui/icon/Random"
import { Search as SearchIcon } from "../../ui/icon/Search"
import { Usr } from "../../ui/icon/Usr"

import { BtnDefault } from "../../ui/btn/BtnDefault"

import { Search } from "../popup/Search"

import "./style/header.sass"

export const Header = memo(() => {
	const storageUrl = import.meta.env.VITE_STORAGE_URL
	const popupRef = useRef()
	const navigate = useNavigate()

	const [isShowPopup, setIsShowPopup] = useState(false)

	const { data: userData, isLoading } = useQuery({
		queryKey: ["user-data"],
		staleTime: 1000 * 60 * 3,
		retry: 2,
		queryFn: async () => {
			return await api.get("/users/me").then((r) => r.data)
		},
	})

	useEffect(() => {
		return () => {
			document.body.classList.remove("scroll_block")
		}
	}, [])

	useEffect(() => {
		const handleKeyDown = (e) => {
			if (e.key === "/") {
				setIsShowPopup(true)
				document.body.classList.add("scroll_block")
			}
		}
		document.addEventListener("keydown", handleKeyDown)
		return () => {
			document.removeEventListener("keydown", handleKeyDown)
		}
	}, [])

	return (
		<>
			<header className="header">
				<div className="container">
					<div className="header__inner">
						<div className="header__logo">
							<NavLink className="header__link" to={"/"}>
								<Logo />
							</NavLink>
						</div>
						<nav className="header__navigation">
							<ul className="header__list">
								<li className="header__list-item">
									<NavLink
										className={({ isActive }) =>
											isActive
												? "header-nav-link header-nav-link_active"
												: "header-nav-link"
										}
										to={"/"}
										end
									>
										Главная
									</NavLink>
								</li>
								<li className="header__list-item">
									<NavLink
										className={({ isActive }) =>
											isActive
												? "header-nav-link header-nav-link_active"
												: "header-nav-link"
										}
										to={"/anime"}
										end
									>
										Аниме
									</NavLink>
								</li>
								<li className="header__list-item">
									<NavLink
										className={({ isActive }) =>
											isActive
												? "header-nav-link header-nav-link_active"
												: "header-nav-link"
										}
										to={"/anime/schedules"}
										end
									>
										Расписание
									</NavLink>
								</li>
								<li className="header__list-item">
									<NavLink
										className={({ isActive }) =>
											isActive
												? "header-nav-link header-nav-link_active"
												: "header-nav-link"
										}
										to={"/anime/genres"}
										end
									>
										Жанры
									</NavLink>
								</li>
							</ul>
						</nav>
						<ul className="header__list" style={{ gap: 14 }}>
							<li className="header__list-item">
								<BtnDefault
									callback={async () =>
										await api
											.get("/titles/random")
											.then((r) => {
												navigate(
													`/anime/${r.data.alias}`,
												)
											})
									}
									isStroke={false}
								>
									<Random style={{ width: 20, height: 20 }} />
								</BtnDefault>
							</li>
							<li className="header__list-item">
								<BtnDefault
									callback={(e) => {
										document.body.classList.add(
											"scroll_block",
										)
										setIsShowPopup(true)
										e.stopPropagation()
									}}
								>
									<SearchIcon
										style={{ width: 20, height: 20 }}
									/>
								</BtnDefault>
							</li>
							<li className="header__list-item">
								{isLoading ? (
									<Skeleton
										circle={true}
										width={28}
										height={28}
									/>
								) : userData?.uuid ? (
									<Link to={`/users/${userData.uuid}`}>
										<img
											className="header__avatar"
											src={`${storageUrl}/user-${userData.uuid}/${userData.avatar_uuid}.png`}
											alt="аватар"
										/>
									</Link>
								) : (
									<Link to={"/auth/login"}>
										<Usr
											style={{
												width: 24,
												height: 24,
												fill: "currentColor",
											}}
										/>
									</Link>
								)}
							</li>
						</ul>
					</div>
				</div>
			</header>
			<CSSTransition
				classNames="transition"
				nodeRef={popupRef}
				in={isShowPopup}
				timeout={300}
				mountOnEnter
				unmountOnExit
			>
				<Search
					ref={popupRef}
					isShowPopup={isShowPopup}
					setIsShow={setIsShowPopup}
					storageUrl={storageUrl}
				/>
			</CSSTransition>
		</>
	)
})
