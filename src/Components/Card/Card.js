import React, { useEffect, useState } from 'react'
import Tooltip from '@mui/material/Tooltip';
import { Avatar } from '@material-tailwind/react'
import Zoom from '@mui/material/Zoom';
import Form from '../Form/Form';
import { db } from '../../Firebase';
import { Draggable } from 'react-beautiful-dnd';

function Card(props) {
    const [openForm, setOpenForm] = useState(false)
    const [formType, setFormType] = useState()

    const handleAssignFormClose = () => {
        setOpenForm(false)
    }
    const handleAssignPersonOpen = () => {// Person ekleme ekranı aç
        if (props.process.data.status === "pending") {
            setFormType("Employee")
            setOpenForm(true);
        }
    };

    const handleAssignMachineOpen = () => {// Machine ekleme ekranı aç
        if (props.process.data.status === "pending") {
            setFormType("Machine")
            setOpenForm(true);
        }
    };

    useEffect(() => {
        if (props.process.data.status === "completed") return; //bitmiş process ise return
        if (props.process.data.machine.id && props.process.data.employee.id) {
            //makine ve eleman atanmış processi işleme al
            db.collection("processes").doc(props.process.id).update({

                product: props.process.data.product,
                employee: props.process.data.employee,
                machine: props.process.data.machine,
                quantity: props.process.data.quantity,
                status: "processing",

            })
        }

    }, [props.process.data.employee, props.process.data.machine])

    const assignItem = (item) => {

        if (formType === "Employee") { // processe eleman ataması yapılırsa
            db.collection("processes").doc(props.process.id).update({

                product: props.process.data.product,
                employee: item,
                machine: props.process.data.machine,
                quantity: props.process.data.quantity,
                status: props.process.data.status,

            })
        }

        else if (formType === "Machine") {// processe makine ataması yapılırsa
            db.collection("processes").doc(props.process.id).update({

                product: props.process.data.product,
                employee: props.process.data.employee,
                machine: item,
                quantity: props.process.data.quantity,
                status: props.process.data.status,

            })
        }

    }

    return (
        <>
            <Form open={openForm} assign={assignItem} onClose={handleAssignFormClose} type={formType}></Form>
            <Draggable index={props.index} draggableId={props.process.id}>
                {
                    (provided, snapshot) => (
                        <div className={`card rounded-md bg-gradient-to-b from-gray-200 to-gray-50 ${snapshot.isDragging ? "shadow-2xl" : ""}`}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            ref={provided.innerRef}
                        >
                            <div className='card_head flex justify-around items-center'>
                                <div className="pl-5 grow border-t border-l-2 border-r border-gray-400"></div>
                                <Avatar className='border border-gray-400 hover:bg-gray-300' src={props.process?.data?.product?.data?.image}></Avatar>
                                <div className="grow border-t border-l border-r border-gray-400"></div>
                                <Tooltip TransitionComponent={Zoom} title={props.process?.data?.employee?.data?.name}>
                                    <Avatar onClick={handleAssignPersonOpen} className='border border-gray-400 hover:bg-gray-300' src={props.process?.data?.employee?.data?.image} variant="circular"></Avatar>
                                </Tooltip>

                                <div className="grow border-t border-l border-r border-gray-400"></div>
                                <Avatar onClick={handleAssignMachineOpen} className='border border-gray-400 hover:bg-gray-300' src={props.process?.data?.machine?.data?.image}></Avatar>
                                <div className=" pr-5 grow border-t border-l border-r border-gray-400"></div>
                            </div>
                            <div className='card_content flex gap-1 flex-row '>
                                <div className='left_side flex-1 border-b border-l border-r border-gray-300 rounded-b-md shadow grid justify-items-center pt-1' >
                                    <span className='flex text-sm text-gray-600 text-xs leading-3'>{props.process?.data?.quantity}</span>
                                    <span className='flex text-sm text-gray-600'>{props.process?.data?.product?.data?.productCode}</span>
                                    <span className='flex text-sm text-gray-800'>{props.process?.data?.product?.data?.name}</span>
                                </div>
                                <div className='right_side flex-1 border-b border-l border-r border-gray-300 rounded-b-md  shadow grid justify-items-center pt-1 '>
                                    <span className='flex text-sm text-white text-xs leading-3'>_</span>
                                    <span className='flex text-sm text-gray-600'>{props.process?.data?.machine?.data?.machineCode}</span>
                                    <span className='flex text-sm text-gray-800'>{props.process?.data?.machine?.data?.name}</span>
                                </div>
                            </div>
                        </div>
                    )
                }
            </Draggable>
        </>
    )
}

export default Card