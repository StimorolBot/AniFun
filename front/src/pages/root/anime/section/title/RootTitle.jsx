import { memo} from "react"
import Masonry from "react-masonry-css"

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

const breakpoints = {
    "default": 2,
    "1280": 1
}

export const RootTitle = memo(({isShowAlert, setUpdateAlert, setAlertData}) => {
    
    return(
        <section className="root-anime__section">
            <Masonry
                className="masonry-root"
                breakpointCols={breakpoints} 
                columnClassName="masonry__column-root"
            >        
                <CreateTitle 
                    typeList={typeList}
                    seasonList={seasonList}
                    statusList={statusList}
                    ageRestrictList={ageRestrictList}
                    isShowAlert={isShowAlert}
                    setUpdateAlert={setUpdateAlert}
                    setAlertData={setAlertData}
                />            
                <UpdateTitle
                    typeList={typeList}
                    seasonList={seasonList}
                    statusList={statusList}
                    ageRestrictList={ageRestrictList}
                    isShowAlert={isShowAlert}
                    setUpdateAlert={setUpdateAlert}
                    setAlertData={setAlertData}
                />
                <DeleteTitle
                    isShowAlert={isShowAlert}
                    setUpdateAlert={setUpdateAlert}
                    setAlertData={setAlertData}
                />
            </Masonry>
        </section>
    )
})
