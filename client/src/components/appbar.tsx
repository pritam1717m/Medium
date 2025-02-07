import { Bell, Search, SquarePen } from "lucide-react";
import { Auth } from "./auth";
import Button from "./button";
import { Input } from "./ui/input";
import { ModeToggle } from "./mode-toggle";
import { ProfileDropdown } from "./profile-dropdown";
import { useRecoilValue } from "recoil";
import { userAtom } from "@/store/atom/user";

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
  let user = true
  if(!localStorage.getItem('token')){
    user = true
  } else {
    user = false
  }
  return user ? (
    <div className="top-0 h-20 w-full px-40 flex justify-between items-center border-b border-slate-200 bg-orange-50">
      <div className="">
        <img src="./src/assets/images/Wordmark.svg" width={110} alt="" />
      </div>
      <div className="flex space-x-5 items-center">
        <div className="list-none flex space-x-5 font-[HostGrotesk] text-black text-sm">
          {appbarLinks.map((link) => (
            <li key={link.id}>
              <a href={link.href}>{link.name}</a>
            </li>
          ))}
        </div>
        <Auth label={"Sign in"} textColor="text-black" />
        <Button children={<Auth label="Get Started" />} />
      </div>
    </div>
  ) : (
    <div className="top-0 h-[60px] w-full py-2.5 px-10 flex justify-between items-center border-b border-slate-200 bg-gray-50 dark:bg-slate-950 text-black dark:text-white">
      <div className="flex flex-row space-x-5 bg">
        <div className="w-40 bg-[url(./src/assets/images/Wordmark.svg)] bg-no-repeat bg-[auto_25px] bg-center dark:bg-[url(./src/assets/images/Wordmark-White.svg)]"></div>
        <div className="flex items-center rounded-full bg-gray-100 dark:bg-gray-800">
          <Search className="ml-3" strokeWidth={0.5} absoluteStrokeWidth />
          <Input
            className="w-100 h-10 border-none focus-visible:ring-0 font-semibold text-black dark:text-slate-100 placeholder:font-semibold"
            placeholder="Search"
          />
        </div>
      </div>
      <div className="flex space-x-10 items-center ">
        <ModeToggle />
        <button className="flex space-x-2">
          <SquarePen  strokeWidth={0.5} absoluteStrokeWidth />
          <p className="font-light">Write</p>
        </button>
        <button>
          <Bell strokeWidth={0.5} absoluteStrokeWidth />
        </button>
        <ProfileDropdown />
      </div>
    </div>
  );
}

export default AppBar;
