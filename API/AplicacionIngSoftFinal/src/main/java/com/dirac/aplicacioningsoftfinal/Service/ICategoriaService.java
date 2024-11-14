package com.dirac.aplicacioningsoftfinal.Service;

import java.util.Optional;

import org.bson.types.ObjectId;

import java.util.List;

import com.dirac.aplicacioningsoftfinal.DTO.CategoriaConSubCategoriasDTO;
import com.dirac.aplicacioningsoftfinal.DTO.CategoriaDTO;
import com.dirac.aplicacioningsoftfinal.Model.CategoriaModel;

public interface ICategoriaService {

    Optional<CategoriaModel> getById(String id);

    List<CategoriaModel> getByName(String name);

    List<CategoriaModel> getSubcategories(String name);

    List<CategoriaModel> getAll();

    CategoriaModel createCategory(CategoriaModel categoria);

    CategoriaModel updateCategory(String id, CategoriaModel categoria);

    String deleteCategory(String categoryId);

    List<CategoriaDTO> getCatalog();

    List<String> getCategoriesDistinct();

    List<CategoriaConSubCategoriasDTO> getAllSubCategoriesFromACategoryName(String nombre);
}
