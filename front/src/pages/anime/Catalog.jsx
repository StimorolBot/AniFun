import { Fragment, memo, useContext, useEffect, useRef, useState } from "react"

import { Helmet } from "react-helmet"
import { CSSTransition, SwitchTransition } from "react-transition-group"

import { SubNav } from "../../ui/nav/SubNav"
import { Header } from "../../components/header/Header"
import { Footer } from "../../components/footer/Footer"

import { InputSearchTitle } from "../../ui/input/InputSearchTitle"
import { BtnSwitch } from "../../ui/btn/BtnSwitch"
import { Loader } from "../../components/loader/Loader"

import { CatalogItem } from "../../components/cards/CatalogItem"
import { AsideFilterCatalog } from "../../components/aside/AsideFilterCatalog"
import { usePagination } from "../../hook/usePagination"
import { useDebounce } from "../../hook/useDebounce"
import { GenresContext } from "../../context/GenresContext"

import "./style/catalog.sass"


export const Catalog = memo(() => {
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
            "name": "Каталог релизов",
            "path": "#"
        }
    ]

    const debounceSearchVal = useDebounce(titleSearch)
    const [request, isLoading, error] = usePagination(lastElementRef, response, setResponse)

    useEffect(() => {(
        async () => {
            if (titleSearch.length === 0)
                await request("anime/catalog")
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
            <title>Каталог</title>
        </Helmet>
        <div className="wrapper">
            <Header/>
            <main className="main">
                <div className="container">
                    <div className="catalog__container">
                        <SubNav subNav={subNav}/>
                        <h1 className="catalog__title">
                            Каталог аниме
                        </h1>
                        <div className="catalog__search">
                            <InputSearchTitle
                                value={titleSearch} 
                                setValue={setTitleSearch}
                                autoComplete={"off"}
                                maxLength={90}
                                placeholder={"Введите название или номер серии"}
                            />
                            <div className="catalog__btn-filter">
                                <BtnSwitch value={isShowFilter} callback={() => setIsShowFilter(s => !s)}>
                                    {isShowFilter
                                        ?<use xlinkHref="/catalog.svg#filter-svg" />
                                        :<use xlinkHref="/catalog.svg#filter-none-svg"/>
                                    }
                                </BtnSwitch>
                            </div>
                        </div>
                        <div className="catalog__inner">
                            <SwitchTransition mode="out-in">
                                <CSSTransition 
                                    classNames="transition" 
                                    key={isLoading}
                                    nodeRef={transitionRef} 
                                    timeout={300}
                                >
                                    <ul className="catalog__list transition" ref={transitionRef}>
                                        {response.items.length === 0 && isLoading == false && 
                                            <li className="empty-response">
                                                <svg className="empty-response__svg">
                                                    <use xlinkHref="/main.svg#not-find-svg"/>
                                                </svg>
                                                <div>
                                                    <h4>Нет подходящих тайтлов :(</h4>
                                                    <p>Не удалось найти тайтл с именем: {titleSearch}</p>
                                                </div>
                                            </li>
                                            
                                        }
                                        {response.items?.map((item, index) => {
                                            return(
                                                <Fragment key={index}>
                                                    <CatalogItem item={item}/>
                                                    <span className="catalog__separation"/>   
                                                </Fragment>
                                            )}) 
                                        }
                                        <span className="last-element" ref={lastElementRef}/>
                                        {isLoading && <Loader/>}
                                    </ul>
                                </CSSTransition>
                            </SwitchTransition>
                            <AsideFilterCatalog
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
