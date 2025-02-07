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
    <Editor />
  )
}

export default Write