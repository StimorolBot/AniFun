import { useRef } from "react"
import { useQueries, useQuery } from "@tanstack/react-query"

import { api } from "../../../../../api"

import { GenresItem } from "./item/GenresItem"
import { WrapperSection } from "../../../wrapper/WrapperSection"
import { Loader } from "../../../../../components/loader/Loader"

import { genresCache, genresPosterCache } from "../../../../../query_key"

import "./style.sass"


export function Genres(){
    const transitionRef = useRef()

    const {data: genresData = [], isLoading} = useQuery({
        queryKey: [genresCache],
        staleTime: 1000 * 60 * 3,
        queryFn: async () => {
            return await api.get("/genres").then(r => r.data)
        }
    })

    const imgData = useQueries({
        queries: genresData?.map(item => ({
            queryKey: [genresPosterCache, item.poster_uuid],
            staleTime: 1000 * 60 * 3,
            queryFn: async () => {
                return await api.get(`/s3/img-genres-poster/${item.poster_uuid}`).then(r => r.data)
            }
        }))
    })
  
    return(
        <section className="genres">
            <div className="container">
                <WrapperSection title={"Жанры"} link={"/anime/genres"} ref={transitionRef} value={isLoading}>
                    <div className="transition" ref={transitionRef}>  
                        { isLoading
                            ? <Loader/>
                            : <ul className="genres__list">
                                {genresData?.map((item, index) => {
                                    return <GenresItem item={item} imgData={imgData[index].data} key={index}/>
                                })}
                            </ul>
                        }
                    </div>
                </WrapperSection>
            </div>
        </section>
    )
}
