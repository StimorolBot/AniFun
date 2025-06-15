import { useEffect, useRef, useState } from "react"
import { CSSTransition, SwitchTransition } from "react-transition-group"
import { HeaderSection } from "../components/header/HeaderSection"

import { api } from "../api"
import { useFetch } from "../hook/useFetch"

import { Loader } from "../components/loader/Loader"
import { AnnounceItem } from "../components/cards/AnnounceItem"

import "./style/announcements.sass"


export function Announcements(){
    const transitionRef = useRef()
    const [response, setResponse] = useState()

    const [request, isLoading, error] = useFetch(
        async () => {
          await api.get("/announcements").then((r) => setResponse(r.data))
        }
    )
    
    useEffect(() => {(
        async () => {
            await request()
        })()
      }, [])
    
    return(
        <section className="announcements">
            <div className="container">
                <HeaderSection title={"Анонсы"} link={"/anime/announce"} description={"Самые горячие и свежие анонсы с аниме"}/>
                <SwitchTransition mode="out-in">
                    <CSSTransition 
                        classNames="transition" 
                        key={isLoading}
                        nodeRef={transitionRef} 
                        timeout={300}
                    >
                        <div className="transition" ref={transitionRef}>
                            { isLoading
                                ? <Loader/>
                                : <ul className="announce__list">
                                    {response?.map((item, index) => {
                                        return(<AnnounceItem item={item} key={index}/>)
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
