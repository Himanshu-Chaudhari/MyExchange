"use client"

import { signIn, useSession } from "next-auth/react";
import { SecondaryButton } from "./button";
import { useRouter } from "next/navigation";

export default function MainCenter() {
  const session = useSession()
  const router=useRouter()
  return (
    <div className="pt-4 items-center flex-col ">
      <div className="text-5xl text-bold flex font-medium justify-center">
        <span>
          The Indian Crypto Exchange
        </span >
        <span className="text-blue-500 ml-4">
          Revolution
        </span>
      </div>
      <br/>
      <div className="flex text-center text-xl text-gray-500 justify-center">
        Create frictionless wallet from India with just a Google Account.<br/>
        Get and manage your Crypto wallet
      </div>
      <br></br>
      <div className="flex justify-center">{
          session.data?.user? <SecondaryButton onClick={()=>router.push('/dashboard')}>Move to dashboard</SecondaryButton> : <SecondaryButton onClick={()=>signIn("identity-server4", { prompt: "login" })}>Login With Google</SecondaryButton>      
        }
      </div>
    </div>
  )
}
