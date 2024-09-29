package com.dirac.aplicacioningsoftfinal.DTO;

import java.util.List;

public class BusquedaFiltroDTO {

    private String titulo;
    private Boolean tieneFiltros;
    private List<String> keywords;
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
 *   "idioma": "español",
 *   "desde": 2014,
 *   "hasta": 2024
 * }
 */
