import { useEffect, useRef, useState } from "react"

import { useQuery } from "@tanstack/react-query"
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

    const {data: authData, isLoading, error} = useQuery({
        queryKey: ["auth-data"],
        staleTime: 1000 * 60 * 3,
        retry: false,
        queryFn: async () => {
            return await api.get("/users/info", {params: {"is_raise_exception": false}}).then(r => r.data)
        },
        placeholderData: []
    })

    const [requestRandomTitle, _] = useFetch(
        async () => {
            await api.get("/random-title").then((r) => {
                navigate(`/anime/${r.data.alias}`)
            })
        }
    )

    const handleKeyDown = (e) => {
        if (e.keyCode === 191){
            setIsShowPopup(true)
            document.body.classList.add("scroll_block")
        }
    }

    useEffect(() => {
        document.body.classList.remove("scroll_block")
    }, [])

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
                                <use xlinkHref="/public/logo/logo.svg"/>
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
                                <svg >
                                    <use xlinkHref="/public/svg/header.svg#random-svg"/>
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
                                <svg className="header__svg">
                                    <use xlinkHref="/public/svg/header.svg#search-svg"/>
                                </svg>
                            </BtnDefault>
                        </li>
                        <li className="header__list-item">
                            {isLoading
                            ? <Loader size={"small"}/>
                            : authData?.uuid
                                ?<Link className="header__avatar-link" to={`/users/${authData.uuid}`}>
                                    <img className="header__avatar" src={`data:image/webp;base64,${authData.avatar}`} alt="user_avatar" />
                                </Link>
                                :<Link className="header__link header__link_auth" to={"/auth/login"} title="Войти">
                                    <svg className="header__svg">
                                        <use xlinkHref="/public/svg/header.svg#login-svg"/>
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
