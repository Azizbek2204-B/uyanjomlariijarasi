const { errorHandler } = require("../helpers/error_handler")
const Categories = require("../models/categories.model")
const { categoriesValidation } = require("../validation/categories.validation")

const addCategory = async (req, res) => {
    try {
        const {error, value} = categoriesValidation(req.body)
        if(error){
            return errorHandler(error, res)
        }
        const { name, description, is_active } = value
        const newCategory = await Categories.create({ name, description, is_active })
        res.status(201).send({ message: "New category added", newCategory })
    } catch (error) {
        errorHandler(error, res)
    }
}

const getAllCategories = async (req, res) => {
    try {
        const categories = await Categories.findAll()
        res.status(200).send({ categories })
    } catch (error) {
        errorHandler(error, res)
    }
}

const getCategoryById = async (req, res) => {   
    try {
        const { id } = req.params
        const category = await Categories.findByPk(id)
        if (!category) {
            return res.status(404).send({ message: "Category not found" })
        }
        res.status(200).send({ category })
    } catch (error) {
        errorHandler(error, res)
    }
}

const updateCategoryById = async (req, res) => {
    try {
        const { id } = req.params
        const {error, value} = categoriesValidation(req.body)
        if(error){
            return errorHandler(error, res)
        }
        const { name, description, is_active } = value

        const [rowsUpdated, updatedCategory] = await Categories.update(
            { name, description, is_active },
            { where: { id }, returning: true }
        )

        if (rowsUpdated === 0) {
            return res.status(404).send({ message: "Category not found" })
        }

        res.status(200).send({ updatedCategory })
    } catch (error) {
        errorHandler(error, res)
    }
}

const deleteCategoryById = async (req, res) => {
    try {
        const { id } = req.params
        const deleted = await Categories.destroy({ where: { id } })

        if (!deleted) {
            return res.status(404).send({ message: "Category not found" })
        }

        res.status(200).send({ message: "Category deleted" })
    } catch (error) {
        errorHandler(error, res)
    }
}

module.exports = {
    addCategory,
    getAllCategories,
    getCategoryById,
    updateCategoryById,
    deleteCategoryById
}
