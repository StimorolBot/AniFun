import { memo, useState } from "react"

import { api } from "../../../api"
import { useFetch } from "../../../hook/useFetch"

import { HeaderRouteRa } from "../../../components/header/HeaderRouteRa"
import { RaTrInput } from "../../../components/table/tr/RaTrInput"
import { Loader } from "../../../components/loader/Loader"


export const DeleteEpisode = memo(() => {
    const [isActive, setIsActive] = useState(false)
    const [response, setResponse] = useState()
    const [payload, setPayload] = useState({"title": "", "episode_number": ""})

    const [request, isLoading, error] = useFetch(
        async (e) => {
            e.preventDefault()

            await api.delete("/admin/anime/delete-episode", {data: payload})
            .then((r) => setResponse(r.data))
        }
    )

    return(
        <li className="ra__item">
            <div className="ra__wrapper ra__wrapper_delete">
                <HeaderRouteRa method="delete" title="Удалить эпизод" isActive={isActive} setIsActive={setIsActive}/>
                
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
                                value={payload.title}
                                field={"title"}
                                setPayload={setPayload}
                            />
                            <RaTrInput 
                                type="number"
                                title={"Номер эпизода"}
                                min={0}
                                placeholder={"Введите номер эпизода"}
                                payload={payload}
                                field={"episode_number"}
                                setPayload={setPayload}
                                value={payload.episode_number}
                            />
                        </tbody>
                    </table>
                    {isLoading
                        ? <Loader/>
                        : <button className="ra__btn">Удалить эпизод</button>
                    }
                </form>
            </div>
        </li>
    )
})
