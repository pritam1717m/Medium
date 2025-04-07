import { useAtomValue } from "jotai";
import { userAtom } from "@/store/atom/user";
import EditProfile from "./edit-profile";
import Link from "./link";
import ProfileFollowings from "./profile-followings";
import Avatar from "./avatar";
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
        <Avatar label={user.name} className="w-20 h-20 text-5xl"/>
        <h2 className="text-lg font-semibold">{user.name}</h2>
        <h3 className="text-slate-800 dark:text-slate-400">{user.about? user.about : ""}</h3>
        <h3 className="text-slate-800 dark:text-slate-400">{user.followers?.length} Followers</h3>
        <EditProfile />
        <Link links={user?.links as Links}/>
        <ProfileFollowings />
      </div>
    </div>
  );
}
