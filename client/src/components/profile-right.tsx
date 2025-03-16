import { useAtomValue } from "jotai";
import { userAtom } from "@/store/atom/user";
import EditProfile from "./edit-profile";
import Link from "./link";
interface Link {
  id : number,
  value : string
}

type Links = Array<Link>

export default function ProfileRight() {
  const user = useAtomValue(userAtom);

  return (
    <div className="w-full py-20 px-10 border-l flex flex-col">
      <div className="space-y-3">
        <img
          src="/profile.jpg"
          alt="Profile Picture"
          className="w-24 h-24 rounded-full"
        />
        <h2 className="text-lg font-semibold">{user.name}</h2>
        <EditProfile />
        <Link links={user?.links as Links}/>
      </div>
    </div>
  );
}
