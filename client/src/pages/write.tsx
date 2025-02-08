import AppBar from "@/components/appbar"
import Editor from "@/components/editor"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"

function Write() {
  const navigate = useNavigate()
    useEffect(() => {
        if(!localStorage.getItem('token')) {
            toast.info("You're not logged in...")
            navigate('/')
        }
    })
  return (
    <div
      className="h-screen w-screen flex flex-col items-center overflow-y-scroll [&::-webkit-scrollbar]:w-2
  [&::-webkit-scrollbar-track]:bg-gray-100
  [&::-webkit-scrollbar-thumb]:bg-gray-300
  dark:[&::-webkit-scrollbar-track]:bg-neutral-700
  dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500"
    >
      <AppBar />
      <div className="w-full mt-5">
        <Editor />
      </div>
    </div>
  );
}

export default Write