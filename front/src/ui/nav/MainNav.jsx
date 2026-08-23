import { memo } from "react"

import { NavLink } from "react-router-dom"

import "./style/sub_nav.sass"

export const MainNav = memo(({ subNav }) => {
	return (
		<nav className="sub-nav">
			<ul className="sub-nav__list">
				{subNav.map((item) => {
					return (
						<li className="sub-nav__item" key={item.path}>
							<NavLink className="sub-nav__link" to={item.path}>
								{item.name}
							</NavLink>
						</li>
					)
				})}
			</ul>
		</nav>
	)
})
