package com.dirac.aplicacioningsoftfinal.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class BusquedaFiltroDTO {

    private String titulo;
    private Boolean tieneFiltros;
    private List<String> keywords;
    private List<String> categorias;
    private List<String> autores;
    private String idioma;
    private Integer desde;
    private Integer hasta;


}

/**
 * {
 *   "titulo": "Buscando por título",
 *   "tieneFiltros": true,
 *   "keywords": [
 *     "yes",
 *     "no"
 *   ],
 *   categorias: [
 *     "primero",
 *     "segundo"
 *   ],
 *   autores: [
 *     "primero",
 *     "segundo"
 *   ],
 *   "idioma": "español",
 *   "desde": 2014,
 *   "hasta": 2024
 * }
 */
