const fs= require("fs");

export async function GET(_, {params}){
    let creators = fs.readFileSync("./src/app/creators.json","utf8");
    creators= Object.values(JSON.parse(creators));   
    const creator= creators.find(creator => creator.address=== params.address);
    return Response.json(
        {creator},
        {status:200}
    );
}