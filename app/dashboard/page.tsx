
import DashBoardCard from "../components/dashBoardCard"
import db from "@/app/db"
import { getServerSession } from "next-auth"
import { authConfig } from "../lib/auth"

async function getUserWallet(){
   const session = await getServerSession(authConfig)
   const userWallet= await db.solWallet.findFirst({
      where:{
         userId : session?.user.uid
      }
   })
   if(!userWallet){
      return{
         error : "No Solana Wallet found associated to the user"
      }
   }
   return {error:null,userWallet}
}

export default async function Dashboard(){
   const userWallet = await getUserWallet()
   if(userWallet.error || !userWallet.userWallet?.publicKey){
      return <div>
         No Solana Wallet Found
      </div>
   }
   return (
      <div >
         <DashBoardCard publicKey={userWallet.userWallet?.publicKey}></DashBoardCard>
      </div>
   )
};