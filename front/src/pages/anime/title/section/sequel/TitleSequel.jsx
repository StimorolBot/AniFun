import { memo } from "react"
import { useQueries, useQuery } from "@tanstack/react-query"

import { api } from "../../../../../api"

import { TitleSequelItem } from "./item/TitleSequelItem"
import { Loader } from "../../../../../components/loader/Loader"

import "./style.sass"


export const TitleSequel = memo(({currentSlide, title, alias, isOrigin}) => {
    const {data: titleSequelData, isLoading, error} = useQuery({
        queryKey: ["title-sequel-data", alias],
        staleTime: 1000 * 60 * 3,
        retry: false,
        queryFn: async () => {
            return await api.get(`anime/sequel/${title}`, {params: {"title": title, "is_origin": isOrigin}}).then(r => r.data)
        },
        placeholderData: []
    })

    const imgData = useQueries({
        queries: titleSequelData?.map(item => ({
        queryKey: ["title-sequel-poster", item.poster_uuid],
        staleTime: 1000 * 60 * 3,
        queryFn: async () => {
            return await api.get(`/s3/anime-${item.uuid}/${item.poster_uuid}`).then(r => r.data)
        }}))
    })

    return(
        <section className="title-release__section" style={{"marginLeft": currentSlide.marginLeft}} >
            {isLoading
                ? <Loader/>
                : titleSequelData?.length !== 0
                    ? <div  className="title-release__container">
                        <ul className="title-continuation__list">
                            {titleSequelData.map((item, index) => {
                                return (
                                    <TitleSequelItem 
                                        item={item}
                                        imgData={imgData[index].data} 
                                        index={index+1}
                                        title={title} 
                                        key={index} 
                                    /> 
                                )
                            })}
                        </ul>
                    </div>
                    :<p className="title-release__empty-continuation">
                        У тайтла "{title}" нет продолжения.
                    </p>
            }
        </section>
    )
})
