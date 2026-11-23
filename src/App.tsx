import { BrowserRouter, Route, Routes} from "react-router-dom";
import "./styles/header.css"
import { useCookies } from "react-cookie";
import { lazy, Suspense } from "react";
import { endSession } from "./api";

const ToDoHome = lazy(()=>import ("./componants/to-do-home"))
const UserRegister = lazy(()=>import ("./componants/user-register"))
const UserDashboard = lazy(()=>import ("./componants/user-dashboard"))
const AddAppointment = lazy(()=>import ("./componants/add-appointment"))
const EditAppointment = lazy(()=>import ("./componants/edit-appointment"))

export default function App() {
  
  const [,,removeCookie] = useCookies(["user_id"])

  async function handleRemoveClick(){
    try {
      await endSession()
    } finally {
      removeCookie("user_id", { path: "/" })
      window.location.href="/"
    }
  }

  return (
    <>
     <BrowserRouter>
        <header className="app-header">
          <div className="app-brand">
            <i className="bi bi-check2-square" aria-hidden="true" />
            <span>To-Do Application</span>
          </div>
          <button type="button" onClick={handleRemoveClick} className="bi bi-house btn btn-outline-light" aria-label="Return home" />
        </header>
        <main className="app-main">
          <Suspense fallback={<p className="app-loading" role="status">Loading…</p>}>
            <Routes>
             <Route path="/" element={<ToDoHome/>} />
             <Route path="user-register" element={<UserRegister/>} />
             <Route path="user-dashboard" element={<UserDashboard/>} />
             <Route path="add-appointment" element={<AddAppointment/>} />
             <Route path="edit-appointment/:id" element={<EditAppointment/>} />
          </Routes>
          </Suspense>
        </main>
     </BrowserRouter>
    </>
  )
}

