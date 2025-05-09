import React from 'react'
import {Button} from 'flowbite-react'
import { Link } from "react-router-dom";

function CallToAction() {
  return (
    <div className='flex flex-col sm:flex-row p-4 pl-10 border border-teal-500 justify-center
    items-center rounded-tl-3xl rounded-br-3xl text-center'>
      <div className='flex-1 justify-center flex flex-col'>
        <h2 className='text-2xl font-bold'>
            Want to travel around Sri Lanka?
        </h2>
        <p className='text-gray-500 my-2'>
            Book your next trip with us!
        </p>
        <Button gradientDuoTone='purpleToPink' className='rounded-tl-xl rounded-bl-none'><Link to={`/tours`}>Click here to check</Link></Button>
      </div>
      <div className='p-10 flex-1'>
        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRGaRlspZEe9-17r5WfEkI53L12oE0WIDHIxQ&s"  />
      </div>
    </div>
  )
}

export default CallToAction
