import { Link, useNavigate } from "react-router-dom";
import "../styles/login-form.css"
import { useFormik } from "formik";
import { isAxiosError } from "axios";
import api, { saveSession } from "../api";
import {useCookies} from "react-cookie"
import * as yup from "yup"
import type { UserContract } from "../contracts/user-contract";
import { useState } from "react";


export default function ToDoHome(){

    const navigate = useNavigate()
    const [loginError, setLoginError] = useState("")
    const [,setCookie,] = useCookies(["user_id"])

    const formik = useFormik({
        initialValues:{
            user_id:"",
            password:""
        },
        onSubmit: async (user: UserContract) => {
            setLoginError("")
            try {
                const { data } = await api.post<{ user_id: string, token: string }>("/login", user)
                saveSession(data.token)
                setCookie("user_id", data.user_id, { path: "/", maxAge: 86400, sameSite: "lax" })
                navigate("/user-dashboard")
            } catch (error) {
                setLoginError(isAxiosError(error) && error.response?.status === 401
                    ? "Invalid user ID or password"
                    : "Unable to sign in. Please try again.")
            }
        },
        validationSchema:yup.object({
            user_id:yup.string().required("Username required"),
            password:yup.string().required("Password required")
        })
    })


    return(
        <div className="form-page">
            <div>
                <form onSubmit={formik.handleSubmit} className="form-panel">
                    <h1>Sign in</h1>
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
                    <label className="fw-bold my-2">Password</label>
                    <div>
                        <input onChange={formik.handleChange} type="password" className="form-control" name="password" />
                    </div>
                    <div className="text-danger fw-bold">
                       <span>{formik.errors.password}</span>
                    </div>
                </div>
                <div className="mt-3">
                    {loginError && <p className="text-danger" role="alert">{loginError}</p>}
                    <button type="submit" className="btn btn-primary w-100" disabled={formik.isSubmitting}>
                        {formik.isSubmitting ? "Signing in…" : "Login"}
                    </button>
                </div>
                <div className="text-center my-2">
                    <Link to="/user-register"><label className="fw-bold text-primary">New user</label></Link>
                </div>
            </form>
            </div>
        </div>
    )
}
