import { Link } from "react-router-dom"

import "./style/header.sass"


export function Header() {
    return(
        <header className="header">
            <div className="container">
                <div className="header__inner">
                    <div className="header__logo">
                        <Link className="header__link" to={"/"}>
                            <svg className="header__logo-svg">
                                <use xlinkHref="/main.svg#logo-svg"/>
                            </svg>
                        </Link>
                    </div>
                    <nav className="header__navigation">
                        <ul className="header__list">
                            <li className="header__list-item">
                                <Link className="header__link" to={"/anime/releases"}>
                                    Релизы
                                </Link>
                            </li>
                            <li className="header__list-item">
                                <Link className="header__link" to={"/anime/schedule"}>
                                    Расписание
                                </Link>
                            </li>
                        </ul>
                    </nav>
                    <ul className="header__list">
                        <li className="header__list-item">
                            <Link className="header__link" to={"/anime/releases"} title="Случайный релиз">
                                <svg>
                                    <use xlinkHref="/main.svg#random-svg"/>
                                </svg>
                            </Link>
                        </li>
                        <li className="header__list-item">
                            <button className="header__search-btn" title="Поиск">
                                <svg className="header__svg">
                                    <use xlinkHref="/main.svg#search-svg"/>
                                </svg>
                            </button>
                        </li>
                        <li className="header__list-item">
                            <Link className="header__link header__link_auth" to={"/auth/login"} title="Войти">
                                <svg className="header__svg">
                                    <use xlinkHref="/main.svg#login-svg"/>
                                </svg>
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        </header>
    )
}
