import { memo } from "react"
import { useQueries, useQuery } from "@tanstack/react-query"

import { api } from "../../../../api"

import { AsideNewEpisodeItem } from "./item/AsideNewEpisodeItem"
import { AsideRecTitleItem } from "./item/AsideRecTitleItem"
import { Loader } from "../../../../components/loader/Loader"
import { 
    asideRecTitleCache, 
    asideRecTitleImgCache, 
    asideNewEpisodeCache, 
    asideNewEpisodeImgCache 
} from "../../../../query_key"

import "./style.sass"


export const AsideRecommendTitle = memo(() => {
    
    const {data: recTitleData, isLoading: isLoadingRecTitle} = useQuery({
        queryKey: [asideRecTitleCache],
        staleTime: 1000 * 60 * 3,
        retry: false,
        queryFn: async () => {
            return api.get("anime/recommend-title").then(r => r.data) 
        },
        placeholderData: []
    })

    const imgRecData = useQueries({
        queries: recTitleData?.map(item => ({
        queryKey: [asideRecTitleImgCache, item.poster_uuid],
        staleTime: 1000 * 60 * 3,
        queryFn: async () => {
            return await api.get(`/s3/anime-${item.uuid}/${item.poster_uuid}`).then(r => r.data)
        }}))
    })

    const {data: newEpisodeData, isLoading: isLoadingNewEpisode} = useQuery({
        queryKey: [asideNewEpisodeCache],
        staleTime: 1000 * 60 * 3,
        retry: false,
        queryFn: async () => {
            return api.get("/new-episode", {params: {"limit": 3}}).then(r => r.data) 
        },
        placeholderData: []
    })

    const imgNewEpisodeData = useQueries({
        queries: newEpisodeData?.map(item => ({
        queryKey: [asideNewEpisodeImgCache, item.anime.poster.poster_uuid],
        staleTime: 1000 * 60 * 3,
        queryFn: async () => {
            return await api.get(`/s3/anime-${item.anime.uuid}/${item.anime.poster.poster_uuid}`).then(r => r.data)
        }}))
    })
    

    return(
        <aside className="aside-rec">
            <div className="aside-rec__wrapper">
                <div className="aside-rec__new-title">
                    <h3>Новые эпизоды</h3>
                    {isLoadingNewEpisode
                        ? <Loader/>
                        : <ul>
                            {newEpisodeData?.map((item, index) => {
                            return <AsideNewEpisodeItem item={item} imgData={imgNewEpisodeData[index].data} key={index}/>
                        })}
                        </ul>
                    }
                </div>
                <div className="aside-rec__recommend-title">
                    <h3>Рекомендации</h3>
                    {isLoadingRecTitle
                        ? <Loader/>
                        : <ul className="rec-title__list">                     
                            {recTitleData?.map((item, index) => {
                                return <AsideRecTitleItem item={item} imgData={imgRecData[index].data} key={index}/>
                            })}
                        </ul>
                    }
                </div>
            </div>
        </aside>
    )
})
