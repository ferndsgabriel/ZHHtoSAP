import "./index.css";
import { memo } from "react";


interface inputsProps extends React.InputHTMLAttributes<HTMLInputElement> {
    name:string;
}
function Input({name, ...rest}:inputsProps){
    return(
        <div id="inputContainer">
            <label htmlFor="inputComponent" id="inputLabel">{name}</label>
            <input id="inputComponent" {...rest}/>
        </div>
    )
}

export default memo(Input);