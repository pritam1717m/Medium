import Button from "@/components/button";
import DraftBlogCard from "@/components/draft-blog-card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { blogAtom } from "@/store/atom/blogs";
import axios from "axios";
import { useEffect, useState } from "react";
import { useAtom } from "jotai";
import { toast } from "sonner";

export default function PublishedBlog() {
  const [blogs, setBlogs] = useAtom(blogAtom);
  const [isLoading, setIsLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);
  useEffect(() => {
    setIsLoading(true);
    (async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_domain_uri}/blog/published`,
          {
            headers: {
              "Content-Type": "application/json;charset=UTF-8",
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
          }
        );

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
  }, [refresh]);
  return (
    <div className="mt-5 min-w-[350px] lg:min-w-[500px]">
      {isLoading
        ? Array.from({ length: 4 }).map((_, index) => {
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
        : blogs.length ? blogs.map((blog) => {
            return (
              <div className="flex space-x-5 justify-between items-center border-b border-slate-200 dark:border-slate-700">
                <DraftBlogCard key={blog.id} blog={blog} />
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button classname="bg-red-500 dark:bg-red-500">
                      Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you sure to delete this content?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This action can't be undone if you delete it. This will
                        parmanently delete this content.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        className="bg-red-500 dark:bg-red-500 text-white"
                        onClick={() => {
                          toast.promise(
                            axios.delete(
                              `${import.meta.env.VITE_domain_uri}/blog/${
                                blog.id
                              }`,
                              {
                                headers: {
                                  "Content-Type":
                                    "application/json;charset=UTF-8",
                                  Authorization:
                                    "Bearer " + localStorage.getItem("token"),
                                },
                              }
                            ),
                            {
                              loading: "Deleting",
                              success: () => {
                                setRefresh((refresh) => !refresh);
                                return "Blog deleted successfully";
                              },
                              error: "Failed to delete!!",
                            }
                          );
                        }}
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            );
          }) : <p className="text-center">You haven’t published any public stories yet.</p>}
    </div>
  );
}
