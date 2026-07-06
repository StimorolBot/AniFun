import { Remove } from "../../ui/icon/Remove"

import { BtnDefault } from "../../ui/btn/BtnDefault"

import "./style/confirm.sass"

export const Confirm = ({ children, ref, onConfirm, onClose }) => {
	return (
		<div className="popup-confirm" onClick={onClose} ref={ref}>
			<div
				className="popup-confirm__container"
				onClick={(e) => e.stopPropagation()}
			>
				{children}
				<div className="popup-confirm__container-btn">
					<BtnDefault callback={onClose}>Отмена</BtnDefault>
					<BtnDefault callback={onConfirm}>
						<Remove />
						Удалить
					</BtnDefault>
				</div>
			</div>
		</div>
	)
}
