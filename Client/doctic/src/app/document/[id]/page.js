"use client";

import { useContext, useEffect, useState, useCallback } from 'react';
import { DocBasicInfo } from './components/DocBasicInfo';
import { PdfViewer } from './components/PdfViewer';
import { instance } from 'app/app/api/axios';
import { AlertPop } from './components/AlertPop';
import { SpinerComp } from './components/SpinnerComp';
import { DownloadButton } from './components/DownloadButton';
import { AuthContext } from 'app/app/context/AuthContext';
import Valoration from './components/Valorations';
import { CommentsList } from './components/Comments';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Page({ params }) {
  const id = params.id;
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user, clientKey } = useContext(AuthContext);

  const fetchUserDetails = async (userId) => {
    try {
      const response = await instance.get(`/Usuarios/id/${userId}`);
      return {
        userId: response.data._id,
        userName: response.data.username,
        avatarUrl: response.data.perfil.fotoPerfil 
      };
    } catch (error) {
      console.error(`Error al obtener usuario ${userId}:`, error);
      return { 
        userId, 
        userName: 'Usuario desconocido', 
        avatarUrl: 'https://via.placeholder.com/40' 
      };
    }
  };

  const fetchComments = useCallback(async (valoraciones) => {
    try {
      const commentsWithUserData = await Promise.all(
        valoraciones.map(async (valoracion) => {
          const userDetails = await fetchUserDetails(valoracion.usuarioId);
          return {
            userId: valoracion.usuarioId,
            userName: userDetails.userName,
            avatarUrl: userDetails.avatarUrl,
            content: valoracion.comentario,
            rating: valoracion.puntuacion,
            createdAt: valoracion.fechaCreacion
          };
        })
      );
      setComments(commentsWithUserData);
    } catch (error) {
      console.error('Error al obtener los comentarios:', error);
      toast.error("No se pudieron cargar los comentarios.");
    }
  }, []);

  const refreshComments = useCallback(async () => {
    try {
      const response = await instance.get(`/Documentos/id/${id}`);
      await fetchComments(response.data.valoraciones);
    } catch (error) {
      console.error('Error al actualizar los comentarios:', error);
    }
  }, [id, fetchComments]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await instance.get(`/Documentos/id/${id}`);
        setData(response.data);
        await fetchComments(response.data.valoraciones);
        setError(null);
      } catch (error) {
        if (error.response) {
          setError(error.response.data || 'Error al cargar los datos.');
        } else {
          setError(error.message);
          console.log('Error', error.message);
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [id, fetchComments]);

  const handleCommentSuccess = useCallback(() => {
    refreshComments();
  }, [refreshComments]);

  const handleEditComment = async (userId, newContent, newRating) => {
    try {
      await instance.put(`/Documentos/${id}/valoraciones/${userId}`, {
        puntuacion: newRating,
        comentario: newContent
      });
      toast.success("El comentario se ha actualizado correctamente.");
      await refreshComments();
    } catch (error) {
      console.error('Error al editar el comentario:', error);
      toast.error("No se pudo actualizar el comentario. Por favor, inténtalo de nuevo.");
    }
  };

  const handleDeleteComment = async (userId) => {
    try {
      await instance.delete(`/Documentos/${id}/valoraciones/${userId}`);
      await refreshComments();
      toast.success("El comentario se ha eliminado correctamente.");
    } catch (error) {
      console.error('Error al eliminar el comentario:', error);
      toast.error("No se pudo eliminar el comentario. Por favor, inténtalo de nuevo.");
    }
  };

  if (error) {
    return <AlertPop error={error} />;
  }

  if (!data || isLoading) {
    return <SpinerComp />;
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
      <PdfViewer url={data.urlArchivo} documentId={data._id} />
      <DownloadButton url={data.urlArchivo} archivo={data} />

      <Valoration 
        documentId={data._id} 
        onCommentSuccess={handleCommentSuccess}
      />
      
      <CommentsList
        comments={comments}
        onEditComment={handleEditComment}
        onDeleteComment={handleDeleteComment}
      />

      
      
      
    </>
  );
}
