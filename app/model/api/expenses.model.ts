import type APIResponse from "~/model/api/apiResponse";
import type BackendUserModel from "~/model/api/user";

export type CurrencyModel = {
  name: "EUR" | "USD";
};

enum PaymentTypes {
  debit = "debit",
  credit = "credit",
}

export type PaymentTypeModel = {
  name: PaymentTypes;
};

export type ExpenseModel = {
  uuid: string;
  amount: number;
  concept: string;
  currency: CurrencyModel;
  date: Date;
  payer: BackendUserModel;
  paymentType: PaymentTypeModel;
};

export type CreateExpenseModel = {
  amount: number;
  concept: string;
  currency: string;
  paymentType: string;
  date: Date;
};

export type ExpenseResponse = APIResponse<ExpenseModel>;
export type ExpenseListResponse = APIResponse<ExpenseModel[]>;

export default ExpenseModel;
