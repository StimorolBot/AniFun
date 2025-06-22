import { useEffect, useState } from "react"
import {Helmet} from "react-helmet"

import { api } from "../../api"
import { useFetch } from "../../hook/useFetch"

import { Header } from "../../components/header/Header"
import { Footer } from "../../components/footer/Footer"

import { TitleData } from "../../components/section/TitleData"
import { TitleVideo } from "../../components/section/TitleVideo"

import { TitleEpisodeNav } from "../../ui/nav/TitleEpisodeNav"

import "./style/title_episodes.sass"


export function TitleEpisodes(){
    const [subNav, setSubNav] = useState([])
    const [response, setResponse] = useState({
        "data": {
            "title": null,
            "year": null,
            "type": null,
            "season": null,
            "age_restrict": null,
            "description": null,
            "status": null
        },
        "day_week": null,
        "poster": null,
        "genres": [],
        "last_episode": null 
    })

    const [request, isLoading, error] = useFetch(
        async (alias) => {
            await api.get(`anime/releases/release/${alias}/episodes`)
            .then((r) => {
                setResponse(r.data[0])
                setSubNav([
                    {
                        "name": "Главная страница",
                        "path": "/"
                    },
                    {
                        "name": "Каталог релизов",
                        "path": "/anime/catalog/"
                    },
                    {
                        "name": r.data[0].data.title,
                        "path": "#"
                    }
                ])
                })
            }
        )


    useEffect(() => {(
        async () => {
            await request(window.location.href.split("/")[6])
        })()
    }, [])

    return(<>
        <Helmet>
            <title>{response.data.title}</title>
            <meta property="og:title" content={response.data.title}/>
            <meta property="og:description" content={response.data.description}/>
            <meta property="og:image" content={`data:image/webp;base64,${response["poster"]}`}/>
        </Helmet>
        <div className="wrapper">
            <Header/>
            <main className="main">
                <h1 className="title-page"> 
                    {`Смотреть аниме ${response.data.title}`}
                </h1>
                <div className="container">
                    <div className="section__container">
                        <TitleData response={response} subNav={subNav}/>
                        <TitleEpisodeNav alias={response.data.alias}/>
                        <TitleVideo title={response.data.title} lastEpisode={response.last_episode}/>
                    </div>
                <aside></aside>
                </div>
            </main>
            <Footer/>  
        </div>
    </>
    )
}
                            