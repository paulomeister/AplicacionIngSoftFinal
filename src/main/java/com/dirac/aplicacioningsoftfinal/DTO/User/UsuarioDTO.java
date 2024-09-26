package com.dirac.aplicacioningsoftfinal.DTO.User;

import com.dirac.aplicacioningsoftfinal.Model.UsuarioModel;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class UsuarioDTO {
    private String username;
    private String email;
    private PerfilDTO perfil;
    private List<Map<String, String>> docSubidos;

    public static UsuarioDTO fromUsuarioModel(UsuarioModel usuario) {

        PerfilDTO perfilExtraido = extraerPerfil(usuario.getPerfil());
        List<Map<String, String>> docSubidosExtraidos = extraerDocumentosSubidos(usuario.getDocSubidos());

        return new UsuarioDTO(
                usuario.getUsername(),
                usuario.getEmail(),
                perfilExtraido,
                docSubidosExtraidos);
    }

    private static PerfilDTO extraerPerfil(Map<String, String> perfil) {
        return new PerfilDTO(
                perfil.get("nombre"),
                perfil.get("apellido"),
                perfil.get("fotoPerfil"));
    }

    private static List<Map<String, String>> extraerDocumentosSubidos(List<Map<String, String>> docSubidos) {
        return docSubidos.stream()
                .map(doc -> doc.entrySet().stream()
                        .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue)))
                .collect(Collectors.toList());
    }
}
