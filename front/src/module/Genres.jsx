import { useEffect, useRef, useState } from "react"
import { CSSTransition, SwitchTransition } from "react-transition-group"

import { api } from "../api"
import { useFetch } from "../hook/useFetch"

import { GenresItem } from "../components/cards/GenresItem"
import { HeaderSection } from "../components/header/HeaderSection"

import { Loader } from "../components/loader/Loader"

import "./style/genres.sass"


export function Genres(){
    const transitionRef = useRef()
    const [response, setResponse] = useState([{
        "poster": null,
        "genres_count": null,
        "genres": null,
        "alias": null
    }])
    
    const [request, isLoading, error] = useFetch(
        async () => {
            await api.get("/genres").then((r) => setResponse(r.data))
        }
    )
    
    useEffect(() => {(
        async () => {
            await request()
        })()
    }, [])

    return(
        <section className="genres">
            <div className="container">
                <HeaderSection title={"Жанры"} link={"/anime/genres"} description={"Список жанров"}/>
                <SwitchTransition mode="out-in">
                    <CSSTransition 
                        classNames="transition" 
                        key={isLoading}
                        nodeRef={transitionRef} 
                        timeout={300}
                    >
                        <div className="transition" ref={transitionRef}>  
                            { isLoading
                                ?<Loader/>
                                :<ul className="genres__list">
                                    {response?.map((item, index) => {
                                        return(<GenresItem item={item} key={index}/>)
                                    })}
                                </ul>
                            }
                        </div>
                    </CSSTransition>
                </SwitchTransition>
            </div>
        </section>
    )
}
