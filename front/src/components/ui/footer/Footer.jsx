import { Link } from "react-router-dom"

import "./style/footer.sass"


export function Footer(){
    
    return(
        <footer className="footer">
            <div className="container">
                <div className="footer__top">
                    <div className="footer__top-inner">
                        <svg className="footer__logo-svg">
                            <use xlinkHref="/public/main.svg#logo-svg"/>
                        </svg>
                        <div className="footer__title-container">
                            <p className="footer__title">
                                AniFun
                            </p>
                            <p className="footer__title-desc">
                                Субтитры на русском язык аниме и не только !
                            </p>
                        </div>
                    </div>
                    <ul className="footer__list">
                        <li className="footer__item footer__item_title">
                            Навигация
                        </li>
                        <li className="footer__item">
                            <Link className="footer__link">
                                Главная
                            </Link>
                        </li>
                        <li className="footer__item">
                            <Link className="footer__link">
                                Релизы
                            </Link>
                        </li>
                        <li className="footer__item">
                            <Link className="footer__link">
                                Расписание
                            </Link>
                        </li>
                        <li className="footer__item">
                            <Link className="footer__link">
                                Приложения
                            </Link>
                        </li>
                        <li className="footer__item">
                            <Link className="footer__link">
                                Франшизы
                            </Link>
                        </li>
                        <li className="footer__item">
                            <Link className="footer__link">
                                Жанры
                            </Link>
                        </li>
                        <li className="footer__item">
                            <Link className="footer__link">
                                Торренты
                            </Link>
                        </li>
                    </ul>
                    <ul className="footer__list">
                        <li className="footer__item footer__item_title">
                            Пользователь
                        </li>
                        <li className="footer__item">
                            <Link className="footer__link">
                                Избранное
                            </Link>
                        </li>
                        <li className="footer__item">
                            <Link className="footer__link">
                                Коллекции
                            </Link>
                        </li>
                        <li className="footer__item">
                            <Link className="footer__link">
                                Настройки
                            </Link>
                        </li>
                        <li className="footer__item">
                            <Link className="footer__link"> 
                                Восстановить пароль
                            </Link>
                        </li>
                        <li className="footer__item">
                            <Link className="footer__link">
                                Правила
                            </Link>
                        </li>
                        <li className="footer__item">
                            <Link className="footer__link">
                                Техническая поддержка
                            </Link>
                        </li>
                        <li className="footer__item">
                            <Link className="footer__link">
                                Документация API v1
                            </Link>
                        </li>
                    </ul>
                </div>
                <span className="footer__separation"/>
                <div className="footer__bottom">
                    <div className="">
                        <p className="">
                            Весь материал на сайте представлен исключительно для домашнего ознакомительного просмотра
                        </p>
                        <p className="">
                            В случаях нарушения авторских прав — обращайтесь на почту:
                            <Link>
                                copyrights@anilibria.top
                            </Link>
                        </p>
                        <p className="">
                            Для связи с нами по вопросам рекламы и сотрудничества:
                            <Link>
                                contact@anilibria.top
                            </Link>
                        </p>
                    </div>
                    <ul className="">
                        <li className="">
                            <Link className="">
                                <svg className="header__logo-svg">
                                    <use xlinkHref="/public/main.svg#logo-svg"/>
                                </svg>
                            </Link>
                        </li>
                        <li className="">
                            <Link className="">
                                <svg className="header__logo-svg">
                                    <use xlinkHref="/public/main.svg#logo-svg"/>
                                </svg>
                            </Link>
                        </li>
                        <li className="">
                            <Link className="">
                                <svg className="header__logo-svg">
                                    <use xlinkHref="/public/main.svg#logo-svg"/>
                                </svg>
                            </Link>
                        </li>
                    </ul>
                </div>
                <p className="">
                    RU • Russia
                </p>
            </div>
        </footer>
    )
} 