import Footer from "@/components/footer";
import AppBar from "../components/appbar";
import { Auth } from "@/components/auth";
import Button from "@/components/button";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("token")) {
        navigate('/blogs')
    }
  }, []);
  return (
    <div className="h-screen w-screen flex flex-col justify-between bg-orange-50 bg-[url(/bg.png)] bg-no-repeat bg-[auto_600px] bg-right">
      <AppBar />
      
      <div className="w-full h-full px-5 md:px-20 lg:px-30 xl:px-40 text-black flex flex-col justify-center space-y-10 backdrop-blur-xl lg:backdrop-blur-none">
        <p className="font-[gt-super] text-[90px] md:text-[100px] lg:text-[120px] leading-none tracking-tighter">
          Human <br /> stories & ideas
        </p>
        <p className="text-2xl tracking-normal">
          A place to read, write, and deepen your understanding
        </p>
        <Button classname="w-48" children={<Auth label="Start Reading" textColor="text-xl" />} />
      </div>
      <Footer />
    </div>
  )
}

export default Home;
