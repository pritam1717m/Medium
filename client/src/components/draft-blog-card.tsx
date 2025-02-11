import { useNavigate } from "react-router-dom";
import { formatTime, getContent } from "./blog-card";
import { useSetRecoilState } from "recoil";
import { writeAtom } from "@/store/atom/write";

type Blog = {
  id: string;
  title: string;
  content: any;
  time: string;
  author?: string;
};

function DraftBlogCard({ blog }: { blog: Blog }) {
    const content = getContent(blog.content);
    const navigate = useNavigate();
    const setBlogId = useSetRecoilState(writeAtom);
    return (
      <div className="py-8 flex flex-col space-y-2 border-b border-slate-200 dark:border-slate-700 font-[HostGrotesk]">
        <div
          className="w-full flex flex-row space-x-5 cursor-pointer"
          onClick={() => {
            setBlogId({id : blog.id})
            navigate("/write");
          }}
        >
          <div className="mt-2 flex flex-col space-y-2">
            <p className="text-2xl font-extrabold text-wrap">{blog.title}</p>
            <p className="text-slate-500 font-medium">
              {content.length >= 130 ? content.slice(0, 130) + "..." : content}
            </p>
          </div>
          <div className="w-0 md:min-w-36 max-w-26"></div>
        </div>
        <div className="mt-2 flex flex-row space-x-2 text-center text-slate-500 font-medium">
          <p className="text-center">✨ {formatTime(blog.time)}</p>
        </div>
      </div>
    );
}

export default DraftBlogCard