package com.dirac.aplicacioningsoftfinal.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.dirac.aplicacioningsoftfinal.Model.UsuarioModel;
import com.dirac.aplicacioningsoftfinal.Repository.IUsuarioRepository;

import java.util.Optional;

@Service
public class UsuarioService implements IUsuarioService {

    @Autowired
    private IUsuarioRepository usuarioRepository;

    @Override
    public Optional<UsuarioModel> getUserById(String id){
        return usuarioRepository.findById(id);
    }

    @Override
    public Optional<UsuarioModel> getUserByUsername(String username) {
        return usuarioRepository.findUserByUserName(username);
    }

    @Override
    public String insertUser(UsuarioModel usuario) {
        usuarioRepository.save(usuario);
        return "El usuario con _id: " + usuario.get_idAString() + "  sido guardado con éxito";
    }
}

