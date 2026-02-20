import { Link, useNavigate } from "react-router-dom"
import "../styles/login-form.css"
import { useFormik } from "formik"
import type { AppointmentContract } from "../contracts/appointment-contract"
import { useCookies } from "react-cookie"
import axios from "axios"
import * as yup from "yup"

export function AddAppointment(){

    const [cookie,,] = useCookies(["user_id"])

    const navigate = useNavigate()
    const formik = useFormik({
        initialValues:{
            appointment_id:0,
            title:"",
            description:"",
            date:"",
            user_id:cookie["user_id"]
        },
        onSubmit:(details)=>{

            const appointment:AppointmentContract = {
               
                appointment_id : details.appointment_id,
                title:details.title,
                description:details.description,
                date:details.date,
                user_id:cookie["user_id"]
            }
             axios.post(`http://127.0.0.1:4000/add-appointment`,appointment)
             .then(()=>{
                alert("Appointment added")
                navigate("/user-dashboard")
             })
        },
        enableReinitialize:true,
        validationSchema : yup.object({
            appointment_id:yup.number().required("ID required"),
            title:yup.string().required("Title required"),
            description:yup.string().required("Description required"),
            date:yup.string().required("Date required"),
            user_id:yup.string().required("User ID required")
        })
    })

    return(
    <>
    <div className="container-fluid d-flex justify-content-center align-items-center" style={{height:"500px"}}>
        <form onSubmit={formik.handleSubmit} className="w-25 p-2 border border-2 rounded user-bg text-white">
            <div>
                <label className="fw-bold my-2">Appointment ID</label>
            <div>
                <input onChange={formik.handleChange} value={formik.values.appointment_id} type="number" className="form-control" name="appointment_id" />
            </div>
            <div className="text-danger fw-bold">
                <span>{formik.errors.appointment_id}</span>
            </div>
            </div>

            <div>
                <label className="fw-bold my-2">Title</label>
            <div>
                <input onChange={formik.handleChange} value={formik.values.title} type="text" className="form-control" name="title" />
            </div>
            <div className="text-danger fw-bold">
                <span>{formik.errors.title}</span>
            </div>
            </div>

            <div>
                <label className="fw-bold my-2">Description</label>
            <div>
                <input onChange={formik.handleChange} value={formik.values.description} type="text" className="form-control" name="description" />
            </div>
            <div className="text-danger fw-bold">
                <span>{formik.errors.description}</span>
            </div>
            </div>

            <div>
                <label className="fw-bold my-2">Date</label>
            <div>
                <input onChange={formik.handleChange} value={formik.values.date} type="date" className="form-control" name="date" />
            </div>
            <div className="text-danger fw-bold">
                <span>{formik.errors.date}</span>
            </div>
            </div>
            
            <div>
                <label className="fw-bold my-2">User ID</label>
            <div>
                <input readOnly value={formik.values.user_id}  type="text" className="form-control" name="user_id" />
            </div>
            </div>

            <div className="mt-3">
                <span><button type="submit" className="btn btn-success"><label className="fw-bold">Add</label></button></span>
                <span className="mx-4"><Link to="/user-dashboard" className="btn btn-warning"><label className="fw-bold">Cancel</label></Link></span>
            </div>
        </form>
    </div>
    </>
    )
}