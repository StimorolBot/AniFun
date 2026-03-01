import {  useState } from "react"
import { useQueries, useQuery } from "@tanstack/react-query"

import { api } from "../../../../../api"

import { TitleVideoItem } from "./item/TitleVideoItem"
import { InputSearch } from "../../../../../ui/input/InputSearch"
import { ProgressEpisode } from "../../../../../ui/progressbar/ProgressEpisode"

import { Loader } from "../../../../../components/loader/Loader"

import "./style.sass"


export const TitleVideo = ({title, totalEpisodes, currentSlide}) => {
    const [titleSearch, setTitleSearch] = useState("")
    
    const {data: episodeData, isLoading} = useQuery({
        queryKey: ["episode-data"],
        staleTime: 1000 * 60 * 3,
        retry: false,
        queryFn: async () => {
            return await api.get(`anime/episodes/${title}`, {params: {"title": title}}).then(r => r.data)
        },
        placeholderData: []
    })

    const imgData = useQueries({
        queries: episodeData?.map(item => ({
        queryKey: ["episode-preview", item.preview_uuid],
        staleTime: 1000 * 60 * 3,
        queryFn: async () => {
            return await api.get(`/s3/anime-${item.title_uuid}/${item.preview_uuid}`).then(r => r.data)
        }}))
    })

    const searchTitleCallback = () => {
        const searchTitle = episodeData.filter(f => (f.name?.includes(titleSearch.toLowerCase())) || (f.number == titleSearch))
        if (searchTitle.length !== 0)
            return searchTitle.map((item, index) => {
                return <TitleVideoItem item={item} key={index}/>
            })
        else
            return <p className="title-search__not-found">
                Не удалось найти эпизод :(
            </p>
    }

    return(
        <section className="title-release__section" style={{"marginLeft": currentSlide.marginLeft}}>
            {isLoading
                ? <Loader/>
                : episodeData
                    ?<>
                        <div className="title-release__container">
                            <InputSearch
                                val={titleSearch} 
                                setVal={setTitleSearch} 
                                placeholder={"Введите название или номер серии"}
                            />
                        </div>
                        <ProgressEpisode maxValue={totalEpisodes}/>
                        <ul className="title-video__list">
                            {titleSearch === ""
                                ? episodeData.map((item, index) => {
                                    return <TitleVideoItem item={item} imgData={imgData[index].data} key={index}/> 
                                })
                                : searchTitleCallback()
                            }   
                        </ul>
                    </>
                    :<p className="title-release__empty-continuation">
                        В скором времени мы добавим новые эпизоды для "{title}".
                    </p>
            }
        </section>
    )
}
