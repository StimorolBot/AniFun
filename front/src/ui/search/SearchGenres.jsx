import { CustomSelect } from "../../ui/input/CustomSelect"


export function SearchGenres({genres, setGenres, ...props}) {
    const options  = [
        {value: "Безумие", label: "Безумие"},
        {value: "Боевые искусства", label: "Боевые искусства"},
        {value: "Вампиры", label: "Вампиры"},
        {value: "Военное", label: "Военное"},
        {value: "Гарем", label: "Гарем"},
        {value: "Демоны", label: "Демоны"},
        {value: "Детектив", label: "Детектив"},
        {value: "Детское", label: "Детское"},
        {value: "Драма", label: "Драма"},
        {value: "Игры", label: "Игры"},
        {value: "Исторический", label: "Исторический"},
        {value: "Исекай", label: "Исекай"},
        {value: "Комедия", label: "Комедия"},
        {value: "Магия", label: "Магия"},
        {value: "Машины", label: "Машины"},
        {value: "Меха", label: "Меха"},
        {value: "Музыка", label: "Музыка"},
        {value: "Пародия", label: "Пародия"},
        {value: "Повседневность", label: "Повседневность"},
        {value: "Приключения", label: "Приключения"},
        {value: "Психологическое", label: "Психологическое"},
        {value: "Романтика", label: "Романтика"},
        {value: "Сверхъестественное", label: "Сверхъестественное"},
        {value: "Спорт", label: "Спорт"},
        {value: "Супер сила", label: "Супер сила"},
        {value: "Триллер", label: "Триллер"},
        {value: "Ужасы", label: "Ужасы"},
        {value: "Фэнтези", label: "Фэнтези"},
        {value: "Школа", label: "Школа"},
        {value: "Экшен", label: "Экшен"},
        {value: "Этти", label: "Этти"},
    ]
    
    return(   
        <CustomSelect
            options={options}            
            value={genres}
            setValue={setGenres}
            {...props}
        />        
    )
}
