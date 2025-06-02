import { useEffect, useRef, useState } from "react"
import { Link } from "react-router-dom"
import { CSSTransition } from "react-transition-group"

import { BtnSearch } from "../../ui/btn/BtnSearch"
import { BtnRandomAnime } from "../../ui/btn/BtnRandomAnime"
import { Search } from "../popup/Search"

import "./style/header.sass"


export function Header() {
    const [isShowPopup, setIsShowPopup] = useState(false)
    const popupRef = useRef()

    const handleKeyDown = (e) => {
        if (e.keyCode === 191)
            setIsShowPopup(true)
    }

    useEffect(() => {
        document.addEventListener("keydown", handleKeyDown)            
        return () => {
            document.removeEventListener("keydown", handleKeyDown)
        }
    })

    return(
        <>
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
                                <Link className="header__link" to={"/anime/catalog"}>
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
                            <BtnRandomAnime/>
                        </li>
                        <li className="header__list-item">
                            <BtnSearch setVal={setIsShowPopup} />
                        </li>
                        <li className="header__list-item">
                            <Link className="header__link header__link_auth" to={"/app/settings/site"} title="Настройки">
                                <svg className="header__svg">
                                    <use xlinkHref="/main.svg#settings-svg"/>
                                </svg>
                            </Link>
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
        <CSSTransition classNames="transition" nodeRef={popupRef} in={isShowPopup} 
            timeout={300} mountOnEnter unmountOnExit
        >
            <Search ref={popupRef} setIsShow={setIsShowPopup}/>
        </CSSTransition>
        </>
    )
}
