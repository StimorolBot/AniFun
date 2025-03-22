import { memo } from "react"
import { Link } from "react-router-dom"

import "./style/auth_title.sass"


export const AuthTitle = memo(({title, desc}) => {
    return(
        <div className="auth__logo-container">
            <Link to={"/"}> 
                <svg className="auth__logo">
                    <use xlinkHref="/public/main.svg#logo-svg"/>
                </svg>
            </Link> 
            <h1 className="auth__title">
                {title}
            </h1>
            <p className="auth__header-desc">
                {desc}
            </p>
        </div>
    )
}) 
