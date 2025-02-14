import AppBar from "@/components/appbar";
import DraftBlog from "@/components/draft-blog";

function Draft() {

  return (
    <div
      className="h-screen w-screen flex flex-col sm:overflow-y-scroll [&::-webkit-scrollbar]:w-2
  [&::-webkit-scrollbar-track]:bg-gray-100
  [&::-webkit-scrollbar-thumb]:bg-gray-300
  dark:[&::-webkit-scrollbar-track]:bg-neutral-700
  dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500"
    >
      <AppBar />
      <div className="w-full px-5 sm:px-10 pt-10 flex flex-col items-center">
        <p className="text-4xl font-bold font-[gt-super]">Your Drafts</p>
        <DraftBlog />
      </div>
    </div>
  );
}

export default Draft;
