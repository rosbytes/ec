import { ArrowLeft } from 'lucide-react'
import React from 'react'

interface PageHeaderProps {
  label:string;
}

const PageHeader: React.FC<PageHeaderProps> = (props) => {
  return (
    <div>
       <div className="flex gap-2 h-16 items-center w-full">
                <ArrowLeft />
                <h1 className="font-semibold text-xl text-[#444444]">{props.label}</h1>
            </div>
    </div>
  )
}

export default PageHeader