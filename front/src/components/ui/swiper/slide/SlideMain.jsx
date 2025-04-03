import { LinkWatch } from "../../link/LinkWatch"

import "./style/slide_main.sass"


export function SlideMain() {
    
    return(
        <div className="slide">
            <img className="slide__bg" src="/public/bg_slide/zenshuu.webp" alt="slide"/>
            <div className="slide__inner">
                <h3 className="slide__title">
                    Полное исследование
                </h3>
                <ul className="slide-desc__list">
                    <li className="slide-desc__item">
                        Зима
                    </li>
                    <li className="slide-desc__item">
                        2025
                    </li>
                    <li className="slide-desc__item">
                        12 эпизодов
                    </li>
                    <li className="slide-desc__item">
                        16+
                    </li>
                </ul>
                <ul className="slide-desc__list">
                    <li className="slide-desc__item slide-desc__item_gray">
                        Исекай
                    </li>
                    <li className="slide-desc__item slide-desc__item_gray">
                        Фэнтези
                    </li>
                </ul>
                <p className="slide__description">
                    Только выпустившись из средней школы, Нацуко Хиросэ устроилась работать художником-аниматором.
                    Благодаря своему необыкновенному таланту она сразу же начала делать большие успехи, и довольно быстро 
                    добралась до места режиссера. Её первое аниме стало настоящим хитом, вызвав общественный резонанс, что 
                    в итоге принесло ей признание и статус гениального молодого специалиста...
                </p>
                <LinkWatch/>
            </div>
        </div>
    )
}