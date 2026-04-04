import { memo } from "react"

import { useProgressVideo } from "../../hook/video/useProgressVideo"
import { setDataLocalStorage } from "../../pages/anime/video/player/utils"

import "./style/input_video_progress.sass"


export const InputVideoProgress = memo(({
    uuid, ref, player, videoDuration, seekProgress, bufferProgress, currentProgress 
}) => {

    const handleChange = (e) => {
        const newTime = parseFloat(e.target.value)
        if (!player || Number.isNaN(newTime)) return

        player.currentTime(newTime)   
        setDataLocalStorage(uuid, newTime, ref.current.duration)
    }

    const [seekMouseMoveHandler, seekTooltipPosition, seekTooltip] = useProgressVideo(ref, player, videoDuration)

    return(
        <div className="video-progress__wrapper">
            <div className="video-progress__range">
                <div className="video-progress__background"/>
                <div className="video-progress__buffer"
                    style={{ width: bufferProgress + "%" }}
                />
                <div
                    className="video-progress__range-current"
                    style={{ width: `${currentProgress}%`}}
                >
                    <div className="video-progress__current-thumb"/>
                </div>
                <input
                    className="input-video-progress"
                    id="input-video-progress"
                    type="range"
                    step="any"
                    min={0}
                    max={videoDuration || 0}
                    value={seekProgress}
                    onChange={handleChange}
                    onMouseMove={seekMouseMoveHandler}
                />
            </div>
        <label
            className="input-video__lbl"
            htmlFor="input-video-progress"
            style={{ left: `calc(${seekTooltipPosition} + 25px)`}}
        >
            {seekTooltip}
        </label>
    </div>
)})
