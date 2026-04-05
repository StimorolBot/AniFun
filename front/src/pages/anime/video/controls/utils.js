import { handlerTogglePlay, handleFullScreen } from "../player/utils"

 
export const handlePip = (ref) => {
    if (document.pictureInPictureElement)
        document.exitPictureInPicture()
    else
        ref.current.requestPictureInPicture()
}

export const handleToggleMute = (volume, setVideoSettings, player) => {
    if (volume != 0)
        setVideoSettings(s => ({...s, "volume": 0}))
    else
        setVideoSettings(s => ({...s, "volume": player.volume()}))
}

export const handleKeyPress = (
    event, 
    ref, containerRef, 
    player, 
    volume, uuid, alias, 
    setVideoSettings, setIsPlaying
) => {
    switch (event.code){
        case "Space":
            return handlerTogglePlay(ref, alias, uuid, setIsPlaying)
        case "KeyF":
            return handleFullScreen(containerRef)
        case "ArrowRight":
            return handleSkipVideo(player, 15)
        case "ArrowLeft":
            return handleSkipVideo(player, -15)
        case "KeyM":
            return handleToggleMute(volume, setVideoSettings, player)
        case "KeyP":
            return handlePip(ref) 
    }
}
