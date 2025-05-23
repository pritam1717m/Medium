import AppBar from "@/components/appbar";
import BlogsLeft from "@/components/blogs-left";
import BlogsRight from "@/components/blogs-right";
import axios from "axios";
import {  useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

function Blogs() {
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
      className="h-screen w-screen flex flex-col sm:overflow-y-scroll [&::-webkit-scrollbar]:w-2
  [&::-webkit-scrollbar-track]:bg-gray-100
  [&::-webkit-scrollbar-thumb]:bg-gray-300
  dark:[&::-webkit-scrollbar-track]:bg-neutral-700
  dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500"
    >
      <AppBar />
      <div className="xl:px-20 w-full flex flex-row justify-evenly">
        <div className="min-w-full md:w-2/3 lg:min-w-[728px] lg:max-w-[728px]">
          <BlogsLeft />
        </div>
        <div className=" max-w-0 md: w-1/3 lg:min-w-96 lg:max-w-52 hidden md:block">
          <BlogsRight />
        </div>
      </div>
    </div>
  );
}

export default Blogs;
