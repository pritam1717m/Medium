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
    <div className="h-screen w-screen flex flex-col justify-between bg-orange-50 bg-[url(./src/assets/images/bg.png)] bg-no-repeat bg-[auto_600px] bg-right">
      <AppBar />
      <div className="w-full px-40 text-black justify-start space-y-10">
        <p className="font-[gt-super] text-[120px] leading-none tracking-tighter">
          Human <br /> stories & ideas
        </p>
        <p className="text-2xl tracking-normal">
          A place to read, write, and deepen your understanding
        </p>
        <Button children={<Auth label="Start Reading" textColor="text-xl" />} />
      </div>
      <Footer />
    </div>
  )
}

export default Home;
