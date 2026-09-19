
import { useFormHandling } from "@/hooks/useFormHandling";
const TransactionForm = ({setTransactions, setIsOpenForm }) => {

  /*Custom Hook */
  const {
    setSelectedType,
    setSelectedCashType,
    setSpendingName,
    setSpendingAmount,
    handleSubmit,
    setSpendingDesc,
    handleTagSelect,
  } = useFormHandling(setTransactions, setIsOpenForm);
  /*Custom Hook */
  
  return (
    
    <div
      className="fixed inset-0 z-999 w-full h-full bg-black/60 backdrop-blur-sm p-4 flex items-center justify-center"
      onClick={() => {
        setIsOpenForm(false);
      }} 
    >
     
      <div
        className="relative w-full bg-[#1e1f24] text-white rounded-2xl p-5 shadow-2xl border border-gray-800"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-gray-800">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-[#ccff00] text-black flex items-center justify-center font-bold text-sm">
              +
            </div>
            <h3 className="text-[#ccff00] font-bold text-base uppercase tracking-wider">
              Thêm khoản chi tiêu mới
            </h3>
          </div>

          {/* Nút đóng X */}
          <button
            type="button"
            onClick={() => {
              setIsOpenForm(false);
            }}
            className="text-gray-400 hover:text-red-500 text-xl font-bold p-1 transition-colors leading-none"
          >
            ✕
          </button>
        </div>

        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <div>
            <label
              htmlFor="expenseName"
              className="block text-xs font-semibold text-gray-400 mb-1 uppercase tracking-wide"
            >
              Tên khoản chi
            </label>
            <input
              type="text"
              id="expenseName"
              name="expenseName"
              placeholder="VD: Mua trà sữa..."
              onChange={(e) => setSpendingName(e.target.value)}
              className="w-full bg-[#2a2b30] border border-gray-700 focus:border-[#ccff00] focus:outline-none text-white text-sm rounded-xl px-3.5 py-2.5 transition-colors placeholder-gray-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wide">
              Loại
            </label>
            <div className="grid grid-cols-2 gap-2">
              {/* Radio Expense */}
              <label className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-[#2a2b30] border border-transparent has-checked:border-[#ccff00] has-checked:bg-[#ccff00]/10 cursor-pointer transition-all">
                <input
                  type="radio"
                  id="expense"
                  name="type"
                  value="expense"
                  defaultChecked
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="accent-[#ccff00] w-4 h-4"
                />
                <span className="text-sm font-medium text-gray-200">
                  Chi tiêu
                </span>
              </label>

              {/* Radio Income */}
              <label className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-[#2a2b30] border border-transparent has-checked:border-[#ccff00] has-checked:bg-[#ccff00]/10 cursor-pointer transition-all">
                <input
                  type="radio"
                  id="income"
                  name="type"
                  value="income"
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="accent-[#ccff00] w-4 h-4"
                />
                <span className="text-sm font-medium text-gray-200">
                  Thu nhập
                </span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wide">
              Loại Ví
            </label>
            <div className="grid grid-cols-2 gap-2">
              {/* Radio Expense */}
              <label className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-[#2a2b30] border border-transparent has-checked:border-[#ccff00] has-checked:bg-[#ccff00]/10 cursor-pointer transition-all">
                <input
                  type="radio"
                  id="cash"
                  name="typeCash"
                  value="cash"
                  defaultChecked
                  onChange={(e) => setSelectedCashType(e.target.value)}
                  className="accent-[#ccff00] w-4 h-4"
                />
                <span className="text-sm font-medium text-gray-200">
                  TIỀN MẶT
                </span>
              </label>

              {/* Radio Income */}
              <label className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-[#2a2b30] border border-transparent has-checked:border-[#ccff00] has-checked:bg-[#ccff00]/10 cursor-pointer transition-all">
                <input
                  type="radio"
                  id="bidv"
                  name="typeCash"
                  value="bidv"
                  onChange={(e) => setSelectedCashType(e.target.value)}
                  className="accent-[#ccff00] w-4 h-4"
                />
                <span className="text-sm font-medium text-gray-200">BIDV</span>
              </label>
              <label className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-[#2a2b30] border border-transparent has-checked:border-[#ccff00] has-checked:bg-[#ccff00]/10 cursor-pointer transition-all">
                <input
                  type="radio"
                  id="momo"
                  name="typeCash"
                  value="momo"
                  onChange={(e) => setSelectedCashType(e.target.value)}
                  className="accent-[#ccff00] w-4 h-4"
                />
                <span className="text-sm font-medium text-gray-200">MOMO</span>
              </label>
              <label className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-[#2a2b30] border border-transparent has-checked:border-[#ccff00] has-checked:bg-[#ccff00]/10 cursor-pointer transition-all">
                <input
                  type="radio"
                  id="sacombank"
                  name="typeCash"
                  value="sacombank"
                  onChange={(e) => setSelectedCashType(e.target.value)}
                  className="accent-[#ccff00] w-4 h-4"
                />
                <span className="text-sm font-medium text-gray-200">
                  SACOMBANK
                </span>
              </label>
            </div>
          </div>

          <div>
            <label
              htmlFor="expenseAmount"
              className="block text-xs font-semibold text-gray-400 mb-1 uppercase tracking-wide"
            >
              Số tiền (VND)
            </label>
            <input
              type="number"
              id="expenseAmount"
              name="expenseAmount"
              placeholder="VD: 50000"
              onChange={(e) => setSpendingAmount(Number(e.target.value))}
              className="w-full bg-[#2a2b30] border border-gray-700 focus:border-[#ccff00] focus:outline-none text-white text-sm rounded-xl px-3.5 py-2.5 transition-colors placeholder-gray-500"
            />
          </div>

          <div>
            <label
              htmlFor="expenseDesc"
              className="block text-xs font-semibold text-gray-400 mb-1 uppercase tracking-wide"
            >
              Tags
            </label>
            <div className="grid grid-cols-2 gap-2">
              <label className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-[#2a2b30] border border-transparent has-checked:border-[#ccff00] has-checked:bg-[#ccff00]/10 cursor-pointer transition-all">
                <input
                  type="checkbox"
                  id="tags"
                  name="tags"
                  value="food"
                  onChange={(e) => handleTagSelect(e)}
                  className="accent-[#ccff00] w-4 h-4"
                />
                <span className="text-sm font-medium text-gray-200">
                  ĂN UỐNG
                </span>
              </label>
              <label className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-[#2a2b30] border border-transparent has-checked:border-[#ccff00] has-checked:bg-[#ccff00]/10 cursor-pointer transition-all">
                <input
                  type="checkbox"
                  id="tags"
                  name="tags"
                  value="travel"
                  onChange={(e) => handleTagSelect(e)}
                  className="accent-[#ccff00] w-4 h-4"
                />
                <span className="text-sm font-medium text-gray-200">
                  ĐI LẠI
                </span>
              </label>
              <label className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-[#2a2b30] border border-transparent has-checked]:border-[#ccff00] has-checked:bg-[#ccff00]/10 cursor-pointer transition-all">
                <input
                  type="checkbox"
                  id="tags"
                  name="tags"
                  value="entertainment"
                  onChange={(e) => handleTagSelect(e)}
                  className="accent-[#ccff00] w-4 h-4"
                />
                <span className="text-sm font-medium text-gray-200">
                  GIẢI TRÍ
                </span>
              </label>
            </div>
          </div>
          <div>
            <label
              htmlFor="expenseDesc"
              className="block text-xs font-semibold text-gray-400 mb-1 uppercase tracking-wide"
            >
              Mô tả
            </label>
            <textarea
              id="expenseDesc"
              name="expenseDesc"
              rows={2}
              placeholder="Chi tiết nếu có..."
              onChange={(e) => setSpendingDesc(e.target.value)}
              className="w-full bg-[#2a2b30] border border-gray-700 focus:border-[#ccff00] focus:outline-none text-white text-sm rounded-xl px-3.5 py-2.5 transition-colors resize-none placeholder-gray-500"
            />
          </div>

          <button
            type="submit"
            onClick={handleSubmit}
            className="w-full mt-2 bg-[#ccff00] hover:bg-[#b5f100] text-black font-bold text-sm py-3 rounded-xl transition-all shadow-lg active:scale-[0.99] cursor-pointer"
          >
            Thêm mới
          </button>
        </form>
      </div>
    </div>
  );
};

export default TransactionForm;
