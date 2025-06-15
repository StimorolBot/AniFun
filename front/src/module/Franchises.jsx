import { useEffect, useRef, useState } from "react"
import { CSSTransition, SwitchTransition } from "react-transition-group"

import { api } from "../api"
import { useFetch } from "../hook/useFetch"

import { HeaderSection } from "../components/header/HeaderSection"
import { FranchisesItem } from "../components/cards/FranchisesItem"
import { Loader } from "../components/loader/Loader"

import "./style/franchises.sass"


export function Franchises(){
    const transitionRef = useRef()
    const [response, setResponse] = useState([{
        "age_restrict": null, "alias": null, 
        "poster": null, "season": null,
        "title": null, "type": null,
        "year": null 
    }])

    const [request, isLoading, error] = useFetch(
        async () => {
          await api.get("/franchises").then((r) => setResponse(r.data))
        }
    )

    useEffect(() => {(
        async () => {
            await request()
        })()
    }, [])

    
    return(
        <section className="franchises">
            <div className="container">
                <HeaderSection 
                    title={"Популярный франшизы"} link={"/anime/franchises/"}
                    description={"Франшизы, которые могут заинтересовать вас"}
                />
                <SwitchTransition mode="out-in">
                    <CSSTransition 
                        classNames="transition" 
                        key={isLoading}
                        nodeRef={transitionRef} 
                        timeout={300}
                    >
                        <div className="transition" ref={transitionRef}>
                            {isLoading
                                ?<Loader/>
                                :<ul className="franchises__list">                    
                                    {response?.map((item, index) => {
                                        return(<FranchisesItem item={item} key={index}/>)
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