import React from "react";

const StartButton: React.FC =()=>{
    const handleClick= ()=>{
        window.open('https://www.linkedin.com');
    };
    return(
        <button onClick={handleClick} className="text-center mt-2 p-2 text-white bg-faint_blue rounded">Visit LinkedIn</button>
    );
}
export default StartButton;