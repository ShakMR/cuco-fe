import type APIResponse from "~/model/api/apiResponse";
import type BackendUserModel from "~/model/api/user";

export type CurrencyModel = {
  name: "EUR" | "USD",
};

enum PaymentTypes {
  debit = "debit",
  credit = "credit",
}

export type PaymentTypeModel = {
  name: PaymentTypes
}

type ExpenseModel = {
  uuid: string;
  amount: number;
  concept: string;
  createdAt: Date;
  currency: CurrencyModel;
  date: Date;
  payer: BackendUserModel;
  paymentType: PaymentTypeModel;
}

export type ExpenseResponse = APIResponse<ExpenseModel>;
export type ExpenseListResponse = APIResponse<ExpenseModel[]>;

export default ExpenseModel;
