import { Avatar, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, InputLabel, MenuItem, Select } from '@mui/material'
import { db } from '../../Firebase';
import React, { useEffect, useState } from 'react'

function Form(props) {
    const [employees, setEmployees] = useState([]);
    const [machines, setMachines] = useState([]);
    const [selectedOption, setSelectedOption] = useState({ data: { image: "https://firebasestorage.googleapis.com/v0/b/manage-process-app.appspot.com/o/images%2Fplus.png?alt=media&token=73d8c259-82b9-4936-a3c0-9287ab2e72f3" } });

    useEffect(() => {

        db.collection("employees").onSnapshot((employee) => { //personelleri listele
            setEmployees(
                employee.docs.map((doc) => ({
                    id: doc.id,
                    data: doc.data(),
                }))
            )
        })

        db.collection("machines").onSnapshot((machine) => { // makineleri listele
            setMachines(
                machine.docs.map((doc) => ({
                    id: doc.id,
                    data: doc.data(),
                }))
            )
        })


    }, [])

    const handleFormClose = () => {
        props.onClose();
    }
    const handleSelectedOptionChange = (event) => {
        setSelectedOption(event.target.value);
    };

    const assign = () => { //seçilen elemanı gönder
        props.assign(selectedOption)
        handleFormClose();
    }

    return (
        <Dialog open={props.open} onClose={handleFormClose}>
            <DialogTitle>Assigning {props.type}</DialogTitle>
            <DialogContent>

                <DialogContentText>
                    You are going to assigning {props.type}. Be sure to entered values are right.
                </DialogContentText>

                <div className='flex items-center grid grid-cols-2 justify-items-center py-2 '>
                    <FormControl sx={{ m: 1, minWidth: 100 }}>
                        <InputLabel id="select-option">{props.type}</InputLabel>
                        <Select
                            labelId="select-option"
                            id="select-option"
                            value={selectedOption}
                            onChange={handleSelectedOptionChange}
                            autoWidth
                            label={props.type}
                        >
                            {
                                props.type === "Employee" ? (
                                    employees.map((option) =>
                                        <MenuItem key={option.id} value={option}>{option.data.name}</MenuItem>
                                    )) : (machines.map((option) =>
                                        <MenuItem key={option.id} value={option}>{option.data.name}</MenuItem>)
                                )

                            }
                        </Select>


                    </FormControl>
                    <Avatar
                        className='border border-gray-400 hover:bg-gray-300'
                        sx={{ width: 50, height: 50 }}
                        src={selectedOption.data.image}
                        variant="rounded">
                    </Avatar>
                </div>


            </DialogContent>
            <DialogActions>
                <Button onClick={props.onClose}>Cancel</Button>
                <Button onClick={assign}>Assign {props.type}</Button>
            </DialogActions>
        </Dialog>
    )
}

export default Form