import {createSlice} from "@reduxjs/toolkit"
import type { AppointmentContract } from "../contracts/appointment-contract"

interface archive {
    archives:AppointmentContract[],
    archiveCount:number
}

const initialState:archive = {
    archives : [],
    archiveCount : 0
}

const ArchiveSlicer = createSlice({
    name:"archive",
    initialState,
    reducers : {
        addToArchive : (state,action)=>{
            state.archives.push(action.payload),
            state.archiveCount = state.archives.length
        },
        addToUnarchive:(state,action)=>{
            state.archives = state.archives.filter(appointment=>appointment.appointment_id !== action.payload.appointment_id)
            state.archiveCount = state.archives.length
        }
    }

})

export const {addToArchive,addToUnarchive}  = ArchiveSlicer.actions
export default ArchiveSlicer.reducer