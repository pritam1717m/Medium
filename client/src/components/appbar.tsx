import { Bell, PencilLine, Search, SquarePen } from "lucide-react";
import { Auth } from "./auth";
import Button from "./button";
import { Input } from "./ui/input";
import { ModeToggle } from "./mode-toggle";
import { ProfileDropdown } from "./profile-dropdown";
import { useSetRecoilState } from "recoil";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import axios from "axios";
import { writeAtom } from "@/store/atom/write";

const appbarLinks = [
  {
    id: 1,
    name: "Our Story",
    href: "#",
  },
  {
    id: 2,
    name: "Membership",
    href: "#",
  },
  {
    id: 3,
    name: "Write",
    href: "#",
  },
];

function AppBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const writeId = useSetRecoilState(writeAtom);

  let user = true;
  if (!localStorage.getItem("token")) {
    user = true;
  } else {
    user = false;
  }
  return user ? (
    <div>
      <div className="top-0 h-[60px] w-full py-5 px-1 md:px-20 lg:px-30 xl:px-40 flex justify-between items-center border-b border-slate-200 bg-orange-50 text-black transition-all duration-400">
        <div className="w-full flex flex-row justify-between md:space-x-5 transition-all duration-400">
          <div className="w-40 bg-[url(/Wordmark.svg)] bg-no-repeat bg-[auto_25px] bg-center" onClick={() => navigate('/')}></div>
          <div className="flex space-x-5 items-center">
            <div className="hidden md:flex list-none space-x-5 font-[HostGrotesk] text-black text-sm">
              {appbarLinks.map((link) => (
                <li key={link.id}>
                  <a href={link.href}>{link.name}</a>
                </li>
              ))}
            </div>
            <Auth label={"Sign in"} textColor="text-black hidden md:flex" />
            <Button children={<Auth label="Get Started" />} />
          </div>
        </div>
      </div>
      <div className="flex space-x-5 justify-center md:hidden py-1 border-b border-slate-300 bg-orange-50">
        <div className="flex list-none space-x-5 font-[HostGrotesk] text-black text-base">
          {appbarLinks.map((link) => (
            <li key={link.id}>
              <a href={link.href}>{link.name}</a>
            </li>
          ))}
        </div>
        <Auth label={"Sign in"} textColor="text-black" />
      </div>
    </div>
  ) : (
    <div className="top-0 h-[60px] w-full py-2.5 md:px-10 flex justify-between items-center border-b border-slate-200 bg-gray-50 dark:bg-slate-950 text-black dark:text-white transition-all duration-400">
      <div className="flex flex-row md:space-x-5 transition-all duration-400">
        <div className="w-40 bg-[url(/Wordmark.svg)] bg-no-repeat bg-[auto_25px] bg-center dark:bg-[url(/Wordmark-White.svg)]" onClick={() => navigate('/blogs')}></div>
        <div className="flex items-center rounded-full md:bg-gray-100 md:dark:bg-gray-800">
          <Search
            className="ml-5 md:ml-3 transition-all duration-400"
            strokeWidth={0.5}
            absoluteStrokeWidth
          />
          <Input
            className="w-100 h-10 hidden md:inline border-none focus-visible:ring-0 font-semibold text-black dark:text-slate-100 placeholder:font-semibold transition-all duration-400"
            placeholder="Search"
          />
        </div>
      </div>
      <div className="flex space-x-3 mr-2 md:space-x-6 lg:space-x-10 items-center transition-all duration-400">
        <ModeToggle />
        <div className="hidden md:inline">
          {location.pathname == "/write" ? (
            <button
              className="flex space-x-2"
              onClick={() => {
                navigate("/write");
              }}
            >
              <PencilLine strokeWidth={0.5} absoluteStrokeWidth />
              <p className="font-light">Draft</p>
            </button>
          ) : (
            <button
              className="flex space-x-2"
              onClick={() => {
                  toast.promise(
                    axios.post(
                      `${import.meta.env.VITE_domain_uri}/blog`,
                      { title : 'Untitled', content: {} },
                      {
                        headers: {
                          "Content-Type": "application/json;charset=UTF-8",
                          Authorization: "Bearer " + localStorage.getItem("token"),
                        },
                      }
                    ),
                    {
                      loading: "Creating...",
                      success:(res) => {
                        writeId(() =>res.data)
                        return "Created successfully!"
                        } ,
                      error: "Failed to create!",
                    }
                  );
                navigate("/write");
              }}
            >
              <SquarePen strokeWidth={0.5} absoluteStrokeWidth />
              <p className="font-light">Write</p>
            </button>
          )}
        </div>
        <button>
          <Bell strokeWidth={0.5} absoluteStrokeWidth />
        </button>
        <ProfileDropdown />
      </div>
    </div>
  );
}

export default AppBar;
