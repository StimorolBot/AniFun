import { memo, useEffect, useRef, useState } from "react"

import Skeleton from "react-loading-skeleton"
import { Link, useNavigate } from "react-router-dom"
import { CSSTransition } from "react-transition-group"

import { useQuery } from "@tanstack/react-query"

import { Logo } from "../../ui/icon/Logo"
import { Random } from "../../ui/icon/Random"
import { Search as SearchIcon } from "../../ui/icon/Search"
import { Usr } from "../../ui/icon/Usr"

import { BtnBurger } from "../../ui/btn/BtnBurger"
import { BtnDefault } from "../../ui/btn/BtnDefault"

import { AsideMobileMenu } from "../../ui/aside/AsideMobileMenu"

import { Search } from "../popup/Search"

import { api } from "../../api"

import "./style/header.sass"

export const Header = memo(() => {
	const storageUrl = import.meta.env.VITE_STORAGE_URL
	const popupRef = useRef()
	const navigate = useNavigate()

	const [isShowPopup, setIsShowPopup] = useState(false)
	const [isShowMenu, setIsShowMenu] = useState(false)

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
							<Link className="header__link" to={"/"}>
								<Logo />
							</Link>
						</div>
						<nav className="header__navigation">
							<ul className="header__list">
								<li className="header__list-item">
									<Link to={"/anime"}>Аниме</Link>
								</li>
								<li className="header__list-item">
									<Link to={"/anime/schedules"}>
										Расписание
									</Link>
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
							<li className="header__list-item header-burger">
								<BtnBurger
									state={isShowMenu}
									callback={() => setIsShowMenu((s) => !s)}
								/>
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
			<AsideMobileMenu isShow={isShowMenu} setIsShow={setIsShowMenu} />
		</>
	)
})
