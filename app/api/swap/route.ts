// 'use server'
// import db from "@/app/db";
// import { authConfig } from "@/app/lib/auth";
// import { connection } from "@/app/lib/constants";
// import { Keypair, VersionedTransaction } from "@solana/web3.js";
// import { getServerSession } from "next-auth";
// import FusionAuth from "next-auth/providers/fusionauth";
// import { NextRequest, NextResponse } from "next/server";

// export async function POST( req : NextRequest ){
//     console.log("Reached")
//     const session = await getServerSession(authConfig);

//     if(!session){
//         return NextResponse.json({
//             message : " Your are not logged in "
//         } , {
//             status : 401
//         })
//     }

//     const solWallet = await db.solWallet.findFirst({
//         where : {
//             userId : session.user.uid
//         }
//     })

//     if(!solWallet){
//         return NextResponse.json({
//             message : " Couldn't find associated wallet "
//         } , {
//             status : 401
//         })
//     }

//     const data : {
//         quoteResponse : any 
//     } = await req.json()
//     // get serialized transactions for the swap
//     const { swapTransaction } = await (
//         await fetch('https://quote-api.jup.ag/v6/swap', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({
//             // quoteResponse from /quote api
//             quoteResponse : data.quoteResponse,
//             // user public key to be used for the swap
//             userPublicKey: solWallet.publicKey.toString(),
//             // auto wrap and unwrap SOL. default is true
//             wrapAndUnwrapSol: true,
//             // feeAccount is optional. Use if you want to charge a fee.  feeBps must have been passed in /quote API.
//             // feeAccount: "fee_account_public_key"
//         })
//         })
//     ).json();

//     // deserialize the transaction
//     const swapTransactionBuf = Buffer.from(swapTransaction, 'base64');
//     var transaction = VersionedTransaction.deserialize(swapTransactionBuf);
//     console.log(transaction);

//     const privateKey = generatePrivateKey(solWallet.privateKey)
//     // sign the transaction
//     transaction.sign([privateKey]);

//     // get the latest block hash
//     const latestBlockHash = await connection.getLatestBlockhash();

//     // Execute the transaction
//     const rawTransaction = transaction.serialize()

//     const txid = await connection.sendRawTransaction(rawTransaction, {
//         skipPreflight: true,
//         maxRetries: 2
//     });

//     await connection.confirmTransaction({
//         blockhash: latestBlockHash.blockhash,
//         lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
//         signature: txid
//     });

//     console.log(`https://solscan.io/tx/${txid}`);

//     return NextResponse.json({
//         txid
//     })
// }

// function generatePrivateKey( privateKey : string){
//     const arr = privateKey.split(',').map(x => Number(x))
//     const privateKeyUnitArray = Uint8Array.from(arr)
//     const keypair = Keypair.fromSecretKey(privateKeyUnitArray)
//     console.log("--------------- This is private key ----------------" , keypair)
//     return keypair
// }

import { authConfig } from "@/app/lib/auth";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import db from "@/app/db";
import { Connection, Keypair, VersionedTransaction } from "@solana/web3.js";

export async function POST(req: NextRequest) {
    const connection = new Connection("https://mainnet.helius-rpc.com/?api-key=5935eb6e-9c4e-4031-b4b6-f1290106d2d6")
    const data: {
        quoteResponse: any
    } = await req.json();

    const session = await getServerSession(authConfig);
    console.log(session)
    if (!session?.user) {
        return NextResponse.json({
            message: "You are not logged in"
        }, {
            status: 401
        })
    }

    const solWallet = await db.solWallet.findFirst({
        where: {
            userId: session.user.uid
        }
    })

    if (!solWallet) {
        return NextResponse.json({
            message: "Couldnt find associated solana wallet"
        }, {
            status: 401
        })
    }

    const { swapTransaction } = await (
        await fetch('https://quote-api.jup.ag/v6/swap', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            // quoteResponse from /quote api
            quoteResponse: data.quoteResponse,
            // user public key to be used for the swap
            userPublicKey: solWallet.publicKey,
            // auto wrap and unwrap SOL. default is true
            wrapAndUnwrapSol: true,
            // feeAccount is optional. Use if you want to charge a fee.  feeBps must have been passed in /quote API.
            // feeAccount: "fee_account_public_key"
          })
        })
      ).json();

      console.log("Jup returned txn")

      const swapTransactionBuf = Buffer.from(swapTransaction, 'base64');
      var transaction = VersionedTransaction.deserialize(swapTransactionBuf);
      const privateKey = getPrivateKeyFromDb(solWallet.privateKey)
      transaction.sign([privateKey]);
      const latestBlockHash = await connection.getLatestBlockhash();

      // Execute the transaction
      const rawTransaction = transaction.serialize()
      const txid = await connection.sendRawTransaction(rawTransaction, {
          skipPreflight: true,
          maxRetries: 2
      });
      await connection.confirmTransaction({
        blockhash: latestBlockHash.blockhash,
        lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
        signature: txid
      });

      return NextResponse.json({
        txid
    })
}

function getPrivateKeyFromDb(privateKey: string) {
    const arr = privateKey.split(",").map(x => Number(x));
    const privateKeyUintArr = Uint8Array.from(arr);
    const keypair = Keypair.fromSecretKey(privateKeyUintArr);
    return keypair;
}