import { ArrowLeft } from 'lucide-react'
import React from 'react'
import { useNavigate } from 'react-router-dom'

interface PageHeaderProps {
  label:string,
  to:string,
}

const PageHeader: React.FC<PageHeaderProps> = (props) => {
  const navigate = useNavigate();
  return (
    <div>
       <div className="flex gap-2 h-16 items-center w-full">
                <ArrowLeft onClick={()=>navigate(props.to)
       } />
                <h1 className="font-semibold text-xl text-[#444444]">{props.label}</h1>
            </div>
    </div>
  )
}

export default PageHeader