
import {
  addCategory,
  getCategories,
  getCategoryById as findCategoryById,
  updateCategory,
  deleteCategory as removeCategory,
} from '../services/categoriesService.js';


// POST CATEGORY

export const postCategory = async (req, res) => {
  const id = await addCategory(req.body);

  return res.status(201).json({
    status: 'success',
    data: {
      id,
    },
  });
};


// GET ALL CATEGORIES

export const getAllCategories = async (req, res) => {
  const categories = await getCategories();

  return res.status(200).json({
    status: 'success',
    data: {
      categories,
    },
  });
};


// GET CATEGORY BY ID

export const getCategoryById = async (req, res) => {
  const category = await findCategoryById(req.params.id);

  return res.status(200).json({
    status: 'success',
    data: category,
  });
};


// PUT CATEGORY

export const putCategory = async (req, res) => {
  await updateCategory(req.params.id, req.body);

  return res.status(200).json({
    status: 'success',
    message: 'Kategori berhasil diperbarui',
  });
};


// DELETE CATEGORY

export const deleteCategory = async (req, res) => {
  await removeCategory(req.params.id);

  return res.status(200).json({
    status: 'success',
  });
};
