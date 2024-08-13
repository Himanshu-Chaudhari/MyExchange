"use client"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Greetings from "./greetings"
import { PrimaryButton, SecondaryButton, TertiaryButton } from "./button"
import { useEffect, useState } from "react"
import { useTokens } from "../api/hooks/useTokens"
import TokenList from "./tokenList"
import Swap from "./swap"

export default function DashBoardCard({ publicKey }: {
    publicKey: string
}) {
    const session = useSession()
    const router = useRouter()

    if (session.status == 'loading') {
        return <div className="pt-8 flex justify-center">
            <div className="max-w-3xl w-full p-8 rounded shadow animate-pulse ">
                <div className="h-20 w-20 bg-gray-200 rounded-full"></div>
                <div className="h-5 w-32 bg-gray-200 rounded mt-3"></div>
            </div>
        </div>
    }
    console.log(session?.data)
    if (!session.data?.user) {
        router.push('/')
        return null
    }else{
        console.log(session.data.user)
    }

    return (
        <div className="pt-8 flex justify-center">
            <div className="max-w-3xl w-full p-8 rounded-lg shadow-lg">
                <Greetings image={session.data?.user?.image ?? ""} name={session.data?.user?.name ?? ""} ></Greetings>
                <Assets publicKey={publicKey} ></Assets>
            </div>

        </div>
    )
}

function Assets({ publicKey }: {
    publicKey: string
}) {
    const [selectedTab, setSelectedTab] = useState("tokens")
    const [copied, setCopied] = useState(false)
    const { tokenBalances, loading } = useTokens(publicKey)
    useEffect(() => {
        if (copied) {
            let timeout = setTimeout(() => {
                setCopied(false)
            }, 3000)
            return () => {
                clearTimeout(timeout)
            }
        }
    }, [copied])

    if (loading) {
        return <>
            Loading...
        </>
    }

    return <div>

        <div className="rounded-xl shadow-sm p-3 mb-8">
            <div className="text-slate-500 mt-4 ">
                Account Assets
            </div>
            <div className=" flex justify-between ">
                <div className="mt-2 text-4xl font-bold">
                    &#36; {tokenBalances?.totalBalance} <span className="text-3xl text-slate-600">USD</span>
                </div>
                <div>
                    <PrimaryButton onClick={() => {
                        setCopied(true)
                        navigator.clipboard.writeText(publicKey)
                    }}>{copied ? "Copied" : "Your Wallet Address"} </PrimaryButton>
                </div>
            </div>
            <div className="mt-4 p-1 w-full flex justify-between">
                <TertiaryButton onClick={() => {
                    setSelectedTab('tokens')
                    navigator.clipboard.writeText(publicKey)
                }}>My Wallet</TertiaryButton>
                <TertiaryButton onClick={() => {
                    setSelectedTab('send')
                    navigator.clipboard.writeText(publicKey)
                }}>Send</TertiaryButton>
                <TertiaryButton onClick={() => {
                    setSelectedTab('addFunds')
                    navigator.clipboard.writeText(publicKey)
                }}>Add Funds</TertiaryButton>
                <TertiaryButton onClick={() => {
                    setSelectedTab('withdraw')
                    navigator.clipboard.writeText(publicKey)
                }}>Withdraw</TertiaryButton>
                <TertiaryButton onClick={() => {
                    setSelectedTab('swap')
                    navigator.clipboard.writeText(publicKey)
                }}>Swap</TertiaryButton>
            </div>
        </div>
        <div className={`${selectedTab == 'tokens' ? 'visible' : 'hidden'}`}>
            {
                tokenBalances == null ? <div> Loading...</div> : <div><div className="p-3 font-bold">Tokens
                </div><hr /> <TokenList tokens={tokenBalances?.tokens}></TokenList></div>
            }
        </div>
        <div className={`${selectedTab === 'withdraw' ? 'visible' : 'hidden'}`}>
            <div className="p-3 font-semibold text-center">
                The Withdraw Funds Service is currently unavailable in India due to regulatory restrictions. We are awaiting further guidance from the Government of India.
            </div>
        </div>

        <div className={`${selectedTab === 'addFunds' ? 'visible' : 'hidden'}`}>
            <div className="p-3 font-semibold text-center">
                Purchasing cryptocurrency using INR is currently restricted on our platform in India due to regulatory conditions. We are monitoring the situation and will update you as soon as the service becomes available.
            </div>
        </div>

        <div className={`${selectedTab === 'send' ? 'visible' : 'hidden'}`}>
            <div className="p-3 font-semibold text-center">
                The Send Funds Service is not available on our platform in India at this time due to regulatory restrictions. Please stay tuned for updates.
            </div>
        </div>

        <div className={`${selectedTab == 'swap' ? 'visible' : 'hidden'}`}>
            <Swap tokenBalances={tokenBalances}  loading = {loading}></Swap>
        </div>

    </div>
}
