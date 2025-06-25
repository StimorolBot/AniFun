import { Fragment, memo, useState } from "react"

import { api } from "../../../api"
import { useFetch } from "../../../hook/useFetch"

import { HeaderRouteRa } from "../../../components/header/HeaderRouteRa"
import { RaTrInput } from "../../../components/table/tr/RaTrInput"
import { RaTrSelectDayWeek } from "../../../components/table/tr/RaTrSelectDayWeek"
import { BtnTr } from "../../../ui/btn/BtnTr"
import { Loader } from "../../../components/loader/Loader"


export const SetSchedules = memo(() => {
    const date = new Date()
    const [isActive, setIsActive] = useState(false)
    const [response, setResponse] = useState()
    const [countEp, setCountEp] = useState(["1749907156"])
    const [scheduleItem, setScheduleItem] = useState([{
        "date": "",
        "episode_number": "",
        "episode_name": "",
    }])

    const [payload, setPayload] = useState({
        "title": "",
        "day_week": ""
    })

    const [request, isLoading, error] = useFetch(
        async (e) => {
            e.preventDefault()
            
            await api.post("/admin/anime/set-schedules", {...payload, "schedule_item": [...Object.values(scheduleItem)]})
            .then((r) => setResponse({"data": JSON.stringify(r.data, null, 2), "statusCode": r.status}))

        }
    )

    return(
        <li className="ra__item">
            <div className="ra__wrapper ra__wrapper_post">
                <HeaderRouteRa 
                    method="post" title="Добавить расписание выхода эпизодов" 
                    isActive={isActive} setIsActive={setIsActive}
                />
                <form
                    className={isActive ? "ra__body ra__body_active" : "ra__body"}
                    onSubmit={async (e) => await request(e)}    
                >
                    <table className="ra__table">
                        <thead>
                            <tr>
                                <th>Параметр</th>
                                <th>Значение</th>
                            </tr>
                        </thead>
                        <tbody className="ra__tbody">
                            <RaTrInput 
                                minLength={3} 
                                maxLength={150} 
                                placeholder="Введите название аниме"
                                payload={payload}
                                field={"title"}
                                setPayload={setPayload}
                            />
                            <RaTrSelectDayWeek payload={payload} setPayload={setPayload}/>
                            {countEp.map((key, index) => {
                                return(
                                <Fragment key={key}>            
                                    <RaTrInput 
                                        type="date"
                                        title={"Дата"}
                                        payload={scheduleItem}
                                        field={"date"}
                                        isMulti={true}
                                        index={index}
                                        setPayload={setScheduleItem}
                                    />
                                    <RaTrInput 
                                        title={"Название эпизода"}
                                        placeholder={"Введите название эпизода"}
                                        payload={scheduleItem}
                                        isMulti={true}
                                        index={index}
                                        minLength={3} 
                                        maxLength={150} 
                                        field={"episode_name"}
                                        setPayload={setScheduleItem}
                                    /> 
                                    <RaTrInput 
                                        type="number"
                                        title={"Номер эпизода"}
                                        min={0}
                                        placeholder={"Введите номер эпизода"}
                                        payload={scheduleItem}
                                        isMulti={true}
                                        index={index}
                                        field={"episode_number"}
                                        setPayload={setScheduleItem}
                                    />
                                </Fragment>
                                )
                            })}
                            <BtnTr btnName={"Добавить эпизод"} disable={isLoading} callback={() => setCountEp([...countEp, date.getMilliseconds()])}/>
                            <BtnTr 
                                btnName={"Удалить эпизод"} 
                                disable={isLoading}
                                prefix={"rm"} 
                                callback={() => countEp.length !==1 && setCountEp(countEp.slice(0, -1))}
                            />                            
                        </tbody>
                    </table>
                    {isLoading
                        ?<Loader/>
                        : <button className="ra__btn">Добавить расписание</button>
                    }
                </form>
            </div>
        </li>
    )
})
