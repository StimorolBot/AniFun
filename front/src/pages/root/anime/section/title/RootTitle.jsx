import { memo} from "react"

import { CreateTitle } from "./item/CreateTitle"
import { UpdateTitle } from "./item/UpdateTitle"
import { DeleteTitle } from "./item/DeleteTitle"

const typeList = [
    {"value": "tv", "label": "тв сериал"},
    {"value": "ova", "label": "ova"},
    {"value": "ona", "label": "ona"},
    {"value": "film", "label": "фильм"},
    {"value": "special", "label": "спешл"},
]

const seasonList = [
    {"value": "winter", "label": "зима"},
    {"value": "spring", "label": "весна"},
    {"value": "summer", "label": "лето"},
    {"value": "autumn", "label": "осень"},
]

const statusList = [
    {"value": "ongoing", "label": "онгоинг"},
    {"value": "completed", "label": "вышел"},
]

const ageRestrictList = [
    {"value": "g", "label": "0+"},
    {"value": "pg", "label": "6+"},
    {"value": "pg-13", "label": "12+"},
    {"value": "nc-17", "label": "16+"},
    {"value": "r", "label": "18+"},
]


export const RootTitle = memo(() => {
    return(
        <section className="root-anime__section">
            <CreateTitle 
                typeList={typeList}
                seasonList={seasonList}
                statusList={statusList}
                ageRestrictList={ageRestrictList}
            />            
            <UpdateTitle
                typeList={typeList}
                seasonList={seasonList}
                statusList={statusList}
                ageRestrictList={ageRestrictList}
            />
            <DeleteTitle/>
        </section>
    )
})
