import { useEffect, useState } from "react"
import { useCookies } from "react-cookie"
import { Link, useNavigate} from "react-router-dom"
import type { AppointmentContract } from "../contracts/appointment-contract"
import axios from "axios"
import moment from "moment"
import  {useDispatch,useSelector} from "react-redux"
import { addToArchive,addToUnarchive } from "../slicers/slicer"

 
 export function UserDashboard(){

  const [cookie,,removeCookie] = useCookies(["user_id"])
  const navigate = useNavigate()
  const [details,setDetails] = useState<AppointmentContract[]>([])

  function handleRemoveClick(){
    removeCookie("user_id")
    navigate("/")
  }

  const ArchiveList = useSelector((state:any)=>state.archives)
  const ArchiveCount = useSelector((state:any)=>state.archiveCount)

  const dispatch = useDispatch()

  function handleArchiveClick(e:AppointmentContract){
      dispatch(addToArchive(e))
      setDetails(preview=>preview.filter(item=>item.appointment_id!==e.appointment_id))
  }

  function handleUnArchiveClick(e:AppointmentContract){
      dispatch(addToUnarchive(e))
      setDetails(preview => preview.concat(e))
  }

  function handleAddClick(){
    navigate("/add-appointment")
  }

  function handleDeleteClick(id:number){
         var result = confirm("Are you sure to delete?")
         if(result===true){
           axios.delete(`http://localhost:4000/delete-appointment/${id}`)
           .then(()=>{
              alert("Appointment deleted")
              navigate("/user-dashboard")
              LoadDetails()
           })
         }else{
          navigate("/user-dashboard")
         }
  }

  function LoadDetails(){
    axios.get(`http://localhost:4000/appointments/${cookie["user_id"]}`)
    .then(res=>{
      setDetails(res.data)
    })
  }

  useEffect(()=>{
    if(cookie["user_id"]){
      LoadDetails()
    }
  },[cookie])

    return(
        <>
          <div className="d-flex justify-content-between align-items-center p-3 border border-2 container-fluid">
            <div className="d-flex align-items-center"><span className="text-white fw-bold fs-3">{cookie["user_id"]} - Dashboard</span><span><button onClick={handleAddClick} className="btn btn-primary mx-2">Add Appointment</button></span></div>
            <div>
              <button className="btn btn-info bi bi-archive position-relative" data-bs-toggle="modal" data-bs-target="#list"><span>Archives</span><span className="badge bg-danger rounded position-absolute">{ArchiveCount}</span></button>
              <div className="modal modal-fullscreen" id="list">
                <div className="modal-dialog">
                  <div className="modal-content">
                    <div className="modal-header d-flex justify-content-between">
                        <span className="fs-4 fw-bold">Archives</span>
                        <span><button className="btn btn-close" data-bs-dismiss="modal"></button></span>
                    </div>
                    <div className="modal-body">
                     {
                      ArchiveList<=0 ? (<div> <h3 className="text-center" style={{color:"orange"}}>No Archive items</h3></div>) : (
                        ArchiveList.map((item:AppointmentContract)=>
                          <div className="d-flex flex-column">
                            <div className="card p-2 m-2" key={item.appointment_id}>
                            <div className="card-header">
                              <h3>{item.title}</h3>
                            </div>
                            <div className="card-body">
                              <dl>
                                <dt>Descripton</dt>
                                <dd>{item.description}</dd>
                                <dt>Date</dt>
                                <dd>{item.date}</dd>
                              </dl>
                            </div>
                            <div className="card-footer">
                              <button className="btn btn-info w-100" onClick={()=>{handleUnArchiveClick(item)}}>Unarchive</button>
                            </div>
                          </div>
                          </div>
                        )
                      )
                     }
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div><button onClick={handleRemoveClick} className="btn btn-danger bi bi-person-dash">Signout</button></div>
          </div>
          <div className="d-flex container-fluid">
             {
               details.length<=0 ? (
                <div><h4 className="text-danger mt-3">No appointments</h4></div>
               ) : (
                details.map(user=>
                <div className="card w-25 m-2 p-2" key={user.appointment_id}>
                  <div className="card-header">
                    <h4>{user.title}</h4>
                  </div>
                  <div className="card-body">
                    <dl>
                      <dt>Description</dt>
                      <dd>{user.description}</dd>
                      <dt>Date</dt>
                      <dd>{moment(user.date).format("YYYY-MM-DD")}</dd>
                    </dl>
                  </div>
                  <div className="card-footer p-2 d-flex justify-content-between align-items-center">
                    <span><Link to={`/edit-appointment/${user.appointment_id}`} className="btn btn-warning bi bi-pen-fill">Edit</Link></span>
                    <span><button className="btn btn-secondary bi bi-archive-fill" onClick={()=>{handleArchiveClick(user)}}>Archive</button></span>
                    <span><button onClick={()=>{handleDeleteClick(user.appointment_id)}} className="btn btn-danger bi bi-trash-fillz">Delete</button></span>
                  </div>
                </div>
              )
               )
             }
          </div>
        </>
    )
 }