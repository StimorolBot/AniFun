import { useEffect, useRef, useState } from "react"

import { api } from "../../../../../api"
import { useFetch } from "../../../../../hook/useFetch"

import { GenresItem } from "./item/GenresItem"
import { WrapperSection } from "../../../wrapper/WrapperSection"
import { Loader } from "../../../../../components/loader/Loader"

import "./style.sass"


export function Genres(){
    const transitionRef = useRef()
    const [response, setResponse] = useState([{
        "poster": null,
        "genres_count": null,
        "genres": null,
        "alias": null
    }])
    
    const [request, isLoading, _] = useFetch(
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
                <WrapperSection title={"Жанры"} link={"/anime/genres"} ref={transitionRef} value={isLoading}>
                    <div className="transition" ref={transitionRef}>  
                        { isLoading
                            ? <Loader/>
                            : <ul className="genres__list">
                                {response?.map((item, index) => {
                                    return <GenresItem item={item} key={index}/>
                                })}
                            </ul>
                        }
                    </div>
                </WrapperSection>
            </div>
        </section>
    )
}
