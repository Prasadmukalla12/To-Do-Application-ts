import { configureStore } from "@reduxjs/toolkit";
import ArchiveSlicer from "../slicer/slicer";

const store = configureStore({
    reducer : ArchiveSlicer
})

export type RootState = ReturnType<typeof store.getState>
export default store
