import { memo, useEffect, useRef, useState } from "react"

import { CSSTransition } from "react-transition-group"

import { useClickOutside } from "../../hook/useClickOutside"

import { BtnDefault } from "../btn/BtnDefault"
import { Close } from "../icon/Close"

import "./style/alert_api.sass"

export const AlertAPI = memo(({ id, msg, statusCode, timeout = 6000 }) => {
	const alertRef = useRef(null)
	const timerRef = useRef(null)

	const [isShowAlert, setIsShowAlert] = useState(false)

	const isSuccess = statusCode >= 200 && statusCode < 300

	useClickOutside({
		refs: [alertRef],
		enabled: isShowAlert,
		handler: () => {
			setIsShowAlert(false)
		},
	})

	useEffect(() => {
		if (!id) return

		setIsShowAlert(true)

		clearTimeout(timerRef.current)

		timerRef.current = setTimeout(() => {
			setIsShowAlert(false)
		}, timeout)

		return () => clearTimeout(timerRef.current)
	}, [id])

	const handleClose = () => {
		clearTimeout(timerRef.current)
		setIsShowAlert(false)
	}

	return (
		<CSSTransition
			classNames="alert-api"
			nodeRef={alertRef}
			in={isShowAlert}
			timeout={timeout}
			mountOnEnter
			unmountOnExit
		>
			<div className="alert-api" ref={alertRef}>
				<div
					className={`alert-api__container ${
						isSuccess
							? "alert-api__container_success"
							: "alert-api__container_error"
					}`}
				>
					<div className="alert-api__info">
						<div className="alert-api__status-code">
							<p>{statusCode}</p>
							<BtnDefault callback={handleClose}>
								<Close />
							</BtnDefault>
						</div>
						{msg && <p className="alert-api__detail">{msg}</p>}
					</div>
					<span
						className={`alert-api__progress ${
							isSuccess
								? "alert-api__progress_success"
								: "alert-api__progress_error"
						}`}
					/>
				</div>
			</div>
		</CSSTransition>
	)
})
