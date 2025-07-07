import { useEffect, useRef, useState } from "react"
import { Link } from "react-router-dom"
import { CSSTransition } from "react-transition-group"

import { BtnSearch } from "../../ui/btn/BtnSearch"
import { BtnRandomAnime } from "../../ui/btn/BtnRandomAnime"
import { Search } from "../popup/Search"

import { api } from "../../api"
import { useFetch } from "../../hook/useFetch"

import "./style/header.sass"


export function Header() {
    const popupRef = useRef()
    const [isShowPopup, setIsShowPopup] = useState(false)
    const [response, setResponse] = useState({
        "avatar": "",
        "user_name": ""
    })

    const handleKeyDown = (e) => {
        if (e.keyCode === 191){
            setIsShowPopup(true)
            document.body.classList.add("scroll_block")
        }
    }

    useEffect(() => {
        document.addEventListener("keydown", handleKeyDown)            
        return () => {
            document.removeEventListener("keydown", handleKeyDown)
        }
    })

    const [request, isLoading, error] = useFetch(
        async () => {
            await api.get(
                "/users/user/avatar",
                {params: {"is_raise_exception": false}}
            )
            .then((r) => setResponse(r.data))
        }
    )

    useEffect(() => {(
        async () => {
            await request()
        })()
    }, [])

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
                            <Link className="header__link header__link_auth" to={"/settings/site"} title="Настройки">
                                <svg className="header__svg">
                                    <use xlinkHref="/main.svg#settings-svg"/>
                                </svg>
                            </Link>
                        </li>
                        <li className="header__list-item">
                            {response?.user_name
                                ? <div className="header__avatar-container">
                                    <Link className="header__link header__link_auth" to={"/settings/account"}>
                                    {response?.avatar
                                        ?<img className="header__avatar" src={response.avatar} alt="user_avatar" />
                                        :<div className="header__avatar">
                                            {response.user_name[0]}
                                        </div>
                                    }
                                    </Link>
                                </div>
                                :<Link className="header__link header__link_auth" to={"/auth/login"} title="Войти">
                                    <svg className="header__svg">
                                        <use xlinkHref="/main.svg#login-svg"/>
                                    </svg>
                                </Link>
                            }
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
