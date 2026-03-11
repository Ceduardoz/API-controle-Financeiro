import { getDashboardSummary } from "../services/dashboardServices.js";

export async function summary(req, res) {
  try {
    const data = await getDashboardSummary(req.userId);

    return res.status(200).json(data);
  } catch (error) {
    return res.status(error.statusCode || 400).json({
      message: error.message || "Erro ao carregar dashboard",
    });
  }
}
