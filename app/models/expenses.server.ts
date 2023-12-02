import type { Project } from "~/model/api/project";
import type ExpenseModel from "~/model/api/expenses.model";
import type {
  CreateExpenseModel,
  ExpenseResponse,
} from "~/model/api/expenses.model";
import { fetchAPI, MethodEnum } from "~/models/api";
import { LoggerFactory } from "~/models/helpers/logger";
import type pino from "pino";

type AddExpenseToProjectParams = {
  project: Pick<Project, "uuid">;
  expense: CreateExpenseModel;
};

const logger = LoggerFactory.get(
  "Expenses",
  process.env.LOG_LEVEL as pino.Level
);

export const addExpenseToProject = async (
  { project, expense }: AddExpenseToProjectParams,
  token: string
): Promise<ExpenseModel> => {
  logger.debug({ project, expense });
  const { data: expenseResponse, error } = await fetchAPI<ExpenseResponse>(
    `/projects/${project.uuid}/expenses`,
    {
      method: MethodEnum.POST,
      body: { ...expense, date: expense.date.toISOString() },
      authorization: token,
    }
  );

  if (error) {
    throw new Error(error.reason);
  }

  return expenseResponse!.data;
};
