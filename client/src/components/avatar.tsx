
function Avatar({label} : {label : string}) {
  return (
    <div className="w-7 h-7 rounded-full bg-slate-950 text-white font-[gt-super] dark:bg-orange-200 dark:text-black text-2xl text-center font-bold">
        {label.slice(0,1)}
    </div>
  )
}

export default Avatar