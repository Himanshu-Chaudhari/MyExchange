"use client"
import { signIn, signOut, useSession } from "next-auth/react"
import {PrimaryButton} from "./button";
import { useRouter } from "next/navigation";

export default function Navbar() {
    const session=useSession();
    const router=useRouter();
  return (
    <div className="p-1 mb-3  flex justify-between shadow-md">
        <div onClick={()=>{router.push('/')}} className="cursor-pointer p-2 pb-0 font-extrabold text-3xl">
            MyExchange
        </div>
        <div className="p-2 pb-0">
            {session.data?.user ? <PrimaryButton onClick={signOut}>signOut</PrimaryButton>:<PrimaryButton onClick={()=>signIn("identity-server4", { prompt: "login" })}>signIn</PrimaryButton>}
        </div>
    </div>
  )
}
