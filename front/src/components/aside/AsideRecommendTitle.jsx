import { memo, useEffect, useState } from "react"

import { api } from "../../api"
import { useFetch } from "../../hook/useFetch"

import { AsideNewEpisodeItem } from "../cards/AsideNewEpisodeItem"
import { AsideRecTitleItem } from "../cards/AsideRecTitleItem"

import "./style/aside_recommend_title.sass"


export const AsideRecommendTitle = memo(() => {
    const [responseNewEpisode, setResponseNewEpisode] = useState([{
        "episode_data":{
            "episode_number": null,
            "anime_data":{
                "alias": null,
                "title": null,
                "year": null,
                "type": null,
                "age_restrict": null,
                "season": null,
            }
        },
        "genres":[""],
        "poster": null
    }])
    
    const [responseRecTitle, setResponseRecTitle] = useState([{
        "alias": null,
        "title": null,
        "year": null,
        "type": null,
        "age_restrict": null,
        "season": null,
        "poster": null
    }])

    const [requestNewTitle, isLoadingNewTitle, errorNewTitle] = useFetch(
        async () => {
            await api.get("/new-episode", {params: {"limit": 3}}).then((r) => setResponseNewEpisode(r.data))
        }
    )
    
    const [requestRecTitle, isLoadingRecTitle, errorRecTitle] = useFetch(
        async () => {
            await api.get("/anime/releases/recommend-title").then((r) => setResponseRecTitle(r.data))
        }
    )
    useEffect(() => {(
        async () => {
            await requestNewTitle()
            await requestRecTitle()
        })()
    }, [])
    
    
    return(
        <aside className="aside-rec">
            <div className="aside-rec__wrapper">
                <div className="aside-rec__new-title">
                    <h3>Новые эпизоды</h3>
                    <ul>{
                        responseNewEpisode?.map((item, index) => {
                            return <AsideNewEpisodeItem item={item} key={index}/>
                        })
                    }</ul>
                </div>
                <div className="aside-rec__recommend-title">
                    <h3>Рекомендации</h3>
                    <ul className="rec-title__list">                     
                        {responseRecTitle?.map((item, index) => {
                            return <AsideRecTitleItem item={item} key={index}/>
                        })
                        }
                    </ul>
                </div>
            </div>
        </aside>
    )
})
