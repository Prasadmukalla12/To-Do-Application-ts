import { Link, useNavigate, useParams } from "react-router-dom";
import "../styles/login-form.css"
import { useFormik } from "formik";
import type { AppointmentContract } from "../contracts/appointment-contract";
import axios from "axios";
import { useEffect, useState } from "react";
import * as yup from "yup"



export function EditAppointment(){

    const navigate = useNavigate()
    const params = useParams()
    const [appointment,setAppointment] = useState<AppointmentContract>()

    function LoadAppointment(){
        axios.get(`http://localhost:4000/appointment/${params.id}`)
        .then(res=>{
            setAppointment(res.data)
        })
    }

    useEffect(()=>{
        LoadAppointment()
    },[])

    const formik = useFormik({
        initialValues:{
            appointment_id : appointment?.appointment_id || 0,
            title:appointment?.title ||"",
            description : appointment?.description||"",
            date:appointment?.date||"",
            user_id:appointment?.user_id||""
            
        },
        onSubmit:(details:AppointmentContract)=>{
            axios.put(`http://localhost:4000/update-appointment/${params.id}`,details)
            .then(()=>{
                alert("appointment updated")
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
            <form onSubmit={formik.handleSubmit} className="w-25 p-2 border border-2 rounded user-bg text-white user-bg">
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
                <input readOnly onChange={formik.handleChange} value={formik.values.user_id} type="text" className="form-control" name="user_id" />
            </div>
            </div>

            <div className="mt-3">
                <span><button type="submit" className="btn btn-success">OK</button></span>
                <span className="mx-4"><Link to="/user-dashboard" className="btn btn-warning">Cancel</Link></span>
            </div>
        </form>
          </div>
        </>
    )
}