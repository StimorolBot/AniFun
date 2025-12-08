import { useEffect, useRef, useState } from "react"

import { Helmet } from "react-helmet"
import { useParams } from "react-router-dom"
import { CSSTransition, SwitchTransition } from "react-transition-group"

import { api } from "../../../api"
import { useFetch } from "../../../hook/useFetch"

import { Header } from "../../../components/header/Header"
import { Footer } from "../../../components/footer/Footer"

import { TitleNav } from "./nav/TitleNav/TitleNav"
import { AsideRecommendTitle } from "./aside/AsideRecommendTitle"
import { Loader } from "../../../components/loader/Loader"

import { AboutTitle } from "./section/about/AboutTitle"
import { TitleVideo } from "./section/video/TitleVideo"
import { TitleContinuation } from "./section/continuation/TitleContinuation"
import { TitleComment } from "./section/comment/TitleComment"
import { TitleSchedule } from "./section/schedule/TitleSchedule"

import "./style.sass"


export const Title = () => {    
    const {alias} = useParams() 
    const transitionRef = useRef(null)
    const [subNav, setSubNav] = useState([])
    const [currentSlide, setCurrentSlide] = useState({"position": 0, "width": 94, "request": "episode"})
    const [response, setResponse] = useState({
        "title": null,
        "year": null,
        "type": null,
        "season": null,
        "age_restrict": null,
        "description": null,
        "status": null,
        "total_episode": null,
        "is_origin": null,
        "day_week": null,
        "poster": null,
        "genres": []
    })

    const [request, isLoading, error] = useFetch(
        async () => {
            await api.get(`anime/${alias}`, {params: {"alias": alias}})
            .then((r) => {
                setResponse(r.data)
                setSubNav([
                    {
                        "name": "Главная страница",
                        "path": "/"
                    },
                    {
                        "name": "Аниме",
                        "path": "/anime/"
                    },
                    {
                        "name": r.data.title,
                        "path": "#"
                    }
                ])
                })
            }
        )

    useEffect(() => {(
        async () => {
            await request()
        })()
    }, [alias])

    return(<>
        <Helmet>
            <title>{response.title}</title>
            <meta property="og:title" content={response.title}/>
            <meta property="og:description" content={response.description}/>
            <meta property="og:image" content={`data:image/webp;base64,${response.poster}`}/>
        </Helmet>
        <div className="wrapper">
            <Header/>
            <SwitchTransition mode="out-in">
                <CSSTransition 
                    classNames="transition" 
                    key={isLoading}
                    nodeRef={transitionRef} 
                    timeout={300}
                >   
                    {isLoading
                    ?<Loader/>
                    :<main className="main">
                        <h1 className="title-page"> 
                            {`Смотреть аниме ${response.title}`}
                        </h1>
                        <div className="container">
                            <div className="container__inner">
                                <div className="section__container">
                                    <AboutTitle response={response} subNav={subNav}/>
                                    <TitleNav setCurrentSlide={setCurrentSlide} currentSlide={currentSlide}/> 
                                    <div className="title-episode__slider">
                                        <TitleVideo
                                            title={response.title} 
                                            lastEpisode={response.last_episode} 
                                            currentSlide={currentSlide}
                                        />
                                        <TitleContinuation 
                                            currentSlide={currentSlide} 
                                            alias={alias} 
                                            title={response?.title}
                                            isOrigin={response?.is_origin}    
                                        />
                                        <TitleComment 
                                            currentSlide={currentSlide} 
                                            alias={alias} 
                                            title={response?.title}
                                        />
                                        <TitleSchedule 
                                            currentSlide={currentSlide} 
                                            title={response?.title} 
                                            alias={alias}
                                        />
                                    </div>                    
                                </div>
                                <AsideRecommendTitle/>
                            </div>
                        </div>
                    </main>
                    }
                </CSSTransition>
            </SwitchTransition>
            <Footer/>             
        </div>
    </>
    )
}
                            