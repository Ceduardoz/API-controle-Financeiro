import { z } from "zod";
import {
  createInvestment,
  getInvestments,
  getInvestment,
  deleteInvestment,
} from "../services/investmentServices.js";

const createInvestmentSchema = z.object({
  name: z.string().min(2),
  type: z.enum(["CDB", "CDI", "LCI", "LCA"]),
  institution: z.string().optional(),
  investedAmount: z.coerce.number().positive(),
  annualRate: z.coerce.number().positive(),
  startDate: z.string(),
});

export async function create(req, res) {
  try {
    const data = createInvestmentSchema.parse(req.body);

    const investment = await createInvestment(req.userId, data);

    return res.status(201).json(investment);
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
}

export async function list(req, res) {
  const investments = await getInvestments(req.userId);
  res.json(investments);
}

export async function show(req, res) {
  const investment = await getInvestment(req.userId, req.params.id);
  res.json(investment);
}

export async function remove(req, res) {
  const investment = await deleteInvestment(req.userId, req.params.id);
  res.status(200).json(investment);
}
