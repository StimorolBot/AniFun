import { Fragment, memo, useRef, useState } from "react"

import { Helmet } from "react-helmet"
import { useInfiniteQuery, useQueries } from "@tanstack/react-query"
import { CSSTransition, SwitchTransition } from "react-transition-group"

import { SubNav } from ".././../../ui/nav/SubNav"
import { Header } from "../../../components/header/Header"
import { Footer } from "../../../components/footer/Footer"
import { ReleaseItem } from "./item/ReleaseItem"
import { ReleaseFilter } from "./aside/ReleaseFilter"

import { api } from "../../../api"
import { useObserver } from "../../../hook/useObserver"

import { BtnSwitch } from "../../../ui/btn/BtnSwitch"
import { InputSearch } from "../../../ui/input/InputSearch"
import { Loader } from "../../../components/loader/Loader"

import { useDebounce } from "../../../hook/useDebounce"

import "./style.sass"


export const Release = memo(() => {
    const [genres, setGenres] = useState()
    const [isShowFilter, setIsShowFilter] = useState(true)
    const [filterData, setFilterData] = useState({
        "title": "",
        "year": [],
        "type": [],
        "season": [],
        "status": [],
        "age_restrict": [],
        "genres": []
    })

    const transitionRef = useRef()
    const lastElementRef = useRef()

    const debounceSearchVal = useDebounce(filterData?.title)

    const hasAnyFilter = () => {
        setFilterData(s => ({...s, "genres": genres}))
        return Object.values(filterData).some((value) => Array.isArray(value) && value.length > 0)
    }

    const callback = async (pageParam) => {
        if ((debounceSearchVal?.length > 5) || hasAnyFilter())
            return api.get(
                "anime/releases/filter-title",
                {"params": {"size": 20, "page": pageParam, "data": JSON.stringify(filterData)}}
            ).then((r) => r.data)
        else
            return api.get("anime/releases", {"params": {"size": 20, "page": pageParam}}).then((r) => r.data)
    }

    const {data, fetchNextPage, refetch, hasNextPage, isFetchingNextPage, isLoading} = useInfiniteQuery({
        queryKey: ["releases-data", debounceSearchVal?.length > 5 ? debounceSearchVal : undefined],
        staleTime: 1000 * 60 * 3,
        initialPageParam: 1,
        queryFn: callback,
        getNextPageParam: (lastPage) => lastPage.page < lastPage.pages ? lastPage.page + 1 : undefined,
    })

    const items = data?.pages?.flatMap(page => page.items) ?? []

    const imgData = useQueries({
        queries: items.map(item => ({
            queryKey: ["releases-data-poster", item.anime.poster.poster_uuid],
            staleTime: 1000 * 60 * 3,
            queryFn: async () => {
                return await api.get(`/s3/anime-${item.anime.uuid}/${item.anime.poster.poster_uuid}`).then(r => r.data)
            }
        }))
    })

    useObserver(lastElementRef, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage)
    
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

    return(<>
        <Helmet>
            <title>Каталог релизов | AniFun</title>
        </Helmet>
        <div className="wrapper">
            <Header/>
            <main className="main">
                <div className="container">
                    <div className="release__container">
                        <SubNav subNav={subNav}/>
                        <div className="release__search">
                            <InputSearch
                                val={filterData?.title} 
                                setVal={(e) => setFilterData(s => ({...s, "title": e.target.value}))}
                                autoComplete={"off"}
                                minLength={5}
                                maxLength={150}
                                placeholder={"Введите название аниме"}
                            />
                            <div className="release__btn-filter">
                                <BtnSwitch value={isShowFilter} callback={() => setIsShowFilter(s => !s)}>
                                    {isShowFilter
                                        ?<use xlinkHref="/svg/release.svg#filter-svg"/>
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
                                        {items.length === 0 && isLoading === false && 
                                            <li className="empty-response">
                                                <svg className="empty-response__svg">
                                                    <use xlinkHref="/public/svg/header.svg#not-find-svg"/>
                                                </svg>
                                                <div>
                                                    <p>Не удалось найти релиз</p>
                                                </div>
                                            </li>  
                                        }
                                        {items.map((item, index) => {
                                            return(
                                                <Fragment key={index}>
                                                    <ReleaseItem item={item} imgData={imgData[index]?.data}/>
                                                    <span className="release__separation"/>
                                                </Fragment>
                                            )       
                                        })}
                                        <span className="last-element" ref={lastElementRef}/>
                                        {isLoading && <Loader/>}
                                    </ul> 
                                </CSSTransition>
                            </SwitchTransition>
                            <ReleaseFilter
                                isShowFilter={isShowFilter} 
                                isLoading={isLoading}
                                filterData={filterData}
                                setFilterData={setFilterData}
                                genres={genres}
                                setGenres={setGenres}
                                refetch={refetch}
                            />
                        </div>
                    </div>
                </div>
            </main>
            <Footer/>
        </div>
    </>)
})
