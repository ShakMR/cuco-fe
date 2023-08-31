import Price from "~/components/expense/Price";
import User from "~/components/user/User";
import PaymentType from "~/components/expense/PaymentType";
import type ExpenseModel from "~/model/api/expenses.model";

const Expense = ({ amount, concept, currency, payer, paymentType }: ExpenseModel) => {
  return (
    <div className="container h-20 px-6 py-4 border flex flex-row justify-around gap-1 shadow mb-6 round transition-all ease-in-out duration-300 hover:shadow-md">
      <div>
        <div className="text-xs">
          <User {...payer} />
        </div>
      </div>
      <div className="font-bold grow">
        {concept}
      </div>
      <div className="flex-col flex justify-between items-center">
        <div className="">
          <Price amount={amount} currency={currency} />
        </div>
        <div className="">
          <PaymentType name={paymentType.name} />
        </div>
      </div>
    </div>
  );
};

export default Expense;
