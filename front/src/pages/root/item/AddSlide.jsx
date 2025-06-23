import { memo, useState } from "react"

import { api } from "../../../api"
import { useFetch } from "../../../hook/useFetch"

import { HeaderRouteRa } from "../../../components/header/HeaderRouteRa"
import { RaTrInput } from "../../../components/table/tr/RaTrInput"
import { Loader } from "../../../components/loader/Loader"


export const AddSlide = memo(() => {
    const formData = new FormData()
    const [background, setBackground] = useState("")

    const [isActive, setIsActive] = useState(false)
    const [response, setResponse] = useState()
    const [payload, setPayload] = useState({"title": ""})

    const [request, isLoading, error] = useFetch(
        async (e) => {
            e.preventDefault()
            formData.append("img", background)

            await api.patch("/admin/anime/add-slide", formData, 
                {
                    params: payload,
                    headers: { "Content-Type": "multipart/form-data"}
                }
            ).then((r) => setResponse(r.data))
        }
    )
    
    return(
        <li className="ra__item">
            <div className="ra__wrapper ra__wrapper_patch">
                <HeaderRouteRa method="patch" title="Добавить слайд" isActive={isActive} setIsActive={setIsActive}/>
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
                            <tr>
                                <td>Задний фон</td>
                                <td>
                                    <input type="file" required onChange={(e) => setBackground(e.target.files[0])}/>
                                </td>
                            </tr>                            
                        </tbody>
                    </table>
                    {isLoading
                        ? <Loader/>
                        : <button className="ra__btn">Добавить слайд</button>
                    }
                </form>
            </div>
        </li>
    )
})
