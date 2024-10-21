'use client'

import { Alert } from 'react-bootstrap';

export const AlertPop = ({error, finalResults, loading}) => {
  //------- Manejo del estado de carga -------------
  if (loading) {
    return (
      <div className="alert">
        <Alert variant="success" className="h-auto">
          <Alert.Heading>Cargando...</Alert.Heading>
          <p>{error}</p>
        </Alert>
      </div>
      )
  }

  // ----------- Manejo de errores -------------- 
  if (error) {
    return (
      <div className="alert">
        <Alert variant="danger" className="h-auto">
          <Alert.Heading>{error}</Alert.Heading>
        </Alert>
      </div>
      )
  }

  // --------- Manejo de caso en el que no haya resultados -------- 
  if (finalResults.length === 0) {
    return (
    <div className="alert">
      <Alert variant="danger" className="h-auto">
        <Alert.Heading>Ningún documento encontrado</Alert.Heading>
      </Alert>
    </div>
    )
  }
}