import AppBar from "@/components/appbar"
import DraftEditor from "@/components/draft-editor"
import axios from "axios"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"

function Edit() {
  const navigate = useNavigate();
  useEffect(() => {
    if(!localStorage.getItem("token")){
      navigate("/")
    }
    (async () => {
      try {
        await axios.get(
          `${import.meta.env.VITE_domain_uri}/user/me`,
          {
            headers: {
              "Content-Type": "application/json;charset=UTF-8",
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
          }
        );
      } catch (error: any) {
        if(error.response?.status === 429){
          toast.error("Too many requests, please try again after 1 minutes")
        }
        if (error.response?.status === 401) {
          toast.error("Session expired, Login again...");
          localStorage.removeItem("token");
          navigate("/");
        }
      }
    })();
  }, []);
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
        <DraftEditor />
      </div>
    </div>
  );
}

export default Edit