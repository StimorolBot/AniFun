import { useEffect, useState } from "react"

import { api } from "../../api"
import { useFetch } from "../../hook/useFetch"

import { TitleVideoItem } from "../cards/TitleVideoItem"
import { BtnFilterDate } from "../../ui/btn/BtnFilterDate"
import { ProgressEpisode } from "../../ui/progressbar/ProgressEpisode"

import { InputSearchTitle } from "../../ui/input/InputSearchTitle"

import "./style/title_video.sass"


export const TitleVideo = ({title, lastEpisode}) => {
    const [titleSearch, setTitleSearch] = useState("")
    const [response, setResponse] = useState([{
        "schedule":{
            "date": null,
            "day_week": null,
            "episode_name": null,
            "episode_number": null,
            "uuid_episode": null
        },
        "preview": null,
    }])


    const [request, isLoading, error] = useFetch(
        async (title) => {
            await api.get(`anime/releases/release/${title}/episodes/videos`, {params:{"title": title}})
            .then((r) => {setResponse(r.data)})
            }
        )

    useEffect(() => {(
        async () => {
            await request(title)
        })()
    }, [title])
    
    return(
        <section className="title-video">
            <div className="title-search__container">
                <InputSearchTitle
                    value={titleSearch} 
                    setValue={setTitleSearch} 
                    placeholder={"Введите название или номер серии"}
                />
                <BtnFilterDate/>               
            </div>
            <ProgressEpisode lastEpisode={lastEpisode}/>
            <ul className="title-video__list">
                {
                    titleSearch === ""
                    ? response.map((item, index) => {
                        return <TitleVideoItem item={item} key={index}/> 
                    })
                    :response.filter(f => (f.schedule.episode_name.includes(titleSearch)) || (f.schedule.episode_number == titleSearch))
                    .map((item, index) => {
                        return <TitleVideoItem item={item} key={index}/> 
                    })
                }
            </ul>
        </section>
    )
}
