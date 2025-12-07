import { Fragment, memo, useContext, useEffect, useRef, useState } from "react"

import { Helmet } from "react-helmet"
import { CSSTransition, SwitchTransition } from "react-transition-group"

import { SubNav } from ".././../../ui/nav/SubNav"
import { Header } from "../../../components/header/Header"
import { Footer } from "../../../components/footer/Footer"

import { InputSearchTitle } from "../../../ui/input/InputSearchTitle"
import { BtnSwitch } from "../../../ui/btn/BtnSwitch"
import { Loader } from "../../../components/loader/Loader"

import { ReleaseItem } from "./item/ReleaseItem"
import { ReleaseFilter } from "./aside/ReleaseFilter"
import { usePagination } from "../../../hook/usePagination"
import { useDebounce } from "../../../hook/useDebounce"
import { GenresContext } from "../../../context/GenresContext"

import "./style.sass"


export const Release = memo(() => {
    const [isShowFilter, setIsShowFilter] = useState(true)
    const [titleSearch, setTitleSearch] = useState("")
    const {genresContext, setGenresContext} = useContext(GenresContext)

    const transitionRef = useRef()
    const lastElementRef = useRef()

    const [response, setResponse] = useState({
        "items": [{
            "title": "",
            "year": null,
            "type": "",
            "alias": "",
            "season": "",
            "age_restrict": "",
            "genres_rs": [{"genres": ""}],
            "img_rs": { "poster": ""}
        }],
        "total": null,
        "page": 1,
        "size": null,
        "pages": 1
    })

    const subNav = [
        {
            "name": "Главная страница",
            "path": "/"
        },
        {
            "name": "Аниме",
            "path": "#"
        }
    ]

    const debounceSearchVal = useDebounce(titleSearch)
    const [request, isLoading, _] = usePagination(lastElementRef, response, setResponse)

    useEffect(() => {(
        async () => {
            if (titleSearch.length === 0)
                await request("/anime/release/")
        })()
    }, [response?.page, titleSearch.length])

    useEffect(() => {(
        async () => {
            if (titleSearch.length >= 3)
                await request("/search-title", {"title":titleSearch})
            })()
    }, [debounceSearchVal])
    
    return(<>
        <Helmet>
            <title>Список аниме</title>
        </Helmet>
        <div className="wrapper">
            <Header/>
            <main className="main">
                <div className="container">
                    <div className="release__container">
                        <SubNav subNav={subNav}/>
                        <div className="release__search">
                            <InputSearchTitle
                                value={titleSearch} 
                                setValue={setTitleSearch}
                                autoComplete={"off"}
                                minLength={3}
                                maxLength={90}
                                placeholder={"Введите название аниме"}
                            />
                            <div className="release__btn-filter">
                                <BtnSwitch value={isShowFilter} callback={() => setIsShowFilter(s => !s)}>
                                    {isShowFilter
                                        ?<use xlinkHref="/svg/release.svg#filter-svg" />
                                        :<use xlinkHref="/svg/release.svg#filter-none-svg"/>
                                    }
                                </BtnSwitch>
                            </div>
                        </div>
                        <div className="release__inner">
                            <SwitchTransition mode="out-in">
                                <CSSTransition 
                                    classNames="transition" 
                                    key={isLoading}
                                    nodeRef={transitionRef} 
                                    timeout={300}
                                >
                                    <ul className="release__list transition" ref={transitionRef}>
                                        {response.items.length === 0 && isLoading == false && 
                                            <li className="empty-response">
                                                <svg className="empty-response__svg">
                                                    <use xlinkHref="/main.svg#not-find-svg"/>
                                                </svg>
                                                <div>
                                                    <p>Не удалось найти релиз</p>
                                                </div>
                                            </li>  
                                        }
                                        {response.items?.map((item, index) => {
                                            return(
                                                <Fragment key={index}>
                                                    <ReleaseItem item={item}/>
                                                    <span className="release__separation"/>   
                                                </Fragment>
                                            )}) 
                                        }
                                        <span className="last-element" ref={lastElementRef}/>
                                        {isLoading && <Loader/>}
                                    </ul>
                                </CSSTransition>
                            </SwitchTransition>
                            <ReleaseFilter
                                isShowFilter={isShowFilter} 
                                isLoading={isLoading}
                                setResponse={setResponse}
                                genres={genresContext}
                                setGenres={setGenresContext}
                                request={request}
                            />
                        </div>
                    </div>
                </div>
            </main>
            <Footer/>
        </div>
    </>)
})
