"use client";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import contractJson from "../../contract.json";

const message = "Only Content";

const getCreator = async (address) => {
  let res = await fetch(`/api/creators/${address}`, {
    headers: {
      Accept: "application/json",
    },
  });
  res = await res.json();
  console.log(res);
  console.log(res.creator);
  return res.creator;
};

const getPrivatePosts = async (creator, user, signature) => {
  try {
    console.log(`Fetching private posts for creator: ${creator}`);
    const res = await fetch(`/api/posts/${creator}`, {
      headers: {
        Accept: "application/json",
        OC_CRYPTO_SIG: signature,
        OC_CRYPTO_USER: user
      },
    });

    console.log("Fetch response:", res);

    if (res.ok) {
      const data = await res.json();
      console.log("Fetched private posts:", data);
      return data;
    } else {
      console.error("Failed to fetch private posts:", res.status, res.statusText);
      return null;
    }
  } catch (error) {
    console.error("Error fetching private posts:", error);
    return null;
  }
}


export default function Creator({ params }) {
  const [creator, setCreator] = useState(undefined);
  const [signature, setSignature] = useState(undefined);
  const [signer, setSigner] = useState(undefined);
  const [isPaidMember, setIsPaidMember] = useState(undefined);
  const [feedback, setFeedback] = useState(undefined);
  const [privatePosts, setPrivatePosts] = useState(undefined);

  useEffect(() => {
    const init = async () => {
      const creator = await getCreator(params.address);
      setCreator(creator);
    };
    init();
  }, []);

  useEffect(() => {
    const init = async () => {
      if (signature && isPaidMember && creator) {
        const privatePosts = await getPrivatePosts(creator.address, signer.address, signature);
        console.log("Private posts:", privatePosts);
        setPrivatePosts(privatePosts ? privatePosts.data : []);
      }
    };
    init();
  }, [signature, isPaidMember, creator]);
  
    

  const connect = async () => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    setSigner(signer);
    const signature = await signer.signMessage(message);
    setSignature(signature);
    const contract = new ethers.Contract(contractJson.address, contractJson.abi, signer);
    const res = await contract.members(creator.address, signer.address);
    setIsPaidMember(res);
  }

  const join = async () => {
    setFeedback("Transfer Pending...");
    const contract = new ethers.Contract(contractJson.address, contractJson.abi, signer);
    try {
      const tx = await contract.join(creator.address, { value: ethers.parseEther("0.1") });
      const receipt = await tx.wait();
      setFeedback("Payment Complete! Reload to see private posts");
    } catch (error) {
      console.error("Payment error:", error);
      setFeedback("The payment failed.... Please try again later!");
    }
  }

  return (
    <main className="container text-center">
      <div className="row">
        <div className="main-col col d-flex flex-column justify-content-center">
          <div id="header">
            <h1>Only Content 🌚</h1>
            <p>Pay for 'exclusive' content from your favorite creators</p>
          </div>
        </div>
        {creator ? (
          <ul className="list-group">
            <li className="list-group-item">Address: {creator.address}</li>
            <li className="list-group-item">Name: {creator.name}</li>
            <li className="list-group-item">Bio: {creator.description}</li>
          </ul>
        ) : null}
        {signature ? null : (
          <button type='submit' className="btn btn-primary mt-4" onClick={connect}>Connect</button>
        )}
        {signature && !isPaidMember ? (
          <div>
            <h2 className="m-4"> Become a Paid Member to unlock 'exclusive' content</h2>
            <p>With just a one time payment of 0.1 ETH, you will have lifetime access to creator's content</p>
            <button type='submit' className="btn btn-primary mt-4" onClick={join}>Join</button>
          </div>
        ) : null}

        {feedback ? (
          <div className="alert alert-primary mt-4">{feedback}</div>
        ) : null}

        {privatePosts ? (
          <div>
            <h2 className="m-2">Private Posts</h2>
            <ul className="list-group">
              {privatePosts.map(post => (
                <li className="list-group-item" key={post.id}>{post.content}</li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </main>
  );
}
