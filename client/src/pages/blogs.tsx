import AppBar from "@/components/appbar";
import BlogsLeft from "@/components/blogs-left";
import BlogsRight from "@/components/blogs-right";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

function Blogs() {
  const navigate = useNavigate();
  useEffect(() => {
    if (!localStorage.getItem("token")) {
      toast.info("You're not logged in...");
      navigate("/");
    }
  }, []);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 5000);
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
          {isLoading ? (
            Array.from({ length: 4 }).map(() => {
              return (
                <div className="py-8 px-5 md:px-5">
                  <div className="flex flex-row space-x-2 items-center">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <Skeleton className="h-6 w-24" />
                  </div>
                  <div className="w-full flex flex-row space-x-0 md:space-x-5 mt-4">
                    <div className="flex flex-col space-y-2 w-full">
                      <Skeleton className="h-8 w-1/3" />
                      <Skeleton className="h-6 w-2/3 md:w-5/6" />
                      <Skeleton className="h-6 w-2/3" />
                    </div>
                    <Skeleton className="h-24 w-36 md:min-w-36 max-w-36" />
                  </div>
                  <div className="mt-4 flex flex-row space-x-4 text-center">
                    <Skeleton className="h-5 w-12" />
                    <Skeleton className="h-5 w-12" />
                    <Skeleton className="h-5 w-12" />
                  </div>
                  <hr className="mt-5"/>
                </div>
              );
            })
          ) : (
            <BlogsLeft />
          )}
        </div>
        <div className="max-w-0 md: w-1/3 lg:min-w-96 lg:max-w-52 bg-orange-50 hidden md:block">
          <BlogsRight />
        </div>
      </div>
    </div>
  );
}

export default Blogs;
