import React from 'react'

interface ButtonProps {
    label:string;
    bgcolor:string;
    textColor:string;
}

const Button: React.FC<ButtonProps> = (props) => {
  return (
    <div className='w-full flex justify-center items-center'>
        <button className={`w-75 h-12 text-${props.textColor} rounded-full border-accent-01 border-2 font-semibold bg-${props.bgcolor} flex justify-center items-center`}>
           <h1>{props.label}</h1>
        </button>
    </div>
  )
}

export default Button