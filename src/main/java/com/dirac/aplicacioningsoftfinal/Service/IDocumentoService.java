package com.dirac.aplicacioningsoftfinal.Service;

import com.dirac.aplicacioningsoftfinal.Model.DocumentoModel;
import org.bson.types.ObjectId;

public interface IDocumentoService {

    DocumentoModel getDocument(ObjectId _id);

}
