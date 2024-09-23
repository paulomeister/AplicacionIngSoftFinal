package com.dirac.aplicacioningsoftfinal.Service;

import java.util.List;
import java.util.Optional;
import java.util.Map;
import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.dirac.aplicacioningsoftfinal.Exception.IdNotFoundException;
import com.dirac.aplicacioningsoftfinal.Model.CategoriaModel;
import com.dirac.aplicacioningsoftfinal.Repository.ICategoriaRepository;

@Service
public class CategoriaService implements ICategoriaService {

    @Autowired
    private ICategoriaRepository categoriaRepository;

    @Override
    public Optional<CategoriaModel> getById(String id) {

        return categoriaRepository.findById(id);

    }

    @Override
    public List<CategoriaModel> getByName(String name) {

        return categoriaRepository.findByName(name);

    }

    @Override
    public List<CategoriaModel> getSubcategories(String id) {

        CategoriaModel categoria = categoriaRepository.findById(id)
                .orElseThrow(() -> new IdNotFoundException(id + " Not found"));

        List<Map<String, String>> subCategorias = categoria.getSubcategorias();

        List<CategoriaModel> res = new ArrayList<>();

        for (Map<String, String> subCat : subCategorias) {

            String categoriaId = subCat.get("categoriaId");
            Optional<CategoriaModel> subCategoria = categoriaRepository.findById(categoriaId);
            res.add(subCategoria
                    .orElseThrow(() -> new IdNotFoundException("The subcategory with id: " + id + " wasn't found")));

        }
        return res;

    }

}
