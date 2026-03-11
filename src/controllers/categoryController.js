import {
  createCategory as createCategoryService,
  getCategories as getCategoriesService,
  getCategory as getCategoryService,
  updateCategory as updateCategoryService,
  deleteCategory as deleteCategoryService,
} from "../services/categoryServices.js";
import {
  createCategorySchema,
  updateCategorySchema,
} from "../schemas/categorySchemas.js";

export async function createCategory(req, res) {
  try {
    const data = createCategorySchema.parse(req.body);

    const category = await createCategoryService(req.userId, data);

    return res.status(201).json(category);
  } catch (error) {
    return res.status(error.statusCode || 400).json({
      message: error.message || "Erro ao criar categoria",
    });
  }
}

export async function getCategories(req, res) {
  try {
    const categories = await getCategoriesService(req.userId);

    return res.status(200).json(categories);
  } catch (error) {
    return res.status(error.statusCode || 400).json({
      message: error.message || "Erro ao listar categorias",
    });
  }
}

export async function getCategory(req, res) {
  try {
    const category = await getCategoryService(req.userId, req.params.id);

    return res.status(200).json(category);
  } catch (error) {
    return res.status(error.statusCode || 400).json({
      message: error.message || "Erro ao buscar categoria",
    });
  }
}

export async function updateCategory(req, res) {
  try {
    const data = updateCategorySchema.parse(req.body);

    const category = await updateCategoryService(
      req.userId,
      req.params.id,
      data,
    );

    return res.status(200).json(category);
  } catch (error) {
    return res.status(error.statusCode || 400).json({
      message: error.message || "Erro ao atualizar categoria",
    });
  }
}

export async function deleteCategory(req, res) {
  try {
    await deleteCategoryService(req.userId, req.params.id);

    return res.status(204).send();
  } catch (error) {
    return res.status(error.statusCode || 400).json({
      message: error.message || "Erro ao deletar categoria",
    });
  }
}
