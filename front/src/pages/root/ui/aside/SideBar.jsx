import { memo, useState } from "react"

import { Link, NavLink } from "react-router-dom"

import { useQuery } from "@tanstack/react-query"

import { Bookmark } from "../../../../ui/icon/Bookmark"
import { Dashboard as DashboardIcons } from "../../../../ui/icon/Dashboard"
import { Img } from "../../../../ui/icon/Img"
import { Images } from "../../../../ui/icon/Imgs"
import { Logo } from "../../../../ui/icon/Logo"
import { Msg } from "../../../../ui/icon/Msg"
import { Settings } from "../../../../ui/icon/Settings"
import { Terminal } from "../../../../ui/icon/Terminal"
import { Usr } from "../../../../ui/icon/Usr"
import { Video as VideoIcons } from "../../../../ui/icon/Video"
import { Watch } from "../../../../ui/icon/Watch"

import { api } from "../../../../api"

import "./style/side_bar.sass"

export const SideBar = memo(() => {
	const storageUrl = import.meta.env.VITE_STORAGE_URL
	const {
		data: userData,
		isFetching,
		error,
		isError,
	} = useQuery({
		queryKey: ["root-data"],
		staleTime: 1000 * 60 * 3,
		queryFn: async () => {
			return await api.get(`users/me`).then((r) => r.data)
		},
	})

	return (
		<aside className="sidebar">
			<header className="sidebar__header">
				<Link className="sidebar__logo" to={"/"}>
					<Logo />
				</Link>
				<div className="sidebar__title">
					<p>
						<span>Ani</span>
						<span style={{ color: "#D53032" }}>Fun</span>
					</p>
					<span>Admin Panel</span>
				</div>
			</header>
			<nav className="sidebar__nav">
				<ul className="sidebar-nav__list">
					<h3 className="sidebar__nav-title">Основное</h3>
					<li className="sidebar__nav-item">
						<NavLink
							className={({ isActive }) =>
								isActive
									? "sidebar__link_active"
									: "sidebar__link"
							}
							to={"/root"}
							end
						>
							<DashboardIcons />
							<span>Дашборд</span>
						</NavLink>
					</li>
					<li className="sidebar__nav-item">
						<NavLink
							className={({ isActive }) =>
								isActive
									? "sidebar__link_active"
									: "sidebar__link"
							}
							to={"/root/titles"}
						>
							<Bookmark />
							<span>Тайтлы</span>
						</NavLink>
					</li>
					<li className="sidebar__nav-item">
						<NavLink
							className={({ isActive }) =>
								isActive
									? "sidebar__link_active"
									: "sidebar__link"
							}
							to={"/root/episodes"}
						>
							<VideoIcons />
							<span>Эпизоды</span>
						</NavLink>
					</li>
					<li className="sidebar__nav-item">
						<NavLink
							className={({ isActive }) =>
								isActive
									? "sidebar__link_active"
									: "sidebar__link"
							}
							to={"/root/banners"}
						>
							<Img />
							<span>Баннеры</span>
						</NavLink>
					</li>
					<li className="sidebar__nav-item">
						<NavLink
							className={({ isActive }) =>
								isActive
									? "sidebar__link_active"
									: "sidebar__link"
							}
							to={"/root/schedules"}
						>
							<Watch />
							<span>Расписание</span>
						</NavLink>
					</li>
					<li className="sidebar__nav-item">
						<NavLink
							className={({ isActive }) =>
								isActive
									? "sidebar__link_active"
									: "sidebar__link"
							}
							to={"/root/genres"}
						>
							<Images />
							<span>Жанры</span>
						</NavLink>
					</li>
					<li className="sidebar__nav-item">
						<NavLink
							className={({ isActive }) =>
								isActive
									? "sidebar__link_active"
									: "sidebar__link"
							}
							to={"/root/comments"}
						>
							<Msg />
							<span>Комментарии</span>
						</NavLink>
					</li>
				</ul>
				<ul className="sidebar-nav__list">
					<h3 className="sidebar__nav-title">Система</h3>
					<li className="sidebar__nav-item">
						<NavLink
							className={({ isActive }) =>
								isActive
									? "sidebar__link_active"
									: "sidebar__link"
							}
							to={"/root/users"}
						>
							<Usr />
							<span>Пользователи</span>
						</NavLink>
					</li>
					<li className="sidebar__nav-item">
						<NavLink
							className={({ isActive }) =>
								isActive
									? "sidebar__link_active"
									: "sidebar__link"
							}
							to={"/root/settings"}
						>
							<Settings />
							<span>Настройки</span>
						</NavLink>
					</li>
					<li className="sidebar__nav-item">
						<NavLink
							className={({ isActive }) =>
								isActive
									? "sidebar__link_active"
									: "sidebar__link"
							}
							to={"/root/logs"}
						>
							<Terminal />
							<span>Логи</span>
						</NavLink>
					</li>
				</ul>
			</nav>
			<footer className="sidebar__footer">
				<div className="sidebar__footer-wrapper">
					<div className="sidebar__footer-avatar">
						<img
							src={`${storageUrl}/user-${userData?.uuid}/${userData?.avatar_uuid}.png`}
							alt="avatar"
							loading="lazy"
							onError={(e) => {
								const img = e.currentTarget
								img.onerror = null
								img.src = `${storageUrl}/user-${userData?.uuid}/${userData?.avatar_uuid}.webp`
							}}
						/>
					</div>
					<div>
						<p className="sidebar__user-role">{userData?.role}</p>
						<p className="sidebar__user-name">
							{userData?.user_name}
						</p>
					</div>
				</div>
			</footer>
		</aside>
	)
})
