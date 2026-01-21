import React, {use, useEffect, useState} from 'react'
import logo from '../assets/logo.svg'
import Button from '../components/ui/Button';
import tomato from '../assets/bg-images/tomato.svg'
import potato from '../assets/bg-images/potato.svg'
import carrot from '../assets/bg-images/carrot.svg'
import cabbage from '../assets/bg-images/cabbage.svg'



interface welcomePageProps{
    image:string;
}

const WelcomePage: React.FC<welcomePageProps> = (props) => {

    const [currentIndex, setCurrentIndex] = useState(0);

    const backgrounds = [
        tomato,
        potato,
        cabbage,
        carrot
    ]

   useEffect(()=>{
    setInterval(()=>{
        setCurrentIndex((prev)=>(prev+1)%backgrounds.length)
    }, 3000)
    return ()=>{

    }
   },[])
    



  return (
    <div className="h-dvh w-full overflow-hidden relative bg-cover " style={{ backgroundImage: `url(${backgrounds[currentIndex]})` }}>

        <div className="absolute offset-0 bg-gradient-to-b from-black/100 via-black/100 to-black/100" />


        <div className='h-30 w-full  flex justify-center items-center'>
            <img src={logo} alt="" />
        </div>
        <div className='px-6 h-30'>
            <h1 className='text-3xl font-extrabold text-start text-secondary mt-60'>
                YOUR MARKET IS <br /> CLOSER THAN YOU <br />THINK.
            </h1>
        </div>
        <div className='w-full mt-20 mb-3'>
            <Button label={"Get Started"} bgcolor={"secondary border-none"} textColor={"black"} />
        </div>
        <div className='text-center px-8'>
            <h1 className='text-text-3 text-secondary'>
                By tapping “Get Started”, you agree to our Privacy policy and Terms & conditions.
            </h1>
        </div>

    </div>
  )
}

export default WelcomePage