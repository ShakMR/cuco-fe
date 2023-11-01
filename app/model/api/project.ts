import type APIResponse from "~/model/api/apiResponse";
import type { ExpenseListResponse } from "~/model/api/expenses.model";

type Project = {
  name: string;
  uuid: string;
  isOpen: boolean;
  createdAt: string;
  shortName: string;
};

export type SingleProjectResponse = APIResponse<Project>;
export type ProjectListResponse = APIResponse<SingleProjectResponse[]>;

export interface SingleProjectWithExpensesResponse
  extends APIResponse<Project> {
  expenses: ExpenseListResponse;
}

export type ProjectListWithExpensesResponse = APIResponse<
  SingleProjectWithExpensesResponse[]
>;

export default Project;
