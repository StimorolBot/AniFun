import { memo } from "react"
import { Link } from "react-router-dom"

import "./style/sub_nav.sass"


export const SubNav = memo(({subNav}) => {

    return(
        <nav className="sub-nav">
            <ul className="sub-nav__list">
                { subNav.map((item) => {
                    return(
                        <li className="sub-nav__item" key={item.path}>
                            <Link className="sub-nav__link" to={item.path}>
                                {item.name}
                            </Link>
                        </li>
                    )
                })}
            </ul>
        </nav>
    )
})
