import AppBar from "@/components/appbar";
import ProfileLeft from "@/components/profile-left";
import ProfileRight from "@/components/profile-right";

const Profile = () => {
  return (
    <>
    <AppBar />
    <div className="flex w-full min-h-screen px-10 py-5 gap-10">
      
      <div className="flex-1">
        <ProfileLeft />
      </div> 
      <div className="w-full md:w-1/4">
        <ProfileRight />
      </div>
    </div>

    </>
  );
};

export default Profile;