import { ReactElement } from "react";

type props = {
  classname?: string;
  children: string | ReactElement;
  onClick?: VoidFunction;
};

function Button(props: props) {
  return <button className={`${props.classname} px-4 py-1.5 bg-slate-900 text-center text-white border rounded-full font-[HostGrotesk]`} onClick={props.onClick}>{props.children}</button>;
}

export default Button;
