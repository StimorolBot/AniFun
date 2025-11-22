import { memo } from "react"

import "./style/title_episode_nav.sass"


export const TitleEpisodeNav = memo(({setCurrentSlide, currentSlide}) => {

    return(
        <nav className="title-nav">
            <ul className="title-nav__list">
                <li>
                    <button 
                        className="title-nav__btn" 
                        onClick={(e) => {
                            setCurrentSlide({
                                "offset": e.target.offsetLeft, 
                                "width": e.target.offsetWidth, 
                                "marginLeft": "0%",
                                "request": "episode",
                            })}
                        }
                    >
                        Эпизоды
                    </button>
                </li>
                <li>
                    <button 
                        className="title-nav__btn"
                        onClick={(e) => {
                            setCurrentSlide({
                                "offset": e.target.offsetLeft,
                                "width": e.target.offsetWidth, 
                                "marginLeft": "-100%",
                                "request": "continuation",
                            })}
                        }
                    >
                        Связанное
                    </button>
                </li>
                <li>
                    <button
                        className="title-nav__btn"
                        onClick={(e) => {
                            setCurrentSlide({
                                "offset": e.target.offsetLeft, 
                                "width": e.target.offsetWidth, 
                                "marginLeft": "-200%",
                                "request": "comments",
                            })}
                        }
                    >
                        Комментарии
                    </button>
                </li>
                <li>
                    <button 
                        className="title-nav__btn"
                        onClick={(e) => {
                            setCurrentSlide({
                                "offset": e.target.offsetLeft,
                                "width": e.target.offsetWidth,
                                "marginLeft": "-300%",
                                "request": "schedule",
                            })}
                        }
                    >
                        Расписание
                    </button>
                </li>
                <span 
                    className="title-active-btn"
                    style={{"width": `${currentSlide.width}px`, "transform": `translateX(${currentSlide.offset}px)`}}
                />
            </ul>
        </nav>
    )
})
