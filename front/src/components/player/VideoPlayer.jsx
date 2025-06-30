import { useRef, useState } from "react"

import { InputVideoProgress } from "../../ui/input/InputVideoProgress"
import { BtnPlayVideo } from "../../ui/btn/BtnPlayVideo"

import { useVideoPlayer } from "../../hook/useVideoPlayer"
import { BtnFullScreen } from "../../ui/btn/BtnFullScreen"
import { InputVolume } from "../../ui/input/InputVolume"
import { BtnSkipVideo } from "../../ui/btn/BtnSkipVideo"

import "./style/video_player.sass"



export const VideoPlayer = () => {
    const videoRef = useRef(null)
    const url = `http://localhost:8000/anime/releases/video/episode/${window.location.href.split("/").at(-1)}`
    
    const [isPlaying, setIsPlaying] = useState(false)
    const [currentProgress, setCurrentProgress] = useState(0)
    const [seekProgress, setSeekProgress] = useState(0)
    const [bufferProgress, setBufferProgress] = useState(0)

    const [timeChangesHandler] = useVideoPlayer(videoRef, setCurrentProgress, setSeekProgress, setBufferProgress)

    return(
        <div className="video-player__wrapper">
            <video 
                className="video-player"
                preload="metadata"
                controls={true}
                ref={videoRef}
                onTimeUpdate={timeChangesHandler}
            >
                <source src={url} type="video/mp4"/>
            </video>
            <div className="controls__container">
                 <InputVideoProgress
                    bufferProgress={bufferProgress}
                    ref={videoRef}
                    seekProgress={seekProgress}
                    currentProgress={currentProgress}
                />
                <div className="controls__btn-container">
                    <div></div>
                    <div className="controls__btn">
                        <BtnSkipVideo ref={videoRef} skipToForward={false}/>
                        <BtnPlayVideo ref={videoRef} isPlaying={isPlaying} setIsPlaying={setIsPlaying}/>
                        <BtnSkipVideo ref={videoRef}/>
                        
                    </div>
                    <div className="controls__btn-left">
                        <InputVolume ref={videoRef}/>
                        <BtnFullScreen ref={videoRef}/>
                    </div>
                </div>
            </div>
        </div>
    )
}
