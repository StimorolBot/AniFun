import { memo, useEffect, useRef, useState } from "react"
import { CSSTransition, SwitchTransition } from "react-transition-group"

import { api } from "../../api"
import { useFetch } from "../../hook/useFetch"
import { useDebounce } from "../../hook/useDebounce"
import { useClickOutside } from "../../hook/useClickOutside"

import { InputSearch } from "../../ui/input/InputSearch"
import { SearchItem } from "../cards/SearchItem"
import { Loader } from "../loader/Loader"

import "./style/search.sass"


export const Search = memo(({ref, setIsShow}) => {    
    const transitionRef = useRef()
    const clickRef = useRef()
    const [searchVal, setSearchVal] = useState("")
    const [response, setResponse] = useState({"isFirstRequest": true})
    const debounceSearchVal = useDebounce(searchVal)
    
    const [request, isLoading, error] = useFetch(
        async () => {
            await api.get("/search-title", {params:{"title":searchVal}})
            .then((r) => {
                setResponse(r.data)
            })
        }
    )

    useEffect(() => {(
        async () => {
            if (searchVal !== "")
                await request()
            })()
    }, [debounceSearchVal])

    useClickOutside(clickRef, setIsShow)

   return(
        <dialog className="search-popup transition" ref={ref}>
             <div className="search-popup__container" ref={clickRef}>
                <button className="btn-close-popup">
                    <svg>
                        <use xlinkHref="/main.svg#close-svg" onClick={
                            () => {
                                document.body.classList.remove("scroll_block")
                                setIsShow(false)
                            }
                        }/>
                    </svg>
                </button>
                <search>
                    <form action="/search-title" method="get">
                        <InputSearch setVal={setSearchVal} val={searchVal}/>
                    </form>
                </search>

                <SwitchTransition mode="out-in">
                    <CSSTransition 
                        classNames="transition" 
                        key={isLoading}
                        nodeRef={transitionRef} 
                        timeout={300}
                    >
                        { isLoading
                            ? <Loader isLoading={isLoading}/>
                            :<ul className="search-popup__list transition" ref={transitionRef}>
                                <SwitchTransition mode="out-in">
                                    <CSSTransition 
                                        classNames="transition" 
                                        key={Boolean(response[0])}
                                        nodeRef={transitionRef} 
                                        timeout={300}
                                    >
                                        {response[0]
                                            ? <>{response?.map((item, index) => {
                                                return <SearchItem item={item} key={index}/>
                                            })}</>  
                                            :<li className="search-popup__svg">
                                                {response?.isFirstRequest
                                                    ?<>
                                                        <svg>
                                                            <use xlinkHref="/main.svg#search-doc-svg"/>
                                                        </svg>
                                                        <p>
                                                            Введите название релиза
                                                        </p>
                                                        <p>
                                                            Результаты вашего поиска появятся здесь
                                                        </p>
                                                    </>
                                                    :<>
                                                        <svg>
                                                            <use xlinkHref="/main.svg#not-find-svg"/>
                                                        </svg>
                                                        <p>
                                                            Нет подходящих тайтлов :(
                                                        </p>
                                                        <p>
                                                            {`Не удалось найти тайтил с именем ${debounceSearchVal}`}
                                                        </p>
                                                    </>
                                                }
                                            </li>
                                        }
                                    </CSSTransition>
                                </SwitchTransition>
                            </ul>
                        }
                    </CSSTransition>
                </SwitchTransition>
            </div>
            <div className="search-popup__info">
                <p>
                    Данное поисковое окно можно вызывать в любое время клавишей 
                    <code>/</code>
                </p>
                <p>
                    Чтобы закрыть поиск, вы можете нажать 
                    <code>Esc</code> 
                </p>
            </div> 
        </dialog>
    )
})
