import { headers } from 'next/headers';
import { JsonRpcProvider, ethers } from 'ethers';
import fs from 'fs';
import contractJson from "../../../contract.json";

const message = "OnlyContent";

export async function GET(request, { params }) {
  try {
    console.log("Request received for posts");

    // Reading posts from JSON file
    let posts = fs.readFileSync("./src/app/posts.json", "utf8");
    posts = JSON.parse(posts);
    
    // Log posts before filtering
    console.log("Posts data before filtering:", posts);

    // Extracting headers
    const headersList = headers();
    const user = headersList.get("OC_CRYPTO_USER");
    const signature = headersList.get("OC_CRYPTO_SIG");

    console.log("Headers:", headersList);
    console.log("User:", user);
    console.log("Signature:", signature);

    // Recovering address
    const recoveredAddress = ethers.verifyMessage(message, signature);
    console.log("Recovered Address:", recoveredAddress);

    // Check membership
    const provider = new ethers.JsonRpcProvider("http://localhost:8545");
    const contract = new ethers.Contract(contractJson.address, contractJson.abi, provider);
    const isPaidMember = await contract.members(params.address, user);
    console.log("Is Paid Member:", isPaidMember);

    if (isPaidMember) {
      // Filtering posts based on the creator's address
      const filteredPosts = posts.data.filter(post => post.author === params.address);
      console.log("Filtered posts:", filteredPosts);
      return new Response(JSON.stringify({ data: filteredPosts }), { status: 200 });
    } else {
      return new Response(JSON.stringify({ data: [] }), { status: 200 });
    }
  } catch (error) {
    console.error("Error in GET /api/posts:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
}
