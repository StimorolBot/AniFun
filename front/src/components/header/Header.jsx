import { useEffect, useRef, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { CSSTransition } from "react-transition-group"

import { Search } from "../popup/Search"
import { Loader } from "../loader/Loader"
import { BtnDefault } from "../../ui/btn/BtnDefault"

import { api } from "../../api"
import { useFetch } from "../../hook/useFetch"

import "./style/header.sass"


export function Header() {
    const popupRef = useRef()
    const navigate = useNavigate()

    const [isShowPopup, setIsShowPopup] = useState(false)
    const [response, setResponse] = useState({
        "avatar": "",
        "uuid": ""
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

    const [requestRandomTitle, _] = useFetch(
        async () => {
            await api.get("/random-title")
            .then((r) => {
                navigate(`/anime/${r.data.alias}`)
            })
        }
    )

    useEffect(() => {(
        async () => {
            await request()
            document.body.classList.remove("scroll_block")
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
                                <Link className="header__link" to={"/anime"}>
                                    Аниме
                                </Link>
                            </li>
                            <li className="header__list-item">
                                <Link className="header__link" to={"/anime/schedules"}>
                                    Расписание
                                </Link>
                            </li>
                        </ul>
                    </nav>
                    <ul className="header__list">
                        <li className="header__list-item">
                            <BtnDefault callback={async () => await requestRandomTitle()} isStroke={false} title="Случайное аниме">
                                <svg>
                                    <use xlinkHref="/main.svg#random-svg"/>
                                </svg>
                            </BtnDefault>
                        </li>
                        <li className="header__list-item">
                            <BtnDefault
                                callback={e => {
                                    document.body.classList.add("scroll_block")
                                    setIsShowPopup(true)
                                    e.stopPropagation()
                                }} 
                                title="Поиск аниме"
                            >
                                <svg>
                                    <use xlinkHref="/main.svg#search-svg"/>
                                </svg>
                            </BtnDefault>
                        </li>
                        <li className="header__list-item">
                            {isLoading
                            ? <Loader size={"small"}/>
                            : response?.uuid
                                ?<Link className="header__avatar-link" to={`/users/${response.uuid}`}>
                                    <img className="header__avatar" src={`data:image/webp;base64,${response.avatar}`} alt="user_avatar" />
                                </Link>
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
