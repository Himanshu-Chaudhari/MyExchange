"use client"
import { ReactNode, useEffect, useState } from "react"
import { SUPPORTED_TOKENS, TokenDetails } from "../lib/tokens";
import { TokenWithBalance } from "../api/hooks/useTokens";
import { PrimaryButton } from "./button";
import axios from "axios";

export default function Swap({ tokenBalances, loading }: {
    tokenBalances: {
        totalBalance: number,
        tokens: TokenWithBalance[]
    } | null;
    loading: boolean
}) {
    const [baseAsset, setBaseAsset] = useState(SUPPORTED_TOKENS[0]);
    const [quoteAsset, setQuoteAsset] = useState(SUPPORTED_TOKENS[1]);
    const [baseAmount, setBaseAmount] = useState<number>();
    const [quoteAmount, setQuoteAmount] = useState<number>();
    const [amount , setAmount]= useState<number>();
    useEffect(()=>{
        if (!baseAmount) {
            return;
        }
        if(baseAmount==0){
            setQuoteAmount(0);
            return;
        }
        try {
            const response =  axios.get(
                `https://quote-api.jup.ag/v6/quote?inputMint=${baseAsset.mint}&outputMint=${quoteAsset.mint}&amount=${Number(baseAmount) * (10 ** baseAsset.decimals)}&slippageBps=50`
            ).then((res)=>{
                console.log(res.data)
                setQuoteAmount(res.data.outAmount/ (10 **quoteAsset.decimals ))
            });
        } catch (error) {
            console.error("Error fetching quote:", error);
        }
        
    },[baseAsset , quoteAsset , baseAmount])
    return (
        <div className="">
            <SwapInputRows
                inputDisabled={false}
                amount={baseAmount} 
                setAmount={(amount)=>{setBaseAmount(amount)}} onSelect={(asset) => {
                    setBaseAsset(asset)
                }} 
                selectedToken={baseAsset} 
                title={'You Pay'} 
                subtitle={
                    <div className="text-slate-500 pt-1 text-sm pl-1 flex">
                    <div className="font-normal pr-1">
                        Current Balance:
                    </div>
                    <div className="font-semibold">
                        {tokenBalances?.tokens.find(x => x.name === baseAsset.name)?.balance} {baseAsset.name}
                    </div>
                    </div>
                }
            ></SwapInputRows>
            <div className="flex justify-center">
                <div className="cursor-pointer rounded-full w-12 h-12 border absolute my-[-25px] bg-white" onClick={() => {
                    let temp = quoteAsset;
                    setQuoteAsset(baseAsset);
                    setBaseAsset(temp);
                }}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6 ml-3 mt-3 ">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M3 7.5 7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5" />
                    </svg>
                </div>
            </div>
            <SwapInputRows 
                amount={quoteAmount} 
                inputDisabled={true}
                setAmount={(amount:number)=>setQuoteAmount(amount)} 
                onSelect={(asset) => {
                    setQuoteAsset(asset)
                }} 
                selectedToken={quoteAsset} 
                title={'You Get'} 
                subtitle={<></>}
            ></SwapInputRows>
    <div className="flex justify-end p-2">
            <PrimaryButton onClick={async ()=>{
                    
            } }>Swap</PrimaryButton>
            </div>
        </div>
    )
}

function SwapInputRows({ amount , setAmount , onSelect, selectedToken, title, subtitle, inputDisabled }: {
    amount : number | undefined ,
    setAmount : (amount:number) => void
    onSelect: (asset: TokenDetails) => void
    selectedToken: TokenDetails
    title: string
    inputDisabled : boolean
    subtitle: ReactNode
}) {
    return (
        <div className="flex justify-between p-3 m-1 border border-slate-100 rounded-md ">
            <div >
                <div className="p-2">
                    {title}
                </div>
                <AssetsSelector selectedToken={selectedToken} onSelect={onSelect}></AssetsSelector>
                {subtitle}
            </div>
            <div>
                <input disabled={inputDisabled} onChange={(e)=>setAmount(Number(e.target.value))} type="number" step={0.001} className="w-44 border-2 border-gray-50 text-right p-2 font-semibold text-2xl" placeholder={`${(amount==undefined||amount==0)?"0":amount.toFixed(3)}`} />
            </div>
        </div>
    )
}

function AssetsSelector({ selectedToken, onSelect } : {
    selectedToken: TokenDetails,
    onSelect: (asset: TokenDetails) => void
}) {
    return (
        <div>
            <div className="max-w-sm mx-auto">
                <select onChange={(e) => {
                    const selected = SUPPORTED_TOKENS.find(x => x.name === e.target.value)
                    if (selected) {
                        onSelect(selected)
                    }
                }} id="countries" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-24 p-2.5">7
                    {SUPPORTED_TOKENS.map(token => <option key={token.name} selected={selectedToken.name == token.name}>{token.name}</option>)}
                </select>
            </div>
        </div>
    )
}