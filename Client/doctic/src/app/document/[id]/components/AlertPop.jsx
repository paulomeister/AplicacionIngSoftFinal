'use client'

import { Alert } from 'react-bootstrap';

export const AlertPop = ({error}) => {
  return (
    <Alert variant="danger" className="h-auto">
        <Alert.Heading>Error al cargar los datos</Alert.Heading>
        <p>{error}</p>
    </Alert>
  )
}