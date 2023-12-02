import type APIResponse from "~/model/api/apiResponse";
import type { ExpenseListResponse } from "~/model/api/expenses.model";

export type Project = {
  name: string;
  uuid: string;
  isOpen: boolean;
  createdAt: string;
  shortName: string;
};

export type SingleProjectResponse = APIResponse<Project> & {
  expenses: APIResponse<ExpenseListResponse>;
};

export type ProjectListResponse = APIResponse<SingleProjectResponse[]>;
