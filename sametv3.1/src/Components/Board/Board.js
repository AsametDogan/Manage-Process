import React from 'react'
import { Droppable } from 'react-beautiful-dnd'
import Card from '../Card/Card'

function Board(props) {
    return (
        <div className='board bg-gray-200 w-5/6 h-max pb-3 rounded-md shadow hover:shadow-md'>
            <div className='board_head py-2 m-2 px-6 flex border-b-2 border-purple-600 shadow-md '>
                <h3 className='flex-1 font-semibold text-lg text-purple-600 ' >{props.boardTitle || "Board Title"}</h3>
                <span>{props.processes?.length || "0"}</span>
            </div>
            <Droppable droppableId={props.boardTitle}>
                {
                    (provided, snapshot) => (
                        <div className={`board_content grid gap-2 px-4 ${snapshot.isDraggingOver ? "bg-cyan-50" : ""}`}
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                        >
                            {
                                props.processes.map((process, index) =>
                                    <Card key={index} index={index} process={process}></Card>
                                )
                            }
                            {provided.placeholder}
                        </div>
                    )
                }
            </Droppable>

        </div>
    )
}

export default Board