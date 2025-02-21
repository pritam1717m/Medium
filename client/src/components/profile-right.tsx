import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ProfileRight() {
  const [name, setName] = useState("Priya");
  const [username, setUsername] = useState("@priya");
  const [about, setAbout] = useState("Something is there");

  const handleSaveChanges = () => {
    console.log("Saving profile changes:", { name, username });
  };

  return (
    <div className="w-full p-5 border-l flex flex-col items-center">
      <img
        src="/profile.jpg"
        alt="Profile Picture"
        className="w-24 h-24 rounded-full"
      />
      <h2 className="text-lg font-semibold mt-3">{name}</h2>

      <Dialog>
        <DialogTrigger asChild>
          <button className="text-green-600 mt-2 hover:underline">
            Edit profile
          </button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-[425px]">
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
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="username" className="text-right">
                Username
              </Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="about" className="text-right">
                About
              </Label>
              <Input
                id="about"
                value={about}
                onChange={(e) => setAbout(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>

          <DialogFooter>
            {/* Handle Save */}
            <Button type="submit" onClick={handleSaveChanges}>
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
