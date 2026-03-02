import React from 'react'

interface AdBannerProps {
    AdBackgroundImage: string,
}

const AdBanner: React.FC<AdBannerProps>= (props) => {
  return (
    <div className='p-3'>
        <div className='h-30 rounded-xl bg-cyan-200'>
        <img src={props.AdBackgroundImage} alt="" />
    </div>
    </div>
  )
}

export default AdBanner