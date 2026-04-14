import { Link, useNavigate } from "react-router-dom";
import "../styles/login-form.css"
import{useFormik} from "formik"
import axios from "axios"
import * as yup from "yup"
import type { UserContract } from "../contracts/user-contract";
import { useEffect, useState } from "react";


export default function UserRegister(){

    const navigate = useNavigate()
    const [ExistUser,setExistUser] = useState([])

    useEffect(()=>{
        axios.get("http://localhost:4000/users")
        .then(res=>{
            console.log(res.data)
            setExistUser(res.data)
        })
    },[])

    const formik = useFormik({
        initialValues:{
            user_id:"",
            user_name:"",
            password:"",
            email:""
        },
        onSubmit:(user:UserContract)=>{
            var result = {
                user_id : user.user_id,
                user_name:user.user_name,
                password : user.password,
                email:user.email
            }

            var userResult = ExistUser.find((val:any)=>val.user_id===user.user_id)
             if(!userResult){
                axios.post("http://127.0.0.1:4000/add-user",result)
            .then(()=>{
               alert("user added")
               navigate("/")
            })
             }else{
                alert("user_id Exist")
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
        <div className="d-flex justify-content-center align-items-center container-fluid" style={{height:"400px"}}>
          <div>
            <form onSubmit={formik.handleSubmit} className="p-2 text-white user-bg border border-2 rounded">
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
                <button type="submit" className="btn btn-primary w-100"><label className="fw-bold">Register</label></button>
            </div>
            <div className="text-center">
                <Link to="/"><label className="fw-bold">Existing user</label></Link>
            </div>
          </form>
          </div>
        </div>
    )
}