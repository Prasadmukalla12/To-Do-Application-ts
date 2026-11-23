import { useCallback, useEffect, useState } from "react"
import { createPortal } from "react-dom"
import { useCookies } from "react-cookie"
import { Link, useNavigate} from "react-router-dom"
import type { AppointmentContract } from "../contracts/appointment-contract"
import axios from "../api"
import moment from "moment"
import  {useDispatch,useSelector} from "react-redux"
import { addToArchive,addToUnarchive } from "../redux/slicer/slicer"
import type { RootState } from "../redux/store/store"

 
 export default function UserDashboard(){

  const [cookie,,removeCookie] = useCookies(["user_id"])
  const navigate = useNavigate()
  const [details,setDetails] = useState<AppointmentContract[]>([])

  const handleRemoveClick = useCallback(()=>{
    removeCookie("user_id")
    navigate("/")
  },[])

  const archives = useSelector((state: RootState) => state.archives)
  const archiveList = archives.filter(item => item.user_id === cookie["user_id"])
  const archivedIds = new Set(archiveList.map(item => item.appointment_id))
  const activeAppointments = details.filter(item => !archivedIds.has(item.appointment_id))

  const dispatch = useDispatch()

  const handleArchiveClick = useCallback((user:AppointmentContract)=>{
    dispatch(addToArchive(user))
  },[dispatch])

  const handleUnArchiveClick = useCallback((user:AppointmentContract)=>{
    dispatch(addToUnarchive(user))
  },[dispatch])

  const handleAddClick = useCallback(()=>{
    navigate("/add-appointment")
  },[])

  const handleDeleteClick = useCallback((id:number)=>{
       var result = confirm("Are you sure to delete?")
         if(result===true){
           axios.delete(`/delete-appointment/${id}`)
           .then(()=>{
              alert("Appointment deleted")
              navigate("/user-dashboard")
              LoadDetails()
           })
         }else{
          navigate("/user-dashboard")
         }
  },[])

  const LoadDetails = useCallback(()=>{
    axios.get(`/appointments/${cookie["user_id"]}`)
    .then(res=>{
      setDetails(res.data)
    })
  },[])

  useEffect(()=>{
    if(cookie["user_id"]){
      LoadDetails()
    }
  },[cookie])

    return(
        <div>
          <div className="dashboard-toolbar d-flex flex-wrap justify-content-between align-items-center gap-3">
            <div className="d-flex flex-wrap align-items-center gap-3"><h1 className="text-white fw-bold fs-3 mb-0">{cookie["user_id"]} - Dashboard</h1><button onClick={handleAddClick} className="btn btn-primary">Add Appointment</button></div>
            <div>
              <button className="btn btn-info bi bi-archive position-relative" data-bs-toggle="modal" data-bs-target="#list"><span>Archives</span><span className="badge bg-danger rounded position-absolute">{archiveList.length}</span></button>
              {createPortal(
              <div className="modal fade" id="list" tabIndex={-1} aria-labelledby="archive-title">
                <div className="modal-dialog">
                  <div className="modal-content">
                    <div className="modal-header d-flex justify-content-between">
                        <span className="fs-4 fw-bold" id="archive-title">Archives</span>
                        <span><button className="btn btn-close" data-bs-dismiss="modal"></button></span>
                    </div>
                    <div className="modal-body">
                     {
                      archiveList.length === 0 ? (<div> <h3 className="text-center" style={{color:"orange"}}>No Archive items</h3></div>) : (
                        archiveList.map(item =>
                          <div className="d-flex flex-column" key={item.appointment_id}>
                            <div className="card appointment-surface p-2 m-2">
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
              </div>, document.body)}
            </div>
            <div><button onClick={handleRemoveClick} className="btn btn-danger bi bi-person-dash">Signout</button></div>
          </div>
          <div className="container-fluid appointment-grid">
             <div className="row">
              {
               activeAppointments.length === 0 ? (
                <div><h4 className="text-white mt-3">No appointments</h4></div>
               ) : (
                activeAppointments.map(user=>
                <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-3" key={user.appointment_id}>
                  <div className="card appointment-surface h-100">
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
                    <span><button onClick={()=>{handleDeleteClick(user.appointment_id)}} className="btn btn-danger bi bi-trash-fill">Delete</button></span>
                  </div>
                </div>
                </div>
              )
               )
             }
             </div>
          </div>
        </div>
    )
 }
