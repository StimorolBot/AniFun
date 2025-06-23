import { memo, useState } from "react"

import { api } from "../../../api"
import { useFetch } from "../../../hook/useFetch"

import { HeaderRouteRa } from "../../../components/header/HeaderRouteRa"
import { RaTrInput } from "../../../components/table/tr/RaTrInput"
import { Loader } from "../../../components/loader/Loader"


export const AddEpisode = memo(() => {
    const formData = new FormData()
    const [formDataState, setFormDataState] = useState({"img": "", "video": ""})

    const [isActive, setIsActive] = useState(false)
    const [response, setResponse] = useState()
    const [payload, setPayload] = useState({"title": "", "episode": ""})

    const [request, isLoading, error] = useFetch(
        async (e) => {
            e.preventDefault()
            formData.append("img", formDataState.img)
            formData.append("video", formDataState.video)

            await api.post("/admin/anime/add-episode", formData,
                {
                    params: payload,
                    headers: { "Content-Type": "multipart/form-data"}
                }
            ).then((r) => setResponse(r.data))

        }
    )
    
    return(
        <li className="ra__item">
            <div className="ra__wrapper ra__wrapper_post">
                <HeaderRouteRa method="post" title="Добавить эпизод" isActive={isActive} setIsActive={setIsActive}/>
                <form 
                    className={isActive ? "ra__body ra__body_active" : "ra__body"}
                    onSubmit={async (e) => await request(e)}   >
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
                                value={payload.title}
                                setPayload={setPayload}
                            />
                           <RaTrInput 
                                type="number"
                                title={"Номер эпизода"}
                                min={0}
                                placeholder={"Введите номер эпизода"}
                                payload={payload}
                                field={"episode"}
                                setPayload={setPayload}
                                value={payload.episode}
                            />
                            <tr>
                                <td>Превью</td>
                                <td>
                                    <input type="file" required onChange={(e) => 
                                        setFormDataState(s => ({...s, "img": e.target.files[0]}))
                                    }/>
                                </td>
                            </tr>
                            <tr>
                                <td>Видео файл</td>
                                <td>
                                    <input type="file" required onChange={(e) => 
                                        setFormDataState(s => ({...s, "video": e.target.files[0]}))}
                                    />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    {isLoading
                        ? <Loader/>
                        : <button className="ra__btn">Добавить эпизод</button>
                    }
                </form>
            </div>
        </li>
    )
})
