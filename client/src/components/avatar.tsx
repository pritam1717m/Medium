interface AvatarProp {
  label : string;
  className? : string;
}

function Avatar({label, className} : AvatarProp) {
  return (
    <div className={`flex items-center justify-center rounded-full bg-slate-950 text-white font-[gt-super] dark:bg-orange-200 dark:text-black text-2xl text-center font-bold ${className} w-9 h-9`}>
        {label.slice(0,1)}
    </div>
  )
}

export default Avatar