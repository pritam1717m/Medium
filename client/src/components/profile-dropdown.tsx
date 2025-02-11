import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { writeAtom } from "@/store/atom/write";
import axios from "axios";
import { PencilLine, SquarePen } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import { toast } from "sonner";

export function ProfileDropdown() {
  const navigate = useNavigate();
  const writeId = useSetRecoilState(writeAtom);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="w-9 h-9 rounded-full bg-[url(/profile.jpg)] bg-no-repeat bg-[auto_40px] bg-center"></Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 mr-5">
        <DropdownMenuItem>
          <button
            className="w-full flex space-x-2"
            onClick={() => {
              toast.promise(
                axios.post(
                  `${import.meta.env.VITE_domain_uri}/blog`,
                  { title: "Untitled", content: {} },
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
            <SquarePen strokeWidth={0.5} absoluteStrokeWidth />
            <p className="font-light">Write</p>
          </button>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <button
            className="w-full flex space-x-2"
            onClick={() => {
              navigate("/draft");
            }}
          >
            <PencilLine strokeWidth={0.5} absoluteStrokeWidth />
            <p className="font-light">Draft</p>
          </button>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>Profile</DropdownMenuItem>
          <DropdownMenuItem>Billing</DropdownMenuItem>
          <DropdownMenuItem>Settings</DropdownMenuItem>
          <DropdownMenuItem>Keyboard shortcuts</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>Team</DropdownMenuItem>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>Invite users</DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuItem>Email</DropdownMenuItem>
                <DropdownMenuItem>Message</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>More...</DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
          <DropdownMenuItem>New Team</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem>GitHub</DropdownMenuItem>
        <DropdownMenuItem>Support</DropdownMenuItem>
        <DropdownMenuItem disabled>API</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Button
            variant={"ghost"}
            className="ml-[-15px] w-full justify-start font-normal text-slate-900 hover:bg-transparent dark:text-slate-100"
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
