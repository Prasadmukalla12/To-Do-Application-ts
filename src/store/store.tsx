import { configureStore } from "@reduxjs/toolkit";
import ArchiveSlicer  from "../slicers/slicer"

export default configureStore({
    reducer : ArchiveSlicer
})