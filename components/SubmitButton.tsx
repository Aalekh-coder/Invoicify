"use client"

import { LoaderCircle } from 'lucide-react';
import { Button } from './ui/button'
import { useFormStatus} from 'react-dom'

const SubmitButton = () => {
  const { pending } = useFormStatus();

  return (
    <Button className="w-full font-semibold relative">
      <span className={pending ? 'text-transparent' : ""}>Submit</span>
      {pending && (
        <span className='flex items-center justify-center w-full h-full absolute text-gray-400'>
          <LoaderCircle className='animate-spin'/>
        </span>
      )}
    </Button>
  )
}

export default SubmitButton