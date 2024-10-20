package com.dirac.aplicacioningsoftfinal.Controller;

import com.dirac.aplicacioningsoftfinal.DTO.Res;
import com.dirac.aplicacioningsoftfinal.Exception.IdNotFoundException;
import com.dirac.aplicacioningsoftfinal.Service.ICategoriaService;
import com.google.api.services.drive.Drive.Apps.List;

import org.apache.catalina.connector.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/Categorias")
public class CategoriaController {

    @Autowired
    private ICategoriaService categoriaService;

    @GetMapping("/id/{id}")
    public ResponseEntity<?> getById(@PathVariable("id") String id) {

        return ResponseEntity.status(HttpStatus.OK)
                .body(categoriaService.getById(id).orElseThrow(() -> new IdNotFoundException(id + " Not found")));

    }

    @GetMapping("/getByName/{name}")
    public ResponseEntity<?> getByName(@PathVariable("name") String name) {
        return ResponseEntity.ok(categoriaService.getByName(name));
    }

    @GetMapping("/getSubcategories/{id}")
    public ResponseEntity<?> getSubcategories(@PathVariable("id") String id) {
        return ResponseEntity.status(HttpStatus.OK).body(categoriaService.getSubcategories(id));
    }

    @GetMapping("/getCatalog")
    public ResponseEntity<?> getCategoriesCatalog() {
        return ResponseEntity.status(HttpStatus.CREATED).body(categoriaService.getCatalog());
    }

    @GetMapping("/allDistinct")
    public ResponseEntity<?> getAllDistinctCategories() {
        return ResponseEntity.status(200).body(categoriaService.getCategoriesDistinct());
    }

    @GetMapping("/getSubcategoriesWithName/{name}")
    public ResponseEntity<?> getSubcategoriesFromAName(@PathVariable("name") String name) {
        try {
                      
            return ResponseEntity.status(200).body(categoriaService.getAllSubCategoriesFromACategoryName(name));

        } catch (Exception e) {

            Res respuesta = new Res();
            respuesta.setMessage(e.getMessage());
            respuesta.setStatus(500);

            return ResponseEntity.status(500).body(respuesta);
        }
    }

}
