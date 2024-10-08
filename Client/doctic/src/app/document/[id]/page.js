'use client'
// TODO: Reduce workload of the component

import { useEffect, useState } from 'react';
import { DocBasicInfo } from 'app/app/components/DocBasicInfo';
import { PdfViewer } from 'app/app/components/PdfViewer';

export default function Page({params}) {
  const id = params.id;
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getData = async () => {
      try {
        const res = await fetch(`http://localhost:8080/api/Documentos/id/${id}`);
        if (!res.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await res.json();
        setData(data);
      } catch (error) {
        setError(error.message);
      }
    };

    getData();
  }, []);

  if (error) return <div>Error: {error}</div>;
  if (!data) return <div>Loading...</div>;

  return (
    <>
    {/* TODO: Implement the a correct layout for this view*/}
    <DocBasicInfo
      title={data.titulo}
      description={data.descripcion}
      visibility={data.visibilidad}
      category={data.categoria}
      authors={data.autores}
    />
    <PdfViewer url={data.urlArchivo}/>
    </>
  )
}
