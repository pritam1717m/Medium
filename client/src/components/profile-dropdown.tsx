import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { writeAtom } from "@/store/atom/write";
import axios from "axios";
import { PencilLine, ScrollText, SquarePen } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAtomValue, useSetAtom } from "jotai";
import { toast } from "sonner";
import { userAtom } from "@/store/atom/user";

export function ProfileDropdown() {
  const navigate = useNavigate();
  const user = useAtomValue(userAtom);
  const writeId = useSetAtom(writeAtom);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="w-9 h-9 rounded-full bg-black dark:bg-slate-200 text-2xl text-center">
          {user.name.slice(0,1)}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 mr-5 space-y-2 text-slate-600 font-semibold font-[HostGrotesk] dark:text-slate-300">
        <DropdownMenuItem>
          <button
            className="w-full flex space-x-2 "
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
            <SquarePen strokeWidth={0.9} absoluteStrokeWidth />
            <p className="">Write</p>
          </button>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <button
            className="w-full flex space-x-2 "
            onClick={() => {
              navigate("/draft");
            }}
          >
            <PencilLine strokeWidth={0.9} absoluteStrokeWidth />
            <p className="">Draft</p>
          </button>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <button
            className="w-full flex space-x-2"
            onClick={() => {
              navigate("/stories");
            }}
          >
            <ScrollText strokeWidth={0.9} absoluteStrokeWidth />
            <p className="">Stories</p>
          </button>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={()=>navigate("/profile")}>Profile</DropdownMenuItem>
          <DropdownMenuItem>Settings</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Membership</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Button
            variant={"ghost"}
            className="ml-[-15px] w-full justify-start hover:bg-transparent"
            onClick={() => {
              localStorage.removeItem("token");
              toast.info("Logged out");
              navigate("/");
            }}
          >
            Logout
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
