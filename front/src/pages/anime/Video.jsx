import { useCallback, useEffect, useRef, useState } from "react"

import { Helmet } from "react-helmet"
import { Link, Navigate, useNavigate } from "react-router-dom"

import { api } from "../../api"
import { useFetch } from "../../hook/useFetch"

import "./style/video.sass"
import { VideoPlayer } from "../../components/player/VideoPlayer"


export const Video = () => {
    const navigate = useNavigate()

    return(
        <main className="video-page">
            <h1 className="title-page">
                Страница с видео проигрывателем
            </h1>
            <div className="video__container">
                <header className="video__header">
                    <Link className="video__link" onClick={() => navigate(-1)}>
                        <img className="video__img" src="/public/btn/prev-btn.svg" alt="back"/>
                    </Link>
                    <p className="video__title">
                        Название тайтла
                    </p>
                </header>
                <VideoPlayer/>
            </div>
       </main>
    )
}
