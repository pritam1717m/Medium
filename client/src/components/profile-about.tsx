import { useAtomValue } from "jotai";
import Link from "./link";
import { userAtom } from "@/store/atom/user";

interface Link {
  id : number,
  value : string
}

type Links = Array<Link>

export default function ProfileAbout() {
    const user = useAtomValue(userAtom);
  return (
    <div className="flex flex-col space-y-2">
      <h3 className="my-5 text-lg font-semibold text-slate-800 dark:text-slate-200">
        Designation : {user.about ? user.about : ""}
      </h3>
      <p className="text-lg my-2">Links: </p>
      <Link links={user?.links as Links} />
    </div>
  );
}
