'use client'
// TODO: Reduce workload of the component

import { useEffect, useState } from 'react';
import { DocBasicInfo } from './components/DocBasicInfo';
import { PdfViewer } from './components/PdfViewer';
import { instance } from 'app/app/api/axios';

export default function Page({params}) {
  const id = params.id;
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {

    const getData = () => {
      instance.get(`/Documentos/id/${id}`)
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        if(error.response) {
          setError(response.data);
        } else {
          console.log('Error', error.message);
        }
      })
    }
    getData();
  }, []);

  if (error) return <div>Error: {error}</div>;
  if (!data) return <div>Loading...</div>;

  return (
    <>
    <DocBasicInfo
      title={data.titulo}
      description={data.descripcion}
      visibility={data.visibilidad}
      category={data.categoria}
      authors={data.autores}
      date={data.fechaSubida}
    />
    {/*Recordar que userId = '', documentId= '' estan parseados por default para pruebas*/}
    <PdfViewer url={data.urlArchivo}/>
    </>
  )
}
