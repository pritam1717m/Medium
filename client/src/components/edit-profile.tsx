import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { userAtom } from "@/store/atom/user";
import axios from "axios";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface Link {
  id: number;
  value: string;
}

type Links = Array<Link>;

export default function EditProfile() {
  const [user, setUser] = useAtom(userAtom);
  const [id, setId] = useState(user.links?.length || 0);
  const [userUpdateInput, setUserUpdateInput] = useState({
    name: user.name,
    about: user.about,
    links: user.links,
  });

  const [linkInput, setLinkInput] = useState<Links>(
    (userUpdateInput.links as Links) || []
  );

  const addLink = () => {
    setLinkInput((s) => {
      return [
        ...s,
        {
          id,
          value: "",
        },
      ];
    });
    setId((id) => id + 1);
  };

  const removeLink = (id: number) => {
    setLinkInput((s) => s.filter((itm) => itm.id !== id));
  };

  const handleSaveChanges = async () => {
    try {
      setUserUpdateInput({
        ...userUpdateInput,
        links: linkInput,
      });
      toast.promise(
        axios.put(
          `${import.meta.env.VITE_domain_uri}/user/update`,
          {
            name: userUpdateInput.name,
            about: userUpdateInput.about,
            links: linkInput,
          },
          {
            headers: {
              "Content-Type": "application/json;charset=UTF-8",
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
          }
        ),
        {
          loading: "Updating...",
          success: (res) => {
            setUser({
              ...user,
              name: res.data.updatedUser.name,
              about: res.data.updatedUser.about,
              links: res.data.updatedUser.links,
            });
            return "Updated Successfully";
          },
          error: "Failed to update!!",
        }
      );
    } catch (e) {
      toast.error("Something went wrong");
    }
  };

  useEffect(() => {
  }, []);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="text-green-600 mt-2 hover:underline">
          Edit Profile
        </button>
      </DialogTrigger>
      <DialogOverlay className="bg-gray-950/5">
        <DialogContent className="sm:max-w-[425px] ">
          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                defaultValue={user.name}
                onChange={(e) =>
                  setUserUpdateInput({
                    ...userUpdateInput,
                    name: e.currentTarget.value,
                  })
                }
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="username" className="text-right">
                Email
              </Label>
              <Input
                id="username"
                defaultValue={user.email}
                disabled
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="about" className="text-right">
                About
              </Label>
              <Input
                id="about"
                defaultValue={user.about}
                onChange={(e) =>
                  setUserUpdateInput({
                    ...userUpdateInput,
                    about: e.currentTarget.value,
                  })
                }
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-1 items-center gap-4">
              <div className="ml-10 flex flex-col space-y-3">
                <Label
                  htmlFor="username"
                  className="text-right flex justify-between items-center"
                >
                  <p className="m-0.5 text-md">Links</p>
                  <button onClick={addLink}>
                    <p className="text-xl">+</p>
                  </button>
                </Label>

                <div>
                  {linkInput.map((item, i) => {
                    return (
                      <div className="mb-2 flex items-center justify-center text-center">
                        <Input
                          id={String(i)}
                          key={item.id}
                          defaultValue={item.value}
                          onChange={(e) =>
                            setLinkInput(
                              linkInput.map((itm) =>
                                itm.id === item.id
                                  ? { ...itm, value: e.currentTarget.value }
                                  : itm
                              )
                            )
                          }
                          type="text"
                          placeholder="Enter link here"
                        />
                        <button onClick={() => removeLink(item.id)}>
                          <p className="pl-1 pb-1 text-4xl">-</p>
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="submit" onClick={handleSaveChanges}>
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </DialogOverlay>
    </Dialog>
  );
}
