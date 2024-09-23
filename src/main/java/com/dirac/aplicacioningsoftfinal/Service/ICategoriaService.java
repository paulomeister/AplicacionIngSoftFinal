package com.dirac.aplicacioningsoftfinal.Service;

import java.util.Optional;
import java.util.List;

import com.dirac.aplicacioningsoftfinal.Model.CategoriaModel;

public interface ICategoriaService {

    Optional<CategoriaModel> getById(String id);

    List<CategoriaModel> getByName(String name);

    List<CategoriaModel> getSubcategories(String id);

}
