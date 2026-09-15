import { useNavigate } from "react-router-dom"

import { Back } from "../../../../ui/icon/Back"
import { Close } from "../../../../ui/icon/Close"
import { Save } from "../../../../ui/icon/Save"

import { BtnDefault } from "../../../../ui/btn/BtnDefault"

import { Loader } from "../../../../components/loader/Loader"

import "./style/header_form.sass"

export const HeaderForm = ({
	nameForm,
	resetCallback,
	isPending,
	children,
}) => {
	const navigate = useNavigate()
	return (
		<header className="header-form">
			<div className="header-form__container">
				<BtnDefault isStroke={false} callback={() => navigate(-1)}>
					<Back />
					<span>Назад</span>
				</BtnDefault>
				{children}
			</div>
			<div className="header-form__btn">
				<BtnDefault
					isStroke={false}
					callback={() => resetCallback()}
					type="button"
					data-lock={isPending}
				>
					{isPending ? (
						<Loader size={"small"} />
					) : (
						<>
							<Close
								style={{
									stroke: "currentColor",
									marginRight: 5,
								}}
							/>
							<span>Сброс</span>
						</>
					)}
				</BtnDefault>
				<BtnDefault
					isStroke={false}
					form={nameForm}
					data-lock={isPending}
				>
					{isPending ? (
						<Loader size={"small"} />
					) : (
						<>
							<Save />
							<span>Сохранить</span>
						</>
					)}
				</BtnDefault>
			</div>
		</header>
	)
}
