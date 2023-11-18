import { ethers } from "ethers";
import { Address, ABI } from "../contract/contract";
import fetchABI from "./getchAbi";

const approveNFT = async (provider, nftAddress, tokenId, contractAddress) => {
  const signer = provider.getSigner();
  const approveABI = [
    {
      "constant": false,
      "inputs": [
        {
          "name": "to",
          "type": "address"
        },
        {
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "approve",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ];

  const nftContract = new ethers.Contract(nftAddress, approveABI, signer);
  console.log("Contract Instance created")
  await nftContract.approve(contractAddress, tokenId);
  console.log("Approved the address")
};


const depositFromAcc2 = async (provider, sessionURL, nftAddress, tokenId) => {
  // First approve the contract to transfer NFT
  await approveNFT(provider, nftAddress, tokenId, Address);

  const signer = provider.getSigner();
  const bytes32SessionId = ethers.utils.solidityKeccak256(["string"], [sessionURL]);
  console.log(bytes32SessionId);
  const contract = new ethers.Contract(Address, ABI, signer);

  const transaction = await contract.depositUser2NFT(bytes32SessionId, nftAddress, tokenId,{gasLimit : 200000});
  await transaction.wait();
  console.log("NFT deposited by User 2");
};

// Similar changes for depositFromAcc1 and completeSwap...
const depositFromAcc1 = async (sessionId, provider, nftAddress, tokenId) => {
  try {
    console.log("nftAddress",nftAddress);
    // First approve the contract to transfer NFT
    await approveNFT(provider, nftAddress, tokenId, Address);

    const signer = provider.getSigner();
    const bytes32SessionId = ethers.utils.solidityKeccak256(["string"], [sessionId]);
    console.log(bytes32SessionId);
    const contract = new ethers.Contract(Address, ABI, signer);

    const transaction = await contract.depositUser1NFT(bytes32SessionId, nftAddress , tokenId ,{gasLimit : 200000});
    await transaction.wait();
    console.log("NFT deposited by User 1");
  } catch (error) {
    console.error("Error depositing NFT:", error.message);
  }
};
const completeSwap = async (provider , sessionURL) => {

  const signer = provider.getSigner();
  const contract = new ethers.Contract(Address, ABI, signer);

  const transaction = await contract.completeSwap(sessionURL);

};

module.exports = {
  depositFromAcc1,
  depositFromAcc2,
  completeSwap,
};
