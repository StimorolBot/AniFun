import { useEffect, useState } from "react"

import { api } from "../api"
import { useFetch } from "../hook/useFetch"

import { GenresItem } from "../components/cards/GenresItem"
import { HeaderSection } from "../components/header/HeaderSection"

import { Loader } from "../components/loader/Loader"

import "./style/genres.sass"


export function Genres(){
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
                 { isLoading
                    ?<Loader isLoading={isLoading}/>
                    :<ul className="genres__list">
                        {response?.map((item, index) => {
                            return(<GenresItem item={item} key={index}/>)
                        })}
                    </ul>
                }
            </div>
        </section>
    )
}