'use client'

import { Alert } from 'react-bootstrap';

export const AlertPop = ({ infDocumentos, loading}) => {
  //------- Manejo del estado de carga -------------
  if (loading) {
    return (
      <div className="alert">
        <Alert variant="success" className="h-auto">
          <Alert.Heading>Cargando...</Alert.Heading>
        </Alert>
      </div>
      )
  }

  // --------- Manejo de caso en el que no haya resultados -------- 
  if (infDocumentos.length === 0) {
    return (
    <div className="alert">
      <Alert variant="danger" className="h-auto">
        <Alert.Heading>Ningún documento encontrado</Alert.Heading>
      </Alert>
    </div>
    )
  }
}
