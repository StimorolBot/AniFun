import { memo, useRef, useState } from "react"

import { useSortable } from "@dnd-kit/react/sortable"

import { Drag } from "../../../../ui/icon/Drag"
import { Remove } from "../../../../ui/icon/Remove"

import { BtnDefault } from "../../../../ui/btn/BtnDefault"

import { InputCheckbox } from "../../../../ui/input/InputCheckbox"

import { useAutoFontSize } from "../../../../hook/useAutoFontSize"

import "./style/banner_item.sass"

export const BannerItem = memo(
	({
		item,
		id,
		index,
		storageUrl,
		callback,
		bannerData,
		setBannerList,
		...props
	}) => {
		const [element, setElement] = useState()
		const handleRef = useRef()
		const { isDragging } = useSortable({
			id,
			index,
			element,
			handle: handleRef,
		})
		const titleRef = useAutoFontSize({
			minSize: 12,
			maxSize: 26,
			deps: [item.title],
		})
		return (
			<li
				className="root-banner__item"
				ref={setElement}
				data-shadow={isDragging || undefined}
				{...props}
			>
				<Drag className={"root-banner__drop"} ref={handleRef} />

				<div className="root-banner__container">
					<h4 ref={titleRef}>{item.title}</h4>
					<img
						src={`${storageUrl}/anime-${item.title_uuid}/${item.banner_uuid}.webp`}
						alt="Баннер"
					/>
				</div>
				<div style={{ padding: 4 }}>
					<p
						className="root-banner__active"
						data-root-banner={item.is_active}
					>
						{item.is_active ? "Активен" : "Неактивен"}
					</p>
					<p>Позиция: {item.position || "-"}</p>
				</div>
				<InputCheckbox
					id={item.banner_uuid}
					register={() => {}}
					size={"large"}
					checked={item.is_active}
					onChange={() =>
						setBannerList((items) =>
							items.map((i) => {
								if (i.banner_uuid !== item.banner_uuid) {
									return i
								}

								const is_active = !i.is_active

								return {
									...i,
									is_active,
									position: i?.position
										? i.position
										: index + 1,
									isChange:
										is_active !==
										bannerData[index].is_active,
								}
							}),
						)
					}
				/>
				<BtnDefault
					isStroke={false}
					type={"button"}
					callback={() =>
						callback(item.banner_uuid, item.title, item.title_uuid)
					}
				>
					<Remove className={"root-banner_remove"} />
				</BtnDefault>
			</li>
		)
	},
)
