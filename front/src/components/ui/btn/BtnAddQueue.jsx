import "./style/btn_add_queue.sass"


export function BtnAddQueue(){
    return(
        <button className="btn-add-queue" title="Добавить в очередь">
            <svg>
                <use xlinkHref="/public/main.svg#add-queue-svg"></use>
            </svg>
        </button>
    )
}