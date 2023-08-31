import type { Currency } from "~/model/api/expenses.model";

type Props = {
  amount: number,
  currency: Currency,
};

const Price = ({amount, currency}: Props) => {
  return (
    <div>
      {amount} {currency.name}
    </div>
  )
}

export default Price;
