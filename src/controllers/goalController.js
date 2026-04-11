import {
  createGoal as createGoalService,
  getGoals as getGoalsService,
  getGoal as getGoalService,
  updateGoal as updateGoalService,
  deleteGoal as deleteGoalService,
} from "../services/goalServices.js";

import { createGoalSchema, updateGoalSchema } from "../schemas/goalSchemas.js";

export async function createGoal(req, res, next) {
  try {
    const userId = req.userId;
    const data = createGoalSchema.parse(req.body);

    const goal = await createGoalService(userId, data);

    return res.status(201).json(goal);
  } catch (error) {
    next(error);
  }
}

export async function getGoals(req, res, next) {
  try {
    const userId = req.userId;
    const goals = await getGoalsService(userId);

    return res.status(200).json(goals);
  } catch (error) {
    next(error);
  }
}

export async function getGoal(req, res, next) {
  try {
    const userId = req.userId;
    const { id } = req.params;

    const goal = await getGoalService(userId, id);

    return res.status(200).json(goal);
  } catch (error) {
    next(error);
  }
}

export async function updateGoal(req, res, next) {
  try {
    const userId = req.userId;
    const { id } = req.params;
    const data = updateGoalSchema.parse(req.body);

    const goal = await updateGoalService(userId, id, data);

    return res.status(200).json(goal);
  } catch (error) {
    next(error);
  }
}

export async function deleteGoal(req, res, next) {
  try {
    const userId = req.userId;
    const { id } = req.params;

    const result = await deleteGoalService(userId, id);

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}
