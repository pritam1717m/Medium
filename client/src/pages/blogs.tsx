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
      className="h-screen w-screen flex flex-col overflow-y-scroll [&::-webkit-scrollbar]:w-2
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
                <div className="py-8 border-b border-slate-200 font-[HostGrotesk]">
                  <div className="flex flex-row space-x-2 items-center">
                    <Skeleton className="w-7 h-7 rounded-full" />
                    <Skeleton className="w-60 h-5" />
                  </div>
                  <div className="w-full flex flex-row space-x-20">
                    <div className="mt-2 flex flex-col space-y-3">
                      <Skeleton className="w-96 h-8" />
                      <Skeleton className="w-80 h-4" />
                    </div>
                    <div className="md:min-w-36 max-w-36">
                      <Skeleton className="w-44 h-28" />
                    </div>
                  </div>
                  <div className="mt-2 flex flex-row space-x-2 text-center text-slate-500 font-medium">
                    <Skeleton className="w-20 h-5" />
                    <Skeleton className="w-20 h-5" />
                    <Skeleton className="w-20 h-5" />
                  </div>
                </div>
              );
            })
          ) : (
            <BlogsLeft />
          )}
        </div>
        <div className="max-w-0 md: w-1/3 lg:min-w-96 lg:max-w-52 bg-orange-50 invisible md:visible">
          <BlogsRight />
        </div>
      </div>
    </div>
  );
}

export default Blogs;
