import "./index.css";
import { memo } from "react"

interface ButtonsProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode
}

function Button ({children, ...rest}: ButtonsProps) {
    return(
        <button {...rest} id="ButtonContainer">
            {children}
        </button>
    )
}

export default memo(Button);