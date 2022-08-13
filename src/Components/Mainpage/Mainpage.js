import React, { useEffect, useState } from 'react'
import { DragDropContext } from 'react-beautiful-dnd';
import { db } from '../../Firebase';
import Board from '../Board/Board'

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
function Mainpage() {
    const [processes, setProcesses] = useState([]);
    const notify = () => toast("Unavailable to Transfer!");

    useEffect(() => { //eklenmiş tüm processler
        db.collection("processes").onSnapshot((process) => {
            setProcesses(
                process.docs.map((doc) => ({
                    id: doc.id,
                    data: doc.data(),
                }))
            )
        })
    }, [])

    const dragToMove = (result) => {
        if (!result.destination) return; //sürüklenilmeyecek yere sürüklenirse return
        if (result.destination?.droppableId === result.source.droppableId
            && result.destination?.index === result.source.index) return; //alındığı yere geri sürüklenirse

        const tempProcess = processes.find(({ id }) => id === result.draggableId) //sürüklenilen process

        if (result.source.droppableId === "Processing" && result.destination?.droppableId === "Completed") {
            //processing den completed tablosuna taşınıyor ise update status
            db.collection("processes").doc(tempProcess.id).update({

                product: tempProcess.data.product,
                employee: tempProcess.data.employee,
                machine: tempProcess.data.machine,
                quantity: tempProcess.data.quantity,
                status: "completed",

            })
        }
        else {
            notify()
        }

    }
    return (
        <DragDropContext onDragEnd={dragToMove}>
            <ToastContainer />
            <div className='app_content mt-10 mb-8 px-20 w-full h-full grid grid-cols-3 flex-1 flex  justify-items-center'>
                <Board boardTitle="Pending" processes={processes.filter((item) => item.data.status === "pending")}></Board>
                <Board boardTitle="Processing" processes={processes.filter((item) => item.data.status === "processing")}></Board>
                <Board boardTitle="Completed" processes={processes.filter((item) => item.data.status === "completed")}></Board>
            </div>
        </DragDropContext>
    )
}

export default Mainpage