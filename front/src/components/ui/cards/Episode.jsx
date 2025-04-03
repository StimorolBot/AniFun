import { LinkWatch } from "../link/LinkWatch"
import { BtnAddQueue } from "../btn/BtnAddQueue"

import "./style/episode.sass"


export function Episode(){
    
    return(
        <li className="episode__item">
            <img className="episode__img" src="/public/cords/solo_leveling.webp" alt="new-episode"/>
            <div className="episode__description">
                <p className="episode__number">
                    12 эпизод
                </p>
                <p className="episode__title">
                    Поднятие уровня в одиночку 2: Восстание из тени
                </p>
                <ul className="episode__desc-list">
                    <li className="episode__desc-item">
                        2025
                    </li>
                    <li className="episode__desc-item">
                        Зима
                    </li>
                    <li className="episode__desc-item">
                        Тв
                    </li>
                    <li className="episode__desc-item">
                        16+
                    </li>
                </ul>
                <ul className="episode__desc-list">
                    <li className="episode__desc-item episode__desc-item_gray">
                        Приключения
                    </li>
                    <li className="episode__desc-item episode__desc-item_gray">
                        Фэнтези
                    </li>
                </ul>
                <div className="episode-btn__container">
                    <LinkWatch/>
                    <BtnAddQueue/>
                </div>
            </div>
        </li>
    )
}