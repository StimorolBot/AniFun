import { memo } from "react"

import "./style/progress_episode.sass"


export const ProgressEpisode = memo(({value, maxValue}) => {

    return(
        <div className="progress-episode__container">
            <progress className="progress-episode" min={0} max={maxValue} value={value}/>
            <p className="progress-episode__text">
                {`Просмотрено ${value} из ${maxValue}`}
            </p>
        </div>
    )
})  