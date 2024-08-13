
import { TokenDetails } from "@/app/lib/tokens";
import axios from "axios";
import { useEffect, useState } from "react";

export interface TokenWithBalance extends TokenDetails{
    balance : string
    usdBalance : string
}
export function useTokens(address : string){
    const [tokenBalances , setTokenBalances] = useState<{ totalBalance : number , tokens : TokenWithBalance[] }| null>(null)
    const [loading,setLoading]=useState(false)

    useEffect(()=>{
        axios.get(`/api/token?address=${address}`).then((response)=>{
            setTokenBalances(response.data)
            setLoading(false)
        })
        
    },[])
    return{
        loading, tokenBalances
    }
}