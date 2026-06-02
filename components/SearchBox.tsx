type SearchBoxProps = {
  wallet: string;
  setWallet: (value: string) => void;
  onSearch: () => void;
};

export default function SearchBox({
  wallet,
  setWallet,
  onSearch,
}: SearchBoxProps) {
  return (
    <div className="flex gap-3">
      <input
        type="text"
        value={wallet}
        onChange={(e) => setWallet(e.target.value)}
        placeholder="Enter wallet address..."
        className="flex-1 bg-slate-800 p-4 rounded-xl outline-none"
      />

      <button
        onClick={onSearch}
        className="bg-blue-600 px-6 rounded-xl hover:bg-blue-700"
      >
        Search
      </button>
    </div>
  );
}
