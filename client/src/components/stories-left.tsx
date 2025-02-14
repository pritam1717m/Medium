import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { writeAtom } from "@/store/atom/write";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import { toast } from "sonner";
import DraftBlog from "./draft-blog";
import PublishedBlog from "./published-blog";

export default function StoriesLeft() {
  const navigate = useNavigate();
  const writeId = useSetRecoilState(writeAtom);

  return (
    <div className="w-full px-10 flex flex-col justify-center items-center font-[HostGrotesk]">
      <div className="w-full pt-14 pb-5 flex flex-row justify-between ">
        <p className="text-5xl font-bold dark:text-slate-200">Your stories</p>
        <div>
          <button
            className="bg-green-700/90 px-4 py-2 rounded-full text-slate-50"
            onClick={() => {
              toast.promise(
                axios.post(
                  `${import.meta.env.VITE_domain_uri}/blog`,
                  {
                    title: "Untitled",
                    content: { time: 0, blocks: [], version: "" },
                  },
                  {
                    headers: {
                      "Content-Type": "application/json;charset=UTF-8",
                      Authorization: "Bearer " + localStorage.getItem("token"),
                    },
                  }
                ),
                {
                  loading: "Creating...",
                  success: (res) => {
                    writeId(() => res.data);
                    return "Created successfully!";
                  },
                  error: "Failed to create!",
                }
              );
              navigate("/write");
            }}
          >
            <p className="">Write a story</p>
          </button>
        </div>
      </div>
      <div className="w-full">
        <Tabs defaultValue="account" className="w-full">
          <TabsList className="w-full py-8 flex flex-row justify-start bg-transparent border-b rounded-none">
            <TabsTrigger value="draft" autoFocus>Drafts</TabsTrigger>
            <TabsTrigger value="published">Published</TabsTrigger>
          </TabsList>
          <TabsContent value="draft" className="mx-5">
            <DraftBlog />
          </TabsContent>
          <TabsContent value="published">
            <PublishedBlog />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
