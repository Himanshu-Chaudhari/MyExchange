import { TokenWithBalance } from "../api/hooks/useTokens";

export default function TokenList({tokens}:{
    tokens : TokenWithBalance[] | undefined
}){
    if(tokens==undefined){
        return <div></div>
    }
    return <div className="">
        {tokens.map(t => <TokenRow token={t} /> )}
    </div>
}

function TokenRow({token}:{token : TokenWithBalance}){
    return <div className="pt-3 pb-4 pr-3 flex justify-between rounded-lg shadow-sm ">
        <div className=" flex p1 ">
                <img src={token.image} alt={token.name.at(0)} className="w-20 aspect-[3/2] object-contain mix-blend-color-burn" />
                <div>
                    <span>{token.name}</span><br />
                    <span className="text-sm text-slate-400"> 1 {token.name} = &#36; {Number(token.price).toFixed(2)}</span>
                </div>
        </div>
        <div>
            <div className="text-end">
                <span>&#36;{Number(token.usdBalance).toFixed(2)}</span><br></br>
                <span className="ext-sm text-slate-400">{Number(token.balance).toFixed(2)}  </span>
            </div>
        </div>
    </div>
}

// https://websitedemos.net/web-developer-portfolio-04/



