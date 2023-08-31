import type { PaymentTypeModel } from "~/model/api/expenses.model";

const PaymentType = ({name}: PaymentTypeModel) => {
  return <span>{name}</span>;
}

export default PaymentType;
