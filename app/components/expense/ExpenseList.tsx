import Expense from "~/components/expense/Expense";
import type { ExpenseResponse } from "~/model/api/expenses.model";

const ExpenseList = ({ expenses }: { expenses: ExpenseResponse[] }) => {
  if (!expenses || expenses.length === 0) {
    return null;
  }

  return (
    <div className="h-full overflow-y-scroll">
      {expenses.map(({ data }) => (
        <Expense key={data.uuid} {...data} />
      ))}
    </div>
  );
};

export default ExpenseList;
