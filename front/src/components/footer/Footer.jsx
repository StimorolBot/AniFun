import { memo } from "react"

import { Link } from "react-router-dom"

import { Discord } from "../../ui/icon/Discord"
import { Logo } from "../../ui/icon/Logo"
import { Telegram } from "../../ui/icon/Telegram"

import "./style/footer.sass"

export const Footer = memo(() => {
	return (
		<footer className="footer">
			<div className="container">
				<div className="footer__top">
					<div className="footer__top-inner">
						<div className="footer__top-svg-container">
							<Logo />
						</div>
						<div className="footer__title-container">
							<p className="footer__title">AniFun</p>
							<p className="footer__title-desc">
								Аниме с субтитрами и в популярной озвучке
							</p>
						</div>
					</div>
					<ul className="footer__list">
						<li className="footer__item footer__item_title">
							Навигация
						</li>
						<li className="footer__item">
							<Link className="footer__link" to={"/"}>
								Главная
							</Link>
						</li>
						<li className="footer__item">
							<Link className="footer__link" to={"/anime"}>
								Аниме
							</Link>
						</li>
						<li className="footer__item">
							<Link
								className="footer__link"
								to={"/anime/schedules"}
							>
								Расписание
							</Link>
						</li>
						<li className="footer__item">
							<Link
								className="footer__link"
								to={"/anime/franchises"}
							>
								Франшизы
							</Link>
						</li>
						<li className="footer__item">
							<Link className="footer__link" to={"/anime/genres"}>
								Жанры
							</Link>
						</li>
					</ul>
					<ul className="footer__list">
						<li className="footer__item footer__item_title">
							Пользователь
						</li>
						<li className="footer__item">
							<Link className="footer__link" to={"/auth/login"}>
								Авторизация
							</Link>
						</li>
						<li className="footer__item">
							<Link
								className="footer__link"
								to={"/auth/register"}
							>
								Регистрация
							</Link>
						</li>
						<li className="footer__item">
							<Link
								className="footer__link"
								to={"/auth/token-password"}
							>
								Восстановить пароль
							</Link>
						</li>
					</ul>
					<div>
						<li
							className="footer__item_title"
							style={{ textAlign: "center" }}
						>
							Мы в сети
						</li>
						<ul className="footer__social-list">
							<li className="footer__social-item">
								<Link className="footer__social-link" to={"#"}>
									<Discord />
								</Link>
							</li>
							<li className="footer__social-item">
								<Link className="footer__social-link" to={"#"}>
									<Telegram />
								</Link>
							</li>
						</ul>
					</div>
				</div>
				<span className="footer__separation" />
				<div className="footer__bottom">
					<p className="footer__bottom-desc">
						Весь материал на сайте представлен исключительно для
						домашнего ознакомительного просмотра
					</p>
					<p className="footer__design">RU • Russia</p>
				</div>
			</div>
		</footer>
	)
})
