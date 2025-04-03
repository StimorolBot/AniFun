import "./style/coming_soon_item.sass"


export function ComingSoonItem(){
    return(
        <li className="coming-soon__item">
            <img className="coming-soon__bg" src="/public/iRP1mAPG9bQtTwqfTwbZlgW3opDJU8Sc.webp" alt="preview" />
            <p className="coming-soon__title">
                Сто девушек, которые очень-очень-очень-очень-очень сильно тебя любят 2
            </p>
            <p className="coming-soon__episode">
                Эпизод 16
            </p>
            <ul className="coming-soon__desc-list">
                <li className="coming-soon__desc-item">
                    2024
                </li>
                <li className="coming-soon__desc-item">
                    Осень
                </li>
                <li className="coming-soon__desc-item">
                    16+
                </li>
            </ul>
            <ul className="coming-soon__desc-list">
                <li className="coming-soon__desc-item">
                    Исекай
                </li>
                <li className="coming-soon__desc-item">
                    Приключения
                </li>
                <li className="coming-soon__desc-item">
                    Психологическое
                </li>
            </ul>
        </li>
    )
}