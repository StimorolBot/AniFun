import { memo, useState } from "react"

import { api } from "../../../api"
import { useFetch } from "../../../hook/useFetch"

import { Loader } from "../../../components/loader/Loader"
import { SearchGenres } from "../../../ui/search/SearchGenres"
import { HeaderRouteRa } from "../../../components/header/HeaderRouteRa"
import { RaTrInput } from "../../../components/table/tr/RaTrInput"
import { RaTrSelectType } from "../../../components/table/tr/RaTrSelectType"
import { RaTrSelectAgeRestrict } from "../../../components/table/tr/RaTrSelectAgeRestrict"
import { RaTrSelectSeason } from "../../../components/table/tr/RaTrSelectSeason"
import { RaTrSelectStatus } from "../../../components/table/tr/RaTrSelectStatus"
import { RaTrSelectIsOriginal } from "../../../components/table/tr/RaTrSelectIsOriginal"


export const AddTitleItem = memo(() => {
    const formData = new FormData()
    const currentYear = new Date().getFullYear() 

    const [poster, setPoster] = useState()
    const [genres, setGenres] = useState([])
    const [isActive, setIsActive] = useState(false)
    const [response, setResponse] = useState({"statusCode": null, "data": null})

    const [payload, setPayload] = useState({
        "title": "",
        "description": "",
        "year": parseInt(currentYear),
        "is_origin": true,
        "type": "",
        "age_restrict": "",
        "status": "",
        "season": "",
    })

    const [request, isLoading, error] = useFetch(
        async (e) => {
            e.preventDefault()

            await api.post("/admin/anime/add-new-title", {"genres": genres, ...payload})
            .then((r) => setResponse({"data": JSON.stringify(r.data, null, 2), "statusCode": r.status}))
            
            formData.append("img", poster)            
            await api.post("/admin/anime/add-poster", formData,
                {
                    params: {"title": payload.title},
                    headers: { "Content-Type": "multipart/form-data"}
            }
            )
        }
    )
    return(
        <li className="ra__item">
            <div className="ra__wrapper ra__wrapper_post">
                <HeaderRouteRa method="post" title="Добавить новое аниме" isActive={isActive} setIsActive={setIsActive}/>
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
                                minLength={10} 
                                maxLength={1_000}
                                title={"Описание"} 
                                placeholder="Введите описание аниме"
                                payload={payload}
                                value={payload.description}
                                field={"description"}
                                setPayload={setPayload}
                            />
                            <RaTrInput
                                type="number"
                                min={1970} 
                                max={2500}
                                title={"Год"} 
                                placeholder="Введите описание аниме"
                                payload={payload}
                                value={payload.year}
                                field={"year"}
                                setPayload={setPayload}
                            />
                            <RaTrSelectType payload={payload} setPayload={setPayload}/>      
                            <RaTrSelectAgeRestrict payload={payload} setPayload={setPayload}/>
                            <RaTrSelectSeason payload={payload} setPayload={setPayload}/>
                            <tr>
                                <td>Жанры</td>
                                <td>
                                    <SearchGenres
                                        genres={genres}
                                        setGenres={setGenres}
                                        isSearchable={true}
                                        isMulti={true}
                                        required
                                        placeholder={"Выберите жанр"}
                                        noOptionsMessage={() => "Не удалось найти жанр"}
                                    />
                                </td>
                            </tr>
                            <RaTrSelectStatus payload={payload} setPayload={setPayload}/>
                            <RaTrSelectIsOriginal payload={payload} setPayload={setPayload}/>
                            <tr>
                                <td>Постер</td>
                                <td><input type="file" required onChange={(e) => setPoster(e.target.files[0])}/></td>
                            </tr>
                        </tbody>
                    </table>
                    { isLoading
                        ? <Loader/>
                        : <button className="ra__btn">Добавить аниме</button>
                    }
                    {/* добавить вывод ошибок response не меняется  */}
                    {response.statusCode !== null &&
                        <code className="ra-response">
                            <p> Статус код: {response?.statusCode}</p>
                            <pre>{response?.data}</pre>
                        </code>
                    }
                </form>
            </div>
        </li>
    )
})
