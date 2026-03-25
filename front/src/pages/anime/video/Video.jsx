import { useRef } from "react"

import { Helmet } from "react-helmet"
import { useQuery } from "@tanstack/react-query"
import { useParams } from "react-router-dom"
import { CSSTransition, SwitchTransition } from "react-transition-group"

import { api } from "../../../api"

import { VideoPlayer } from "./player/VideoPlayer"
import { Loader } from "../../../components/loader/Loader"

import { videoCache, posterVideoCache } from "../../../query_key"

import "./style.sass"


export const Video = () => {
    const { uuid } = useParams()

    const videoRef = useRef(null)
    const transitionRef = useRef(null)

    const {data: videoData, isLoading} = useQuery({
        queryKey: [videoCache, uuid],
        staleTime: 1000 * 60 * 3,
        queryFn: async () => {
            return await api.get(`anime/videos/episode/episode-info/${uuid}`, {params: {"uuid": uuid}}).then(r => r.data)
        },
        placeholderData: []
    })

    const {data: posterData} = useQuery({
        queryKey: [posterVideoCache, uuid],
        enabled: !! videoData?.poster_uuid,
        staleTime: 1000 * 60 * 3,
         queryFn: async () => {
            return await api.get(`/s3/anime-${videoData.title_uuid}/${videoData.poster_uuid}`).then(r => r.data)
        }
    })

    return(<>
        <Helmet>
            <title>
                {`Эпизод ${videoData.number} | ${videoData.title}`}
            </title>
            <meta property="og:image" content={posterData}/>
        </Helmet>
        <main className="video-page">
            <h1 className="title-page">
                Страница с видео проигрывателем
            </h1>
            <SwitchTransition mode="out-in">
                <CSSTransition 
                    classNames="transition" 
                    key={isLoading}
                    nodeRef={transitionRef} 
                    timeout={300}
                >   
                    { isLoading
                        ? <Loader/>
                        : <div className="video__container">
                            {videoData.length !== 0 && 
                                <VideoPlayer 
                                    uuid={uuid}
                                    videoRef={videoRef}
                                    episodeNumber={videoData.number} 
                                    episodeName={videoData.name}
                                    titleUuid={videoData.title_uuid}
                                />
                            }
                        </div>
                    }
                </CSSTransition>
            </SwitchTransition>
        </main>
    </>
    )
}
