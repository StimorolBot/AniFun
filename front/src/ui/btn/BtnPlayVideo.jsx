import { memo, useState } from "react"

import "./style/btn_play_video.sass"


export const BtnPlayVideo = memo(({isPlaying, togglePlay}) => {
    
    return(
        <button className ="btn-play-video" onClick={togglePlay}>
            <svg className="btn-play-video__svg">
                {isPlaying
                    ? <use xlinkHref="/main.svg#btn-pause-svg"/>
                    : <use xlinkHref="/main.svg#btn-play-svg"/>
                }
            </svg>
    </button>
  )
})
