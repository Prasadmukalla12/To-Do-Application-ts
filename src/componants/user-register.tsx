import { Link, useNavigate } from "react-router-dom";
import "../styles/login-form.css"
import{useFormik} from "formik"
import { isAxiosError } from "axios";
import api from "../api"
import * as yup from "yup"
import type { UserContract } from "../contracts/user-contract";
import { useState } from "react";


export default function UserRegister(){

    const navigate = useNavigate()
    const [registrationError, setRegistrationError] = useState("")

    const formik = useFormik({
        initialValues:{
            user_id:"",
            user_name:"",
            password:"",
            email:""
        },
        onSubmit: async (user: UserContract) => {
            setRegistrationError("")
            try {
                await api.post("/add-user", user)
                navigate("/")
            } catch (error) {
                setRegistrationError(isAxiosError(error) && error.response?.status === 409
                    ? "User ID already exists"
                    : "Unable to register. Please try again.")
            }
        },
        validationSchema:yup.object({
            user_id:yup.string().required("User ID required").min(4,"User ID is Too short").max(15,"User ID not be above 15 characters"),
            user_name:yup.string().required("Username required").min(4,"Username is too short").max(15,"Username not be above 15 characters"),
            password:yup.string().required("Password required").matches(/[A-Z]\w{5,12}/,"First Must be upper and should not be before 6 chars"),
            email:yup.string().required("Email required").matches(/[a-z,A-Z,0-9]+@gmail\.com/,"Email should be Your address@gmail.com")
        })
    })

    return(
        <div className="form-page">
          <div>
            <form onSubmit={formik.handleSubmit} className="form-panel">
                <h1>Create an account</h1>
            <div>
                <label className="fw-bold my-2">User ID</label>
                <div>
                    <input onChange={formik.handleChange} type="text" className="form-control" name="user_id" />
                </div>
                <div className="text-danger fw-bold">
                    <span>{formik.errors.user_id}</span>
                </div>
            </div>
            <div>
                <label className="fw-bold my-2">Username</label>
                <div>
                    <input onChange={formik.handleChange} type="text" className="form-control" name="user_name" />
                </div>
                <div className="text-danger fw-bold">
                    <span>{formik.errors.user_name}</span>
                </div>
            </div>
            <div>
                <label className="fw-bold my-2">Password</label>
                <div>
                    <input onChange={formik.handleChange} type="password" className="form-control" name="password" />
                </div>
                <div className="text-danger fw-bold">
                    <span>{formik.errors.password}</span>
                </div>
            </div>
            <div>
                <label className="fw-bold my-2">Email</label>
                <div>
                    <input onChange={formik.handleChange} type="email" className="form-control" name="email" />
                </div>
                <div className="text-danger fw-bold">
                    <span>{formik.errors.email}</span>
                </div>
            </div>
            <div className="mt-3">
                {registrationError && <p className="text-danger" role="alert">{registrationError}</p>}
                <button type="submit" className="btn btn-primary w-100" disabled={formik.isSubmitting}>
                    {formik.isSubmitting ? "Registering…" : "Register"}
                </button>
            </div>
            <div className="text-center">
                <Link to="/"><label className="fw-bold">Existing user</label></Link>
            </div>
          </form>
          </div>
        </div>
    )
}
