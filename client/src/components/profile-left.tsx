import { blogAtom } from "@/store/atom/blogs";
import { userAtom } from "@/store/atom/user";
import axios from "axios";
import { MoreHorizontal } from "lucide-react";
import { useEffect, useState } from "react";
import { useAtomValue, useAtom } from "jotai";
import ProfileBlog from "./profile-blog";
import { Skeleton } from "./ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import ProfileAbout from "./profile-about";
import Followings from "./followings";
import Followers from "./Followers";

export default function ProfileLeft() {
  const [blogs, setBlogs] = useAtom(blogAtom);
  const [isLoading, setIsLoading] = useState(false);
  const user = useAtomValue(userAtom);

  useEffect(() => {
    setIsLoading(true);
    (async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_domain_uri}/blog`, {
          headers: {
            "Content-Type": "application/json;charset=UTF-8",
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        });

        if (Array.isArray(res.data.post)) {
          const formattedBlogs = res.data.post.map((item: any) => ({
            id: item.id,
            title: item.title,
            content: item.content,
            time: item.updatedAt,
          }));
          setBlogs(formattedBlogs);
          setIsLoading(false);
        } else {
          console.error("Unexpected response format:");
        }
      } catch (error) {
        console.error("Error fetching blogs:", error);
      }
    })();
  }, []);

  return (
    <div className="flex flex-col mt-20">
      <div className="my-5 flex items-center justify-between">
        <h1 className="text-4xl font-bold text-black dark:text-slate-100">
          {user.name}
        </h1>
        <button>
          <MoreHorizontal className="w-6 h-6" />
        </button>
      </div>

      <div className="w-full">
        <Tabs defaultValue="home">
          <TabsList className="w-full py-8 flex flex-row justify-start bg-transparent border-b rounded-none">
            <TabsTrigger value="home" autoFocus>
              Home
            </TabsTrigger>
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="followers">Followers</TabsTrigger>
            <TabsTrigger value="followings">Followings</TabsTrigger>
          </TabsList>
          <TabsContent value="home" className="mx-5">
            <div className="mt-5">
              {isLoading ? (
                Array.from({ length: 3 }).map((_, index) => {
                  return (
                    <div className="py-8" key={index}>
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
                      <hr className="mt-5" />
                    </div>
                  );
                })
              ) : blogs.length > 0 ? (
                blogs.map((blog) => <ProfileBlog blog={blog} key={blog.id} />)
              ) : (
                <p className="text-gray-500 mt-2">No stories yet</p>
              )}
            </div>
          </TabsContent>
          <TabsContent value="about" className="mx-5">
            <ProfileAbout />
          </TabsContent>
          <TabsContent value="followers" className="mx-5">
            <Followers />
          </TabsContent>
          <TabsContent value="followings" className="mx-5">
            <Followings />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
