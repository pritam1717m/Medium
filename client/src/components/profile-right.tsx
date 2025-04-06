import { useAtomValue } from "jotai";
import { userAtom } from "@/store/atom/user";
import EditProfile from "./edit-profile";
import Link from "./link";
import Followings from "./followings";
interface Link {
  id : number,
  value : string
}

type Links = Array<Link>

interface Following {
  follower: {
    id: string;
    name: string;
  };
}
type Followings = Array<Following>

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
        <h3 className="text-slate-800 dark:text-slate-400">{user.about? user.about : ""}</h3>
        <h3 className="text-slate-800 dark:text-slate-400">{user.followers?.length} Followers</h3>
        <EditProfile />
        <Link links={user?.links as Links}/>
        <Followings followings={user.following as Followings}/>
      </div>
    </div>
  );
}
