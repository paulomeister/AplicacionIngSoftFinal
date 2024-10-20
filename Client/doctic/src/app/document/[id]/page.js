'use client'
// TODO: Reduce workload of the component

import { useEffect, useState } from 'react';
import { DocBasicInfo } from './components/DocBasicInfo';
import { PdfViewer } from './components/PdfViewer';
import { instance } from 'app/app/api/axios';
import { AlertPop } from './components/AlertPop';
import { SpinerComp } from './components/SpinnerComp';
import { DownloadButton } from './components/DownloadButton';

export default function Page({params}) {
  const id = params.id;
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {

    const getData = () => {
      instance.get(`/Documentos/id/${id}`)
      .then((response) => {
        setData(response.data);
        setError(null);
      })
      .catch((error) => {
        if(error.response) {
          setError(error.response.data || 'Error al cargar los datos.');
        } else {
          setError(error.message);
          console.log('Error', error.message);
        }
      })
    }
    getData();
  }, []);

  
  if (error) {
    return (
      <AlertPop error={error}/>
    );
  }

  if (!data) {
    return (
      <SpinerComp />
    );
  }

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
      <DownloadButton url={data.urlArchivo} />
    </>
  )
}
