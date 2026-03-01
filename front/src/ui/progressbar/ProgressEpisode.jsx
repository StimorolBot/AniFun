import { memo } from "react"

import "./style/progress_episode.sass"


export const ProgressEpisode = memo(({maxValue}) => {

    return(
        <div className="progress-episode__container">
            <progress className="progress-episode" min={0} max={maxValue} value="0"/>
            <p className="progress-episode__text">
                {`Просмотрено 0 из ${maxValue}`}
            </p>
        </div>
    )
})  