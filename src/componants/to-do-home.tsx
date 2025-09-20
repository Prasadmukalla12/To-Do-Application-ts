import { Link, useNavigate } from "react-router-dom";
import "../styles/login-form.css"
import { useFormik } from "formik";
import axios from "axios";
import {useCookies} from "react-cookie"
import * as yup from "yup"
import type { UserContract } from "../contracts/user-contract";


export function ToDoHome(){

    const navigate = useNavigate()
    const [,setCookie,] = useCookies(["user_id"])

    const formik = useFormik({
        initialValues:{
            user_id:"",
            password:""
        },
        onSubmit:(user:UserContract)=>{
            axios.get("http://localhost:4000/users")
            .then(res=>{
                var result = res.data.find((item:UserContract)=>item.user_id===user.user_id)
                if(result){
                   setCookie("user_id",user.user_id,{expires:new Date("2025-12-26")})
                   if(user.password===result.password){
                      navigate("/user-dashboard")
                   }else{
                    alert("Invalid password")
                   }
                }else{
                    alert("User not found")
                }
            })
        },
        validationSchema:yup.object({
            user_id:yup.string().required("Username required"),
            password:yup.string().required("Password required")
        })
    })


    return(
        <div className="d-flex justify-content-center align-items-center container-fluid" style={{height:"400px"}}>
            <form onSubmit={formik.handleSubmit} className="w-25 p-2 border border-2 rounded text-white user-bg">
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
                    <button  type="submit" className="btn btn-primary w-100"><label className="fw-bold">Login</label></button>
                </div>
                <div className="text-center my-2">
                    <Link to="/user-register"><label className="fw-bold text-primary">New user</label></Link>
                </div>
            </form>
        </div>
    )
}