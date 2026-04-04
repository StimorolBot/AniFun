import { useEffect, useRef, useState } from "react"
import videojs from "video.js"

import { api } from "../../../../api"

import { Controls } from "../controls/Controls"
import { Loader } from "../../../../components/loader/Loader"

import {
    handleFullScreen, 
    handleProgress, 
    handlerTogglePlay, 
    handleTimeUpdate, 
    formatTime
} from "./utils"

import "./style/video_player.sass"


export const VideoPlayer = ({videoRef, uuid, episodeNumber, episodeName, titleUuid}) => {    
    const playerContainerRef = useRef()
    const timerRef = useRef()
    
    const [player, setPlayer] = useState()

    const [isLoading, setIsLoading] = useState()
    const [isPlaying, setIsPlaying] = useState(false)
    const [isShowControls, setIsShowControls] = useState(true)

    const [currentProgress, setCurrentProgress] = useState(0)
    const [seekProgress, setSeekProgress] = useState(0)
    const [bufferProgress, setBufferProgress] = useState(0)
    const [videoDuration, setVideoDuration] = useState(0)
    const [isFullScreen, setIsFullScreen] = useState(false)

    const videoSrc = `${api.defaults.baseURL}/anime/videos/episode/${titleUuid}/${uuid}`

    const sendLastFrameTime = () => { 
        const data = JSON.parse(localStorage.getItem("last_frame_time") || "{}")
        navigator.sendBeacon(
            `${api.defaults.baseURL}/anime/videos/save-last-frame-time`,
            JSON.stringify({"uuid": uuid, ...data[uuid]})
        )}

    useEffect(() => {(
        async () => {
            if (!videoRef.current) return
            
            const customPlayer = videojs(videoRef.current, {
                "controls": false,
                "preload": "metadata"
            })
            
            const lastFrameTime = JSON.parse(localStorage.getItem("last_frame_time") || "{}")
            videoRef.current.currentTime = parseFloat(lastFrameTime[uuid]?.time || 0.00)

            setPlayer(customPlayer)

            customPlayer.on(
                "timeupdate", 
                () => handleTimeUpdate(customPlayer, setCurrentProgress, setSeekProgress, setVideoDuration)
            )
            customPlayer.on("progress", () => handleProgress(customPlayer, setBufferProgress))
            customPlayer.on("loadedmetadata", () => setVideoDuration(customPlayer.duration() || 0))
            
            customPlayer.on("seeking", () => setIsLoading(true))
            customPlayer.on("seeked", () => setIsLoading(false))

            return(() => {
                customPlayer.off('timeupdate', handleTimeUpdate)
                customPlayer.off("progress", handleProgress)
                customPlayer.off("loadedmetadata", handleLoadedMetadata)
                customPlayer.off("seeking", () => setIsLoading(true))
                customPlayer.off("seeked", () => setIsLoading(false))
                customPlayer.dispose()
            })
        })()
    }, [])

    useEffect(() => {
        if (!player)
            return

        const onFullscreenChange = () => 
            setIsFullScreen(document.fullscreenElement === playerContainerRef.current)

        const onMouseMove =  () => {
            setIsShowControls(true)

            if (timerRef.current)
                clearTimeout(timerRef.current)

            timerRef.current = setTimeout(() => {
                setIsShowControls(false)
            }, 3000)
        }
        
        playerContainerRef.current?.addEventListener("dblclick", () => handleFullScreen(playerContainerRef))
        playerContainerRef.current?.addEventListener("mousemove", onMouseMove)
        
        window.addEventListener("pagehide", sendLastFrameTime)
        document.addEventListener("fullscreenchange", onFullscreenChange)

        return () => {
            playerContainerRef.current?.removeEventListener("dblclick", () => handleFullScreen(playerContainerRef))
            playerContainerRef.current?.removeEventListener("mousemove", onMouseMove)
            clearTimeout(timerRef.current)

            window.removeEventListener("pagehide", sendLastFrameTime)
            document.removeEventListener("fullscreenchange", onFullscreenChange)
        }
    }, [player])

    return(
        <div className="video-player__wrapper" ref={playerContainerRef}>
            <div className={
                isLoading 
                    ? "loader__container loader__container_active"
                    : "loader__container"
                }
            >
                <Loader/>
            </div>
            <div
                style={{"flex": "1"}}
                onClick={() => handlerTogglePlay(videoRef, setIsPlaying, uuid)}
            >
                <video 
                    className="video-player"
                    preload="metadata"  
                    ref={videoRef}
                >
                    <source src={videoSrc} type="video/mp4"/>
                </video>
            </div>
            <div>
                <div className={
                        isShowControls ? "video-player__info video-player__info_active" : "video-player__info"
                    }
                >
                    <div>
                        <h4>Эпизод {episodeNumber}</h4>
                        <h5>{episodeName}</h5>
                    </div>
                    <p>{`
                        ${formatTime(player?.currentTime())} /
                        ${formatTime(videoRef?.current?.duration)}     
                    `}</p>
                </div>
                <Controls
                    uuid={uuid}
                    player={player}
                    videoRef={videoRef}
                    playerContainerRef={playerContainerRef}
                    bufferProgress={bufferProgress}
                    seekProgress={seekProgress}
                    currentProgress={currentProgress}
                    videoDuration={videoDuration}
                    setIsPlaying={setIsPlaying}
                    isPlaying={isPlaying}
                    isLoading={isLoading}
                    isFullScreen={isFullScreen}
                    isShowControls={isShowControls}
                />
            </div>
        </div>
    )
}
