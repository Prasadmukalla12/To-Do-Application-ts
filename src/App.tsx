import { BrowserRouter, Route, Routes} from "react-router-dom";
import "./styles/header.css"
import { useCookies } from "react-cookie";
import { lazy, Suspense } from "react";

const ToDoHome = lazy(()=>import ("./componants/to-do-home"))
const UserRegister = lazy(()=>import ("./componants/user-register"))
const UserDashboard = lazy(()=>import ("./componants/user-dashboard"))
const AddAppointment = lazy(()=>import ("./componants/add-appointment"))
const EditAppointment = lazy(()=>import ("./componants/edit-appointment"))

export default function App() {
  
  const [,,removeCookie] = useCookies(["user_id"])

  function handleRemoveClick(){
    removeCookie("user_id")
    window.location.href="/"
  }

  return (
    <>
     <BrowserRouter>
        <header className=" col-12 p-3 d-flex justify-content-between align-items-center border border-2 bg position-sticky top-0">
          <div><h3 className="text-white">To-Do Application</h3></div>
          <div><button onClick={handleRemoveClick} className="bi bi-house btn btn-primary"></button></div>
        </header>
        <section className=" bg p-1 mt-1" style={{height:"600px"}}>
          <Suspense fallback={<h3>Loading...</h3>}>
            <Routes>
             <Route path="/" element={<ToDoHome/>} />
             <Route path="user-register" element={<UserRegister/>} />
             <Route path="user-dashboard" element={<UserDashboard/>} />
             <Route path="add-appointment" element={<AddAppointment/>} />
             <Route path="edit-appointment/:id" element={<EditAppointment/>} />
          </Routes>
          </Suspense>
        </section>
     </BrowserRouter>
    </>
  )
}

