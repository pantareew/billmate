"use client";

type EvenSplitProps = {
  selectedMembers: string[];
  totalAmount: number;
  onComplete: (result: Record<string, number>) => void;
  onBack: () => void;
};

export default function EvenSplit({
  selectedMembers,
  totalAmount,
  onComplete,
  onBack,
}: EvenSplitProps) {
  //amount to pay per person
  const perPerson = selectedMembers.length
    ? +(totalAmount / selectedMembers.length).toFixed(2) //convert string to number with +
    : 0;

  const handleConfirm = () => {
    //{member:amount}
    const totals: Record<string, number> = {};
    selectedMembers.forEach((id) => {
      totals[id] = perPerson;
    });
    onComplete(totals); //send totals to parent
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-2xl space-y-6">
        {/*header */}
        <div className="text-center space-y-3">
          <h2 className="text-4xl font-black bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Even Split Preview
          </h2>
          <p className="text-lg text-gray-600">
            Everyone pays the same amount!
          </p>
        </div>
        {/*amount card */}
        <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border-2 border-gray-100 px-8 py-4">
          <div className="text-center space-y-2">
            <p className="text-sm font-bold text-gray-500 uppercase tracking-wide">
              Total Bill Amount
            </p>
            <p className="text-5xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              ${totalAmount.toFixed(2)}
            </p>
            <div className="flex items-center justify-center gap-2 text-gray-600 pt-2">
              <p className="text-sm">
                Split equally among{" "}
                <span className="font-bold">{selectedMembers.length}</span>{" "}
                {selectedMembers.length === 1 ? "person" : "people"}
              </p>
            </div>
          </div>
        </div>
        {/*per person amount */}
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-3xl shadow-xl shadow-blue-500/30 p-8 text-center text-white">
          <div className="flex items-center justify-center gap-2 mb-2">
            <p className="text-sm font-bold uppercase tracking-wide opacity-90">
              Each Person Pays
            </p>
          </div>
          <p className="text-5xl font-black">${perPerson}</p>
          <p className="text-sm opacity-80 mt-2">Clear and straightforward</p>
        </div>
      </div>
      <div className="flex gap-4 m-8 w-full max-w-2xl">
        {/* back */}
        <button
          onClick={onBack}
          className="w-1/2 py-4 rounded-full font-bold text-lg bg-gray-200 hover:bg-gray-300 text-gray-800"
        >
          Back
        </button>
        {/* confirm */}
        <button
          onClick={handleConfirm}
          className="w-1/2 py-4  rounded-full font-bold text-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-xl hover:shadow-purple-500/40"
        >
          Confirm Split
        </button>
      </div>
    </div>
  );
}
