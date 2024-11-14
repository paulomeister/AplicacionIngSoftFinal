"use client"

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
import { Pagination } from '@nextui-org/react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Page({ params }) {
  const id = params.id;
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [allowNewComment, setAllowNewComment] = useState(false); // Estado para permitir nuevos comentarios
  const commentsPerPage = 5;

  const { user } = useContext(AuthContext);

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
      
      const sortedComments = commentsWithUserData.sort((a, b) => 
        new Date(b.createdAt) - new Date(a.createdAt)
      );
      
      setComments(sortedComments);
      setTotalPages(Math.max(1, Math.ceil(sortedComments.length / commentsPerPage)));
      
      if (currentPage > Math.ceil(sortedComments.length / commentsPerPage)) {
        setCurrentPage(1);
      }
    } catch (error) {
      console.error('Error al obtener los comentarios:', error);
      //toast.error("No se pudieron cargar los comentarios.");
    }
  }, [currentPage]);

  const refreshComments = useCallback(async () => {
    try {
      const response = await instance.get(`/Documentos/id/${id}`);
      await fetchComments(response.data.valoraciones);
    } catch (error) {
      console.error('Error al actualizar los comentarios:', error);
      toast.error("Error al actualizar los comentarios.");
    }
  }, [id, fetchComments]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await instance.get(`/Documentos/id/${id}`);
        setData(response.data);
        await fetchComments(response.data.valoraciones);
      } catch (error) {
        if (error.response) {
          setError(error.response.data || 'Error al cargar los datos.');
        } else {
          setError(error.message);
          console.error('Error', error.message);
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
      toast.success("Comentario actualizado correctamente.");
      await refreshComments();
    } catch (error) {
      console.error('Error al editar el comentario:', error);
      toast.error("No se pudo actualizar el comentario.");
    }
  };

  const handleDeleteComment = async (userId) => {
    try {
      await instance.delete(`/Documentos/${id}/valoraciones/${userId}`);
      toast.success("Comentario eliminado correctamente.");
      await refreshComments();
      setAllowNewComment(true); // Permitir al usuario comentar nuevamente después de eliminar
    } catch (error) {
      console.error('Error al eliminar el comentario:', error);
      toast.error("No se pudo eliminar el comentario.");
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({
      top: document.querySelector('.comments-section')?.offsetTop,
      behavior: 'smooth'
    });
  };

  const getCurrentPageComments = () => {
    const startIndex = (currentPage - 1) * commentsPerPage;
    return comments.slice(startIndex, startIndex + commentsPerPage);
  };

  if (error) return <AlertPop error={error} />;
  if (!data || isLoading) return <SpinerComp />;

  let visualiza = false;
  data.autores.map((autor) => {
    console.log(autor);
    // console.log(`${ visualiza} VISUALIZA \n ${autor.usuarioId} : ${id}`);
    if(autor.usuarioId == user._id) {
      visualiza = true;
    }
  });
  if(!visualiza) {
    window.location.href = "/error404"
  }
  console.log("ID ACTUAL: ", user._id, " ", id);
  return (
    <div className="flex flex-col gap-6">
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
        allowNewComment={allowNewComment} // Nuevo prop
      />
      
      <div className="comments-section">
        <CommentsList
          comments={getCurrentPageComments()}
          currentUserId={user?._id}
          onEditComment={handleEditComment}
          onDeleteComment={handleDeleteComment}
        />
        
        {totalPages > 1 && (
          <div className="flex justify-center mt-4 mb-6">
            <Pagination
              total={totalPages}
              page={currentPage}
              onChange={handlePageChange}
              showControls
              showShadow
              color="primary"
              initialPage={1}
            />
          </div>
        )}
      </div>
    </div>
  );
}


