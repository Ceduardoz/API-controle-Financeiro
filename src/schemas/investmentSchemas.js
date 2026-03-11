import { z } from "zod";

export const createInvestmentSchema = z.object({
  name: z.string().min(2),
  type: z.enum(["CDB", "CDI", "LCI", "LCA"]),
  institution: z.string().optional(),
  investedAmount: z.coerce.number().positive(),
  annualRate: z.coerce.number().positive(),
  startDate: z.string(),
});
