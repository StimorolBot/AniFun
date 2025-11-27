import { useEffect, useState } from "react"
import videojs from "video.js"

import { handleFullScreen, handleKeyPress, handleProgress, handlerTogglePlay, handleSeek, handleTimeUpdate } from "./utils"

import { InputVolume } from "../../ui/input/InputVolume"
import { InputVideoProgress } from "../../ui/input/InputVideoProgress"

import { BtnSwitch } from "../../ui/btn/BtnSwitch"

import "./style/video_player.sass"


export const VideoPlayer = ({videoRef, uuid, episodeNumber, episodeName}) => {
    
    const [player, setPlayer] = useState()
    const [isPlaying, setIsPlaying] = useState(false)
    
    const [currentProgress, setCurrentProgress] = useState(0)
    const [seekProgress, setSeekProgress] = useState(0)
    const [bufferProgress, setBufferProgress] = useState(0)
    const [videoDuration, setVideoDuration] = useState(0)

    const videoSrc = `http://localhost:8000/anime/videos/episode/${uuid}`
    
    useEffect(() => {(
        async () => {
            if (!videoRef.current) return
            
            const customPlayer = videojs(videoRef.current, {
                controls: false,
                preload: "metadata"
            })

            setPlayer(customPlayer)

            customPlayer.on("timeupdate", () => handleTimeUpdate(customPlayer, setCurrentProgress, setSeekProgress, setVideoDuration))
            customPlayer.on("progress", () => handleProgress(customPlayer, setBufferProgress))
            customPlayer.on("loadedmetadata", () => setVideoDuration(customPlayer.duration() || 0))
        
            return(() => {
                customPlayer.off('timeupdate', handleTimeUpdate)
                customPlayer.off("progress", handleProgress)
                customPlayer.off("loadedmetadata", handleLoadedMetadata)
                customPlayer.dispose()
            })
        })()
    }, [])

    useEffect(() => {
        if (!player) return

        document.addEventListener("keydown", (event) => handleKeyPress(event, videoRef, setIsPlaying, player))

        return () => {
             document.removeEventListener('keydown', handleKeyPress)
        }
    }, [player])

    return(
        <div className="video-player__wrapper">
            <div
                style={{"flex": "1"}}
                onClick={() => handlerTogglePlay(videoRef, setIsPlaying)}
                onDoubleClick={() => handleFullScreen(player)}
            >
                <video 
                    className="video-player"
                    preload="metadata"  
                    ref={videoRef}
                >
                    <source src={videoSrc} type="video/mp4"/>
                </video>
            </div>
            <div className="video-player__info">
                <h2>Эпизод {episodeNumber}</h2>
                <h2>{episodeName}</h2>
            </div>
            <div className="controls__container">
                <InputVideoProgress
                    player={player}
                    ref={videoRef}
                    bufferProgress={bufferProgress}
                    seekProgress={seekProgress}
                    currentProgress={currentProgress}
                    setSeekProgress={handleSeek}
                    videoDuration={videoDuration}
                />
                <div className="controls__btn-container">
                    <div className="controls__btn">
                        <BtnSwitch value={isPlaying} callback={() => handlerTogglePlay(videoRef, setIsPlaying)}>
                            {isPlaying
                                ? <use xlinkHref="/svg/video.svg#btn-pause-svg"/>
                                : <use xlinkHref="/svg/video.svg#btn-play-svg"/>
                            }
                        </BtnSwitch>
                    </div>
                    <div className="controls__btn-right">
                        <InputVolume ref={videoRef}/>
                         <BtnSwitch value={player?.isFullscreen()} callback={() => handleFullScreen(player)}>
                            {player?.isFullscreen()
                                ? <use xlinkHref="/svg/video.svg#btn-fullscreen-svg"/>
                                : <use xlinkHref="/svg/video.svg#btn-fullscreen-svg"/>
                            }
                        </BtnSwitch>
                    </div> 
                </div>
            </div>
        </div>
    )
}
