import { memo, useState } from "react"
import { Link } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"

import { api } from "../../../../../api"

import { Loader } from "../../../../../components/loader/Loader"
import { BtnDefault } from "../../../../../ui/btn/BtnDefault"

import { differenceInDays, formatDays } from "../../../../../utils/utils"
import { titleScheduleCache } from "../../../../../query_key"


import "./style.sass"


export const TitleSchedule = memo(({currentSlide, title, alias}) => {
    const [isShowMore, setIsShowMore] = useState(false)

    const {data: titleScheduleData, isLoading, error} = useQuery({
        queryKey: [titleScheduleCache, alias],
        staleTime: 1000 * 60 * 3,
        retry: false,
        enabled: currentSlide.section === "schedule" ? true : false,
        queryFn: async () => {
            return await api.get(`anime/schedule/${title}`, {params: {"title": title}}).then(r => r.data)
        },
        placeholderData: []
    })

    return(
        <section className="title-release__section" style={{"marginLeft": currentSlide.marginLeft}}>
            {isLoading
                ? <Loader/>
                : titleScheduleData?.length !== 0
                   ? <div className="title-schedule__wrapper">
                        <span className="title-schedule__warning">
                            * Расписание выхода новых эпизодов на телеэкранах Японии.
                        </span>
                        <div className="schedule-table__inner" style={isShowMore ? {"height": "calc-size(auto, size)"} : {"height": "150px"}}>
                            <table className="schedule-table">
                                <thead className="schedule-table__head">
                                    <tr>
                                        <th>Номер серии</th>
                                        <th>Название</th>
                                        <th>Дата выхода</th>
                                        <th>Статус</th>
                                    </tr>
                                </thead>
                                <tbody className="schedule-table__body">
                                    {titleScheduleData.map((item, index) => {
                                        return(
                                            <tr key={index}>
                                                <th>{item.episode_number}</th>
                                                <th>{item.episode_name}</th>
                                                <th>{item.date_release}</th>
                                                <th>
                                                    {item.episode_uuid 
                                                        ?<Link to={`${item.episode_uuid}`}>
                                                            ✔️
                                                        </Link>
                                                        : <p>
                                                            {`${formatDays(differenceInDays(item.date_release))}`}
                                                        </p>
                                                    }
                                                </th>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                        <div className="btn-show-mere__container">
                            <BtnDefault callback={() => setIsShowMore(s => !s)}>
                                {isShowMore 
                                    ? `▲ Скрыть`
                                    : `▼ Показать больше`
                                }
                            </BtnDefault>
                        </div>                            
                    </div>
                    :<p className="title-release__empty-continuation">
                        Для "{title}" нет расписания выхода новых эпизодов.
                    </p>
            }
        </section>
    )
})
