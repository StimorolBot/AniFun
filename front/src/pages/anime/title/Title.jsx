import { useRef, useState } from "react"

import { Helmet } from "react-helmet"
import { useParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { CSSTransition, SwitchTransition } from "react-transition-group"

import { api } from "../../../api"

import { Header } from "../../../components/header/Header"
import { Footer } from "../../../components/footer/Footer"

import { TitleNav } from "./nav/TitleNav"
import { AsideRecommendTitle } from "./aside/AsideRecommendTitle"
import { Loader } from "../../../components/loader/Loader"

import { AboutTitle } from "./section/about/AboutTitle"
import { TitleVideo } from "./section/video/TitleVideo"
import { TitleSequel } from "./section/sequel/TitleSequel"
import { TitleComment } from "./section/comment/TitleComment"
import { titleCache, titleCachePoster } from "../../../query_key"
import { TitleSchedule } from "./section/schedule/TitleSchedule"

import "./style.sass"


export const Title = () => {  
      
    const {alias} = useParams() 
    const transitionRef = useRef(null)
    const [currentSlide, setCurrentSlide] = useState({"position": 0, "width": 94, "section": "episode"})
    
    const {data: titleData, isLoading, error} = useQuery({
        queryKey: [titleCache, alias],
        staleTime: 1000 * 60 * 3,
        queryFn: async () => {
            return await api.get(`anime/about/${alias}`, {params: {"alias": alias}}).then(r => r.data)
        },
        placeholderData: []
    })

    const {data: imgData} = useQuery({
        queryKey: [titleCachePoster],
        enabled: !! titleData?.anime?.poster.poster_uuid,
        staleTime: 1000 * 60 * 3,
        retry: false,
        queryFn: async () => {
            return api.get(`/s3/anime-${titleData.anime.uuid}/${titleData.anime.poster.poster_uuid}`).then(r => r.data) 
        }
    })

    return(<>
        <Helmet>
            <title>{titleData?.anime?.title}</title>
            <meta property="og:title" content={titleData?.anime?.title}/>
            <meta property="og:description" content={titleData?.anime?.description}/>
            <meta property="og:image" content={imgData}/>
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
                    :<main className="main" ref={transitionRef}>
                        <h1 className="title-page"> 
                            {`Смотреть аниме ${titleData?.anime?.title}`}
                        </h1>
                        <div className="container">
                        {titleData?.anime && 
                            <div className="container__inner">
                                <div className="section__container">
                                    <AboutTitle titleData={titleData} imgData={imgData}/>
                                    <TitleNav setCurrentSlide={setCurrentSlide} currentSlide={currentSlide}/> 
                                    <div className="title-episode__slider">
                                        <TitleVideo
                                            title={titleData.anime.title} 
                                            alias={titleData.anime.alias}
                                            totalEpisodes={titleData?.anime?.total_episode} 
                                            currentSlide={currentSlide}
                                        />
                                        <TitleSequel
                                            currentSlide={currentSlide} 
                                            title={titleData.anime.title}
                                            alias={titleData.anime.alias}
                                            isOrigin={titleData.anime.is_origin}    
                                        />
                                        <TitleComment 
                                            currentSlide={currentSlide} 
                                            alias={titleData.anime.alias} 
                                            title={titleData.anime.title}
                                        />
                                        <TitleSchedule 
                                            currentSlide={currentSlide}
                                            alias={titleData.anime.alias}
                                            title={titleData.anime.title} 
                                        />
                                    </div>                     
                                </div>
                                <AsideRecommendTitle/>
                            </div>
                        }
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
