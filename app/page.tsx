"use client";

import StatCard from "../components/StatCard";
import SearchBox from "../components/SearchBox";
import { useEffect, useState } from "react";
import { arcClient } from "../lib/arc";
import { formatEther } from "viem";

export default function Home() {
  const [wallet, setWallet] = useState("");
  const [searchedWallet, setSearchedWallet] = useState("");
const [blockNumber, setBlockNumber] = useState<number>(0);
const [txCount, setTxCount] = useState(0);
const [walletCount, setWalletCount] = useState(0);
const [transactions, setTransactions] = useState<string[]>([]);
const [balance, setBalance] = useState("");
const [txNonce, setTxNonce] = useState(0);
const [walletType, setWalletType] = useState("");
const [lastUpdated, setLastUpdated] = useState("");
const [isNewBlock, setIsNewBlock] = useState(false);
const [error, setError] = useState("");
const [recentBlocks, setRecentBlocks] = useState<{ number: number; txs: number }[]>([]);

useEffect(() => {
  async function loadNetworkStats() {
    try {

const latestBlock = await arcClient.getBlock();

setTransactions(
  latestBlock.transactions
    .slice(0, 10)
    .map((tx) => tx.toString())
);

      const latestBlockNumber = await arcClient.getBlockNumber();
const blocks = [];

for (
  let i = latestBlockNumber;
  i > latestBlockNumber - 5n;
  i--
) {
  const block = await arcClient.getBlock({
    blockNumber: i,
  });

  blocks.push({
    number: Number(i),
    txs: block.transactions.length,
  });
}

setRecentBlocks(blocks);
      console.log("Latest Block:", latestBlockNumber);

      setBlockNumber(Number(latestBlockNumber));

let totalTx = 0;
const wallets = new Set<string>();

for (
  let i = latestBlockNumber;
  i > latestBlockNumber - 50n;
  i--
) {
  const block = await arcClient.getBlock({
    blockNumber: i,
    includeTransactions: true,
  });

  totalTx += block.transactions.length;

  for (const tx of block.transactions) {
    if (typeof tx !== "string") {
      wallets.add(tx.from.toLowerCase());

      if (tx.to) {
        wallets.add(tx.to.toLowerCase());
      }
    }
  }
}

setTxCount(totalTx);
setWalletCount(wallets.size);
setLastUpdated(
  new Date().toLocaleTimeString()
);
    } catch (err) {
      console.error(err);
    }
  }

  loadNetworkStats();

  const interval = setInterval(() => {
loadNetworkStats();
  }, 2000);

  return () => clearInterval(interval);
}, []);
async function handleSearch() {
setError("");
if (!wallet.startsWith("0x") || wallet.length !== 42) {
setError("Please enter a valid Arc wallet address.");
  return;
}  
try {
    const address = wallet as `0x${string}`;

    const balanceWei = await arcClient.getBalance({
      address,
    });

    const nonce = await arcClient.getTransactionCount({
      address,
    });

    const bytecode = await arcClient.getBytecode({
      address,
    });

    setBalance(
  Number(formatEther(balanceWei)).toFixed(4)
);
    setTxNonce(Number(nonce));

    if (bytecode) {
      setWalletType("Smart Contract");
    } else {
      setWalletType("Wallet");
    }

    setSearchedWallet(wallet);
  } catch (err) {
    console.error(err);
    alert("Invalid wallet address");
  }
}

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-7xl mx-auto p-8">
<div className="mb-10">
  <h1 className="text-5xl font-bold">
    Arc Explorer
  </h1>
{isNewBlock && (
  <div className="mb-6 bg-green-500/20 border border-green-500 text-green-400 p-4 rounded-xl">
    New Block Detected 🚀
  </div>
)}
  <p className="text-slate-400 mt-2">
    Real-time Arc Testnet analytics, wallets and transactions.
  </p>

  <div className="flex gap-4 mt-4 text-sm">
    <a
      href="https://community.arc.network"
      target="_blank"
      className="text-blue-400 hover:underline"
    >
      Arc Community →
    </a>

    <a
      href="https://developers.circle.com"
      target="_blank"
      className="text-blue-400 hover:underline"
    >
      Circle Docs →
    </a>
  </div>
</div>

<div className="bg-slate-900 border border-slate-800 rounded-xl p-3 mb-6 flex flex-wrap gap-6 text-sm">
  <span className="text-green-400 font-medium">
    ● Connected
  </span>

  <span>
    Arc Testnet
  </span>

  <span>
    Chain ID: 5042002
  </span>

  <span className="text-slate-400">
    Last Updated: {lastUpdated}
  </span>
</div>

{isNewBlock && (
  <div className="mb-6 bg-green-500/10 border border-green-500/20 text-green-400 p-4 rounded-xl">
    🚀 New Block Detected
  </div>
)}

<div className="grid md:grid-cols-4 gap-6 mb-10">

  <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 hover:border-blue-500 hover:-translate-y-1 transition-all duration-300">
    <p className="text-slate-400 text-sm">
      Transactions (50 Blocks)
    </p>

    <p className="text-4xl font-bold mt-3">
      {txCount.toLocaleString()}
    </p>
  </div>

  <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 hover:border-blue-500 hover:-translate-y-1 transition-all duration-300">
    <p className="text-slate-400 text-sm">
      Active Wallets (50 Blocks)
    </p>

    <p className="text-4xl font-bold mt-3">
      {walletCount.toLocaleString()}
    </p>
  </div>

  <div className="relative bg-slate-900 p-6 rounded-2xl border border-slate-800 hover:border-green-500 hover:-translate-y-1 transition-all duration-300">

    <div className="absolute top-3 right-3">
      <span className="flex h-3 w-3">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
      </span>
    </div>

    <p className="text-slate-400 text-sm">
      Latest Block
    </p>

    <p className="text-4xl font-bold mt-3">
      {blockNumber.toLocaleString()}
    </p>
  </div>

  <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 hover:border-emerald-500 hover:-translate-y-1 transition-all duration-300">
    <p className="text-slate-400 text-sm">
      Network Status
    </p>

    <p className="text-4xl font-bold mt-3 text-green-400">
      ONLINE
    </p>
  </div>

</div>

<div className="text-sm text-slate-500 mb-6">
  Last Updated: {lastUpdated}
</div>
        <div className="bg-slate-900 p-6 rounded-2xl">
          <h2 className="text-2xl font-semibold mb-4">
            Search Wallet
          </h2>

<SearchBox
  wallet={wallet}
  setWallet={setWallet}
  onSearch={handleSearch}
/>
{error && (
  <div className="mt-4 flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
    <span>🚫</span>

    <span className="text-red-400 text-sm">
      {error}
    </span>
  </div>
)}     
   </div>

{searchedWallet && (
  <div className="bg-slate-900 p-6 rounded-2xl mt-6 border border-slate-800">
    <div className="flex items-center justify-between mb-6">
      <h3 className="text-2xl font-bold">
        Wallet Details
      </h3>

      <a
        href={`https://testnet.arcscan.app/address/${searchedWallet}`}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-blue-600 px-4 py-2 rounded-xl hover:bg-blue-700 transition"
      >
        View on Arcscan
      </a>
    </div>

    <div className="bg-slate-800 rounded-xl p-4 mb-6">
      <p className="text-slate-400 text-sm mb-2">
        Wallet Address
      </p>

      <p className="break-all font-mono text-sm">
        {searchedWallet}
      </p>
    </div>

    <div className="grid md:grid-cols-3 gap-4">
      <div className="bg-slate-800 rounded-xl p-5">
        <p className="text-slate-400 text-sm">
          Balance
        </p>

        <p className="text-2xl font-bold mt-2 text-green-400">
          {balance} ARC
        </p>
      </div>

      <div className="bg-slate-800 rounded-xl p-5">
        <p className="text-slate-400 text-sm">
          Transactions
        </p>

        <p className="text-2xl font-bold mt-2">
          {txNonce}
        </p>
      </div>

      <div className="bg-slate-800 rounded-xl p-5">
        <p className="text-slate-400 text-sm">
          Account Type
        </p>

        <p className="text-2xl font-bold mt-2 text-blue-400">
          {walletType}
        </p>
      </div>
    </div>
  </div>
)}
<div className="grid lg:grid-cols-2 gap-6 mt-8">

  {/* Latest Transactions */}
  <div className="bg-slate-900 p-6 rounded-2xl">
    <h2 className="text-2xl font-semibold mb-4">
      Latest Transactions
    </h2>

    <div className="space-y-3">
      {transactions.map((tx) => (
        <div
          key={tx}
          className="bg-slate-800 p-4 rounded-xl flex justify-between"
        >
          <a
            href={`https://testnet.arcscan.app/tx/${tx}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300"
          >
            {tx.slice(0, 20)}...
          </a>

          <span className="text-green-400">
            Success
          </span>
        </div>
      ))}
    </div>
  </div>

  {/* Recent Blocks */}
  <div className="bg-slate-900 p-6 rounded-2xl">
    <h2 className="text-2xl font-semibold mb-4">
      Recent Blocks
    </h2>
<div className="space-y-3">
  {recentBlocks.map((block) => (
    <a
      key={block.number}
      href={`https://testnet.arcscan.app/block/${block.number}`}
      target="_blank"
      rel="noopener noreferrer"
      className="block bg-slate-800 p-4 rounded-xl hover:bg-slate-700 transition"
    >
      <div className="flex justify-between items-center">
        <span>
          Block #{block.number.toLocaleString()}
        </span>

        <span className="text-green-400">
          {block.txs} TXs
        </span>
      </div>
    </a>
  ))}
</div>
  </div>

</div>
<footer className="mt-16 border-t border-slate-800 pt-8 text-center">
  <h3 className="text-xl font-bold">
    Building on Arc Network 🚀
  </h3>

  <p className="text-slate-500 mt-2">
    Arc Explorer Developer
  </p>

  <div className="mt-4 flex justify-center gap-4">
    <a
      href="https://x.com/ana3sona"
      target="_blank"
      rel="noopener noreferrer"
      className="text-blue-400 hover:text-blue-300"
    >
      X / Twitter
    </a>

    <a
      href="https://testnet.arcscan.app"
      target="_blank"
      rel="noopener noreferrer"
      className="text-slate-400 hover:text-white"
    >
      Arcscan
    </a>
  </div>
</footer>
</div>
   </main>
  );
}
