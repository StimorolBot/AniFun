import { NavLink } from "react-router-dom"

import { Msg } from "../../../../ui/icon/Msg"
import { Relations } from "../../../../ui/icon/Relations"
import { Video } from "../../../../ui/icon/Video"
import { Watch } from "../../../../ui/icon/Watch"

import "./style.sass"

export const TitleNav = () => {
	return (
		<nav>
			<ul className="title-nav__list">
				<li>
					<NavLink
						className={({ isActive }) =>
							isActive
								? "title-nav-link title-nav-link_active"
								: "title-nav-link"
						}
						to={"episodes"}
						end
					>
						<Video />
						Эпизоды
					</NavLink>
				</li>
				<li>
					<NavLink
						className={({ isActive }) =>
							isActive
								? "title-nav-link title-nav-link_active"
								: "title-nav-link"
						}
						to={"franchises"}
						end
					>
						<Relations />
						Порядок просмотра
					</NavLink>
				</li>
				<li>
					<NavLink
						className={({ isActive }) =>
							isActive
								? "title-nav-link title-nav-link_active"
								: "title-nav-link"
						}
						to={"comments"}
						end
					>
						<Msg />
						Комментарии
					</NavLink>
				</li>
				<li>
					<NavLink
						className={({ isActive }) =>
							isActive
								? "title-nav-link title-nav-link_active"
								: "title-nav-link"
						}
						to={"schedules"}
						end
					>
						<Watch />
						Расписание
					</NavLink>
				</li>
			</ul>
		</nav>
	)
}
