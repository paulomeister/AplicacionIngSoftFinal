package com.dirac.aplicacioningsoftfinal.Service;

import java.util.List;
import java.util.Optional;
import java.util.Map;
import java.util.ArrayList;

import com.dirac.aplicacioningsoftfinal.DTO.CategoriaConSubCategoriasDTO;
import com.dirac.aplicacioningsoftfinal.DTO.CategoriaDTO;
import com.dirac.aplicacioningsoftfinal.Exception.IdNotFoundException;
import com.dirac.aplicacioningsoftfinal.Model.CategoriaModel;
import com.dirac.aplicacioningsoftfinal.Model.CategoriaModel.SubCategorias;
import com.dirac.aplicacioningsoftfinal.Repository.ICategoriaRepository;
import com.mongodb.BasicDBObject;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.AggregationResults;
import org.springframework.data.mongodb.core.aggregation.LookupOperation;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.stereotype.Service;

@Service
public class CategoriaService implements ICategoriaService {

        @Autowired
        private ICategoriaRepository categoriaRepository;

        @Autowired
        private MongoTemplate mongoTemplate;

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

                List<SubCategorias> subCategorias = categoria.getSubcategorias();

                List<CategoriaModel> res = new ArrayList<>();

                for (SubCategorias subCat : subCategorias) {

                        String categoriaId = subCat.getCategoriaId().toHexString();
                        Optional<CategoriaModel> subCategoria = categoriaRepository.findById(categoriaId);
                        res.add(subCategoria
                                        .orElseThrow(() -> new IdNotFoundException(
                                                        "The subcategory with id: " + id + " wasn't found")));

                }
                return res;

        }

        @Override
        public List<CategoriaConSubCategoriasDTO> getAllSubCategoriesFromACategoryName(String nombre) {
                // $match por nombre
                Criteria matchCriteria = Criteria.where("nombre").is(nombre);

                // $lookup para la colección Categorias
                LookupOperation lookupOperation = LookupOperation.newLookup()
                                .from("Categorias")
                                .localField("subcategorias.categoriaId")
                                .foreignField("_id")
                                .as("subCategorias");

                // Construir la agregación
                Aggregation aggregation = Aggregation.newAggregation(
                                Aggregation.match(matchCriteria),
                                lookupOperation,
                                Aggregation.project("_id", "nombre", "imagen", "subCategorias"));

                // Ejecutar la agregación y mapear el resultado a CategoriaConSubcategoriasDTO
                AggregationResults<CategoriaConSubCategoriasDTO> result = mongoTemplate.aggregate(aggregation,
                                "Categorias", CategoriaConSubCategoriasDTO.class);

                return result.getMappedResults();

        }

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
                                                                .append("descripcion",
                                                                                "$documentosDetalles.descripcion")
                                                                .append("valoracionPromedio",
                                                                                "$documentosDetalles.datosComputados.valoracionPromedio")
                                                                .append("fechaSubida",
                                                                                "$documentosDetalles.fechaSubida"))
                                                .as("documentos"),
                                Aggregation.sort(Sort.Direction.DESC, "totalDocumentos"));

                AggregationResults<CategoriaDTO> result = mongoTemplate.aggregate(aggregation, "Documentos",
                                CategoriaDTO.class);
                return result.getMappedResults();

        }

        @Override
        public List<String> getCategoriesDistinct() {

                return mongoTemplate.query(CategoriaModel.class)
                                .distinct("nombre")
                                .as(String.class)
                                .all();
        }

        @Override
        public List<CategoriaModel> getAll() {
                return categoriaRepository.findAll();
        }

        @Override
        public String deleteCategory(String categoryId) {
                categoriaRepository.deleteById(categoryId);
                return "La categoría con el id: " + categoryId + " ha sido eliminada correctamente";
        }

        @Override
        public CategoriaModel createCategory(CategoriaModel categoria) {

                return categoriaRepository.save(categoria);
        }

        @Override
        public CategoriaModel updateCategory(String id, CategoriaModel categoria) {
                CategoriaModel existingCategory = categoriaRepository.findById(id)
                                .orElseThrow(() -> new IdNotFoundException("Categoría no encontrada"));

                existingCategory.setNombre(categoria.getNombre());
                existingCategory.setDescripcion(categoria.getDescripcion());
                existingCategory.setSubcategorias(categoria.getSubcategorias());
                existingCategory.setImagen(categoria.getImagen());

                return categoriaRepository.save(existingCategory);
        }
}
