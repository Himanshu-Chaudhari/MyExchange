import { Connection } from "@solana/web3.js"
import axios from "axios";
import { SUPPORTED_TOKENS } from "./tokens";
import { Console } from "console";

let LAST_UPDATED : number | null = null;

let prices :{[key : string]:{
    price : string
}}={}

const TOKEN_PRICE_REFRESH_INTERVAL = 60 * 1000; // every 60 sec 

export const connection = new Connection('https://solana-mainnet.g.alchemy.com/v2/ORY6ht0auvQgGf5Oa_aHHDFo0F5sp4xW')

export async function getSupportedTokens(){
    if( !LAST_UPDATED || new Date().getTime() - LAST_UPDATED < TOKEN_PRICE_REFRESH_INTERVAL){
        try {
            // const response = await axios.get("https://price.jup.ag/v6/price?ids=SOL,USDC,USDT");
            const response = await axios.get("https://api.jup.ag/price/v2?ids=EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v,So11111111111111111111111111111111111111112,Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB")

            console.log("This is response:- ",response.data)
            prices = response.data.data;
            LAST_UPDATED = new Date().getTime();
        } catch(e) {
            console.log(e);
        }
    }
    return SUPPORTED_TOKENS.map(element=>({
        ...element,
        price : prices[element.mint].price
    }))
}
getSupportedTokens()