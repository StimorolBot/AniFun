import { useEffect, useRef, useState } from "react"

import { Helmet } from "react-helmet"
import { Link, useNavigate, useParams } from "react-router-dom"
import { CSSTransition, SwitchTransition } from "react-transition-group"

import { api } from "../../../api"
import { useFetch } from "../../../hook/useFetch"

import { VideoPlayer } from "./player/VideoPlayer"
import { Loader } from "../../../components/loader/Loader"

import "./style.sass"


export const Video = () => {
    const navigate = useNavigate()
    const { uuid } = useParams()

    const videoRef = useRef(null)
    const transitionRef = useRef(null)


    const [response, setResponse] = useState({
        "title" : "",
        "episode_number": "",
        "episode_name": "",
        "preview": ""
    })

    const [request, isLoading, error] = useFetch(
        async () => {
            await api.get(`anime/videos/episode/episode-info/${uuid}`)
            .then(r => setResponse(r.data))
        }
    )
    
    useEffect(() => {(
        async () => {
            await request()
        })()
    }, [])

    return(<>
        <Helmet>
            <title>
                {
                    `Эпизод ${response.episode_number} | 
                    ${response.title || null} | 
                    ${response.title}`
                }
            </title>
            <meta property="og:image" content={`data:image/webp;base64,${response.preview}`}/>
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
                            <header className="video__header">
                                <Link className="video__link" onClick={() => navigate(-1)}>
                                    <img className="video__img" src="/public/btn/prev-btn.svg" alt="back"/>
                                </Link>
                                <p className="video__title">
                                    {response.title}
                                </p>
                            </header>
                            <VideoPlayer 
                                uuid={uuid}
                                videoRef={videoRef}
                                episodeNumber={response.episode_number} 
                                episodeName={response.episode_name}
                            />
                        </div>
                    }
                </CSSTransition>
            </SwitchTransition>
        </main>
    </>
    )
}
