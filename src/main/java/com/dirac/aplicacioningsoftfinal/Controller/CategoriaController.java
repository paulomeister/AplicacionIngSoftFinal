package com.dirac.aplicacioningsoftfinal.Controller;

import com.dirac.aplicacioningsoftfinal.Exception.IdNotFoundException;
import com.dirac.aplicacioningsoftfinal.Service.ICategoriaService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/categorias")
public class CategoriaController {

    @Autowired
    private ICategoriaService categoriaService;

    @GetMapping("/{id}")
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
        return ResponseEntity.ok(categoriaService.getSubcategories(id));
    }

    @GetMapping("/getCatalog")
    public ResponseEntity<?> getCategoriesCatalog(){
        return ResponseEntity.ok(categoriaService.getCatalog());
    }

}
