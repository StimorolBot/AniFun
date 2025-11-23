import { useEffect, useState } from "react"

import { api } from "../../api"
import { useFetch } from "../../hook/useFetch"

import { TitleVideoItem } from "../cards/TitleVideoItem"
import { ProgressEpisode } from "../../ui/progressbar/ProgressEpisode"
import { InputSearchTitle } from "../../ui/input/InputSearchTitle"
import { Loader } from "../loader/Loader"

import "./style/title_video.sass"


export const TitleVideo = ({title, lastEpisode, currentSlide}) => {
    const [titleSearch, setTitleSearch] = useState("")
    const [response, setResponse] = useState([{
        "uuid": "",
        "date_add": "",
        "episode_number": "",
        "episode_name": "",
        "preview": ""
    }])

    const [request, isLoading, error] = useFetch(
        async () => {
            await api.get(`anime/releases/release/${title}/episodes/released`, {params:{"title": title}})
            .then((r) => {setResponse(r.data)})
        }
    )

    useEffect(() => {(
        async () => {
            if (currentSlide.request === "episode")
                await request(title)
        })()
    }, [currentSlide.request, title])
    
    return(
        <section className="title-release__slide" style={{"marginLeft": currentSlide.marginLeft}}>
            {isLoading
                ? <Loader/>
                : response.length > 1
                    ?<>
                        <div className="title-release__container">
                            <InputSearchTitle
                                value={titleSearch} 
                                setValue={setTitleSearch} 
                                placeholder={"Введите название или номер серии"}
                            />
                        </div>
                        <ProgressEpisode lastEpisode={lastEpisode}/>
                        <ul className="title-video__list">
                            {titleSearch === ""
                                ? response.map((item, index) => {
                                    return <TitleVideoItem item={item} key={index}/> 
                                })
                                : response.filter(f => (f.episode_name?.includes(titleSearch)) || (f.episode_number == titleSearch))
                                    .map((item, index) => {
                                        return <TitleVideoItem item={item} key={index}/> 
                                })
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
