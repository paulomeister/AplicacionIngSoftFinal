package com.dirac.aplicacioningsoftfinal.Service;

import java.util.List;
import java.util.Optional;
import java.util.Map;
import java.util.ArrayList;

import com.dirac.aplicacioningsoftfinal.DTO.CategoriaDTO;
import com.dirac.aplicacioningsoftfinal.Exception.IdNotFoundException;
import com.dirac.aplicacioningsoftfinal.Model.CategoriaModel;
import com.dirac.aplicacioningsoftfinal.Repository.ICategoriaRepository;
import com.mongodb.BasicDBObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.AggregationResults;
import org.springframework.stereotype.Service;

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

    @Autowired
    private MongoTemplate mongoTemplate;

    @Override
    public List<CategoriaDTO> getCatalog() {

        Aggregation aggregation = Aggregation.newAggregation(
                Aggregation.unwind("categoria"),
                Aggregation.lookup("Categorias", "categoria.categoriaId", "_id", "categoriaDetalles"),
                Aggregation.unwind("categoriaDetalles"),
                Aggregation.lookup("Documentos", "categoriaDetalles._id", "categoria.categoriaId",
                        "documentosDetalles"),
                Aggregation.unwind("documentosDetalles"),
                Aggregation.unwind("documentosDetalles.valoracionPromedio", true),
                Aggregation.group("categoriaDetalles._id")
                        .first("categoriaDetalles.nombre").as("nombre")
                        .first("categoriaDetalles.imagen").as("imagen")
                        .count().as("totalDocumentos")
                        .push(new BasicDBObject("_id", "$documentosDetalles._id")
                                .append("titulo", "$documentosDetalles.titulo")
                                .append("descripcion", "$documentosDetalles.descripcion")
                                .append("valoracionPromedio", "$documentosDetalles.datosComputados.valoracionPromedio")
                                .append("fechaSubida", "$documentosDetalles.fechaSubida"))
                        .as("documentos"),
                Aggregation.sort(Sort.Direction.DESC, "totalDocumentos"));

        AggregationResults<CategoriaDTO> result = mongoTemplate.aggregate(aggregation, "Documentos",
                CategoriaDTO.class);
        return result.getMappedResults();

    }

}
