const fs= require('fs');
import { headers } from 'next/headers';
import { ethers } from 'ethers';

const message= "Only Content";  

export async function POST(req){

    const headersList= headers();
    const user= headersList.get("OC_CRYPTO_USER");
    const signature= headersList.get("OC_CRYPTO_SIG");
    const recoveredAddress= ethers.verifyMessage(message, signature);

    if(recoveredAddress!==user){
        return Response.json(
            {status: 401}
        );
    }
    let creators= fs.readFileSync("./src/app/creators.json", "utf8");
    creators= JSON.parse(creators);
    const body= await req.json();
    creators[user].description= body.description;
    fs.writeFileSync("./src/app/creators.json", JSON.stringify(creators), "utf8");
    return Response.json(
        {status:201}
    );
}
