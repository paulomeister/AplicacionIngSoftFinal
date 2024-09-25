package com.dirac.aplicacioningsoftfinal.Service;

import com.dirac.aplicacioningsoftfinal.DTO.User.UsuarioDTO;
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
    public Optional<UsuarioDTO> getUserById(String id){
        Optional<UsuarioModel> usuarioModelOptional = usuarioRepository.findById(id);
        return usuarioModelOptional.map(UsuarioDTO::fromUsuarioModel);
    }

    @Override
    public Optional<UsuarioDTO> getUserByUserName(String name) {
        Optional<UsuarioModel> usuarioModelOptional = usuarioRepository.findUserByUserName(name);
        return usuarioModelOptional.map(UsuarioDTO::fromUsuarioModel);
    }
}

