import { memo, useEffect, useState } from "react"

import { InputVolume } from "../../../../ui/input/InputVolume"
import { InputVideoProgress } from "../../../../ui/input/InputVideoProgress"

import { SettingsVideo } from "../../../../components/popup/SettingsVideo"

import { BtnDefault } from "../../../../ui/btn/BtnDefault"
import { Loader } from "../../../../components/loader/Loader"

import { handlePip, handleToggleMute, handleKeyPress } from "./utils"
import { handleFullScreen, handlerTogglePlay } from "../player/utils"

import "./style.sass"


export const Controls = memo(({
    uuid,
    alias,
    player,
    videoRef,
    playerContainerRef,
    bufferProgress,
    seekProgress,
    currentProgress,
    videoDuration,
    setIsPlaying,
    isPlaying,
    isLoading,
    isFullScreen,
    isShowControls
}) => {
    const [isShowSettings, setIsShowSettings] = useState(false)

    const videoSettingsLocalStorage = JSON.parse(localStorage.getItem("player_settings"))
    const [videoSettings, setVideoSettings] = useState({
        "quality": videoSettingsLocalStorage?.quality || 720,
        "volume": videoSettingsLocalStorage?.volume || 0.5,
        "speed": videoSettingsLocalStorage?.speed || 1,
        "isSkipOpening": videoSettingsLocalStorage?.isSkipOpening || false,
        "isSkipEnding": videoSettingsLocalStorage?.isSkipEnding || false,
        "isAutoPlay": videoSettingsLocalStorage?.isAutoPlay || false,
        "isAutoFullScreen": videoSettingsLocalStorage?.isAutoFullScreen || false
    })

    player?.playbackRate(videoSettings.speed)

    useEffect(() => {
        if (!player)
            return
        
        const onKeyDown = (event) => handleKeyPress(
            event,
            videoRef,            
            playerContainerRef,
            player,
            uuid,
            alias,
            videoSettings.volume,
            setVideoSettings,
            setIsPlaying
        )

        document.addEventListener("keydown", onKeyDown)

        return () => {
            document.removeEventListener("keydown", onKeyDown)
        }
    }, [])

    return(
        <div className={isShowControls ? "controls__container controls__container_active" : "controls__container"}>
            <InputVideoProgress
                uuid={uuid}
                alias={alias}
                player={player}
                ref={videoRef}
                bufferProgress={bufferProgress}
                seekProgress={seekProgress}
                currentProgress={currentProgress}
                videoDuration={videoDuration}
            />      
            <div className="controls__btn-container">
                <div className="controls__btn controls__btn_center">
                    <BtnDefault
                        value={isPlaying}
                        callback={() => handlerTogglePlay(videoRef, alias, uuid, setIsPlaying)}
                    >
                        {isLoading
                            ? <div className="loader__container_active">
                                <Loader size={"small"}/>
                        </div>
                            :<svg>
                                {isPlaying
                                    ? <use xlinkHref="/svg/video.svg#btn-pause-svg"/>
                                    : <use xlinkHref="/svg/video.svg#btn-play-svg"/>
                                }
                        </svg>
                        }
                    </BtnDefault>
                </div>
                <div className="controls__btn controls__btn_right">                 
                    <div className="player-volume__container">
                        <InputVolume
                            ref={videoRef} 
                            volume={videoSettings.volume} 
                            callback={volume => setVideoSettings(s => ({...s, "volume": volume}))}
                        />
                        <BtnDefault
                            callback={() => handleToggleMute(videoSettings.volume, setVideoSettings, player)}
                        >
                            <svg>
                                {videoSettings.volume > 0.6
                                    ? <use xlinkHref="/svg/video.svg#btn-max-volume-svg"/>
                                    : videoSettings.volume == 0
                                        ? <use xlinkHref="/svg/video.svg#btn-mute-volume-svg"/>
                                        : <use xlinkHref="/svg/video.svg#btn-middle-volume-svg"/> 
                                }
                            </svg>
                        </BtnDefault>
                    </div>
                    <div className="player-settings__container">
                        <SettingsVideo
                            isOpen={isShowSettings}
                            setIsOpen={setIsShowSettings} 
                            videoSettings={videoSettings} 
                            setVideoSettings={setVideoSettings}
                        />
                        <BtnDefault callback={() => setIsShowSettings(s => !s)}>
                            <svg>
                                <use xlinkHref="/svg/video.svg#btn-settings-svg"/>
                            </svg>
                        </BtnDefault>        
                    </div>
                    <BtnDefault callback={() => handlePip(videoRef)}>
                        <svg>
                            <use xlinkHref="/svg/video.svg#btn-pip-svg"/>
                        </svg>
                    </BtnDefault>
                    <BtnDefault value={isFullScreen} callback={() => handleFullScreen(playerContainerRef)}>
                        <svg>
                            {isFullScreen
                                ? <use xlinkHref="/svg/video.svg#btn-win-screen-svg"/> 
                                : <use xlinkHref="/svg/video.svg#btn-fullscreen-svg"/>
                            }
                        </svg>
                    </BtnDefault>
                </div> 
            </div>
        </div>
    )
})
