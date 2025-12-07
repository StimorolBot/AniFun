import { useEffect, useRef, useState } from "react"

import { api } from "../../../../../api"
import { useFetch } from "../../../../../hook/useFetch"

import { WrapperSection } from "../../../wrapper/WrapperSection"
import { FranchisesItem } from "./item/FranchisesItem"
import { Loader } from "../../../../../components/loader/Loader"

import "./style.sass"


export function Franchises(){
    const transitionRef = useRef()
    const [response, setResponse] = useState([{ 
        "alias": null, 
        "poster": null, 
        "title": null, 
    }])

    const [request, isLoading, _] = useFetch(
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
                <WrapperSection title={"Франшизы"} link={"/anime/franchises"} ref={transitionRef} value={isLoading}>
                    <div className="transition" ref={transitionRef}>
                        {isLoading
                            ? <Loader/>
                            : <ul className="franchises__list">                    
                                {response?.map((item, index) => {
                                    return <FranchisesItem item={item} key={index}/>
                                })}  
                            </ul> 
                        }
                    </div>
                </WrapperSection>
            </div>
        </section>
    )
}