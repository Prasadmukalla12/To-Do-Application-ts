import { BrowserRouter, Route, Routes} from "react-router-dom";
import "./styles/header.css"
import { ToDoHome } from "./componants/to-do-home";
import { UserRegister } from "./componants/user-register";
import { UserDashboard } from "./componants/user-dashboard";
import { useCookies } from "react-cookie";
import { AddAppointment } from "./componants/add-appointment";
import { EditAppointment } from "./componants/edit-appointment";


export default function App() {
  
  const [,,removeCookie] = useCookies(["user_id"])

  function handleRemoveClick(){
    removeCookie("user_id")
    window.location.href="/"
  }

  return (
    <>
     <BrowserRouter>
        <header className="p-3 d-flex justify-content-between align-items-center border border-2 bg position-sticky top-0">
          <div><h3 className="text-white">To-Do Application</h3></div>
          <div><button onClick={handleRemoveClick} className="bi bi-house btn btn-primary"></button></div>
        </header>
        <section className="bg p-1 mt-1" style={{height:"100vh"}}>
          <Routes>
             <Route path="/" element={<ToDoHome/>} />
             <Route path="user-register" element={<UserRegister/>} />
             <Route path="user-dashboard" element={<UserDashboard/>} />
             <Route path="add-appointment" element={<AddAppointment/>} />
             <Route path="edit-appointment/:id" element={<EditAppointment/>} />
          </Routes>
        </section>
     </BrowserRouter>
    </>
  )
}

