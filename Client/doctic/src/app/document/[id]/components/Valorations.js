import { useEffect, useState, useMemo, useContext } from 'react';
import { Card, CardBody, CardHeader, Button, Textarea, Divider, Progress } from '@nextui-org/react';
import { Star } from "lucide-react";
import { instance } from 'app/app/api/axios';
import { toast, ToastContainer } from 'react-toastify';
import { AuthContext } from 'app/app/context/AuthContext';
import 'react-toastify/dist/ReactToastify.css';
import "./avatar.css";

const RatingStars = ({ rating, onRatingChange }) => {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-default-600 mr-2">Tu valoración:</span>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-6 h-6 cursor-pointer transition-colors ${
              star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
            }`}
            onClick={() => onRatingChange(star)}
          />
        ))}
      </div>
      {rating > 0 && (
        <span className="text-sm text-default-600 ml-2">
          {rating === 1 && "Pésimo"}
          {rating === 2 && "Malo"}
          {rating === 3 && "Regular"}
          {rating === 4 && "Bueno"}
          {rating === 5 && "Excelente"}
        </span>
      )}
    </div>
  );
};

const MAX_CHARS = 230;

const Valoration = ({ documentId, onCommentSuccess }) => {
  const { user } = useContext(AuthContext);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userDetails, setUserDetails] = useState({
    avatarUrl: 'https://via.placeholder.com/150',
  });

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (!user?._id) return;
      
      try {
        const response = await instance.get(`/Usuarios/id/${user._id}`);
        setUserDetails({
          avatarUrl: response.data.perfil.fotoPerfil || 'https://via.placeholder.com/150',
        });
      } catch (error) {
        console.error("Error al obtener el usuario:", error);
      }
    };
    fetchUserDetails();
  }, [user?._id]);

  const characterStats = useMemo(() => {
    const charsWithoutSpaces = comment.replace(/\s/g, '').length;
    const percentage = (charsWithoutSpaces / MAX_CHARS) * 100;
    const remaining = MAX_CHARS - charsWithoutSpaces;

    return {
      current: charsWithoutSpaces,
      percentage: Math.min(percentage, 100),
      remaining: Math.max(remaining, 0),
      isOverLimit: charsWithoutSpaces > MAX_CHARS
    };
  }, [comment]);

  const handleRating = (rate) => {
    setRating(rate);
    setErrorMessage(''); 
  };

  const handleCommentChange = (event) => {
    const newValue = event.target.value;
    const charsWithoutSpaces = newValue.replace(/\s/g, '').length;
    
    setComment(newValue);
    
    if (charsWithoutSpaces > MAX_CHARS) {
      setErrorMessage(`Has excedido el límite de ${MAX_CHARS} caracteres`);
    } else {
      setErrorMessage('');
    }
  };

  const handleSubmit = async () => {
    if (!comment.trim() || rating === 0) {
      setErrorMessage("Por favor, completa todos los campos");
      return;
    }

    if (characterStats.isOverLimit) {
      setErrorMessage(`Reduce el comentario a ${MAX_CHARS} caracteres`);
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    const newValoration = {
      usuarioId: user._id,
      puntuacion: rating,
      comentario: comment,
    };

    try {
      await instance.post(`/Documentos/${documentId}/valoraciones`, newValoration);
      toast.success("¡Comentario agregado correctamente!");
      setComment('');
      setRating(0);
      setErrorMessage('');
      if (onCommentSuccess) {
        onCommentSuccess();
      }
    } catch (error) {
      console.error("Error al enviar la valoración:", error);
      setErrorMessage("Error al enviar la valoración. Por favor, inténtalo de nuevo.");
      toast.error("Error al enviar la valoración");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user?._id) {
    return (
      <Card className="w-full">
        <CardBody className="flex items-center justify-center p-8">
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-2">Inicia sesión para comentar</h3>
            <p className="text-default-500">Necesitas estar registrado para dejar una valoración</p>
          </div>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <ToastContainer />
      <CardHeader className="flex flex-col items-start px-6 pb-0">
        <h3 className="text-xl font-semibold">Añadir una valoración</h3>
        <p className="text-sm text-default-500">Comparte tu opinión sobre este documento</p>
      </CardHeader>
      
      <CardBody className="gap-6">
        <div className="flex items-start gap-4">
          <img src={userDetails.avatarUrl} alt="Avatar" className="avatar" />
          
          <div className="flex-grow space-y-2">
            <Textarea
              placeholder="Comparte tu experiencia con este documento..."
              value={comment}
              onChange={handleCommentChange}
              minRows={4}
              classNames={{
                base: "w-full",
                input: "resize-none"
              }}
              isInvalid={characterStats.isOverLimit || !!errorMessage}
              errorMessage={characterStats.isOverLimit ? 
                `Límite excedido por ${-characterStats.remaining} caracteres` : 
                errorMessage
              }
              isDisabled={isSubmitting}
            />
            
            <div className="space-y-2">
              <Progress 
                size="sm"
                value={characterStats.percentage}
                color={characterStats.percentage > 90 ? "danger" : characterStats.percentage > 70 ? "warning" : "primary"}
              />
              <div className="flex justify-between items-center text-sm">
                <span className={`${characterStats.isOverLimit ? 'text-danger' : 'text-default-500'}`}>
                  {characterStats.remaining} caracteres restantes
                </span>
                <span className="text-default-400">
                  {characterStats.current}/{MAX_CHARS}
                </span>
              </div>
            </div>
          </div>
        </div>

        <Divider className="my-4" />

        <div className="flex items-center justify-between">
          <RatingStars 
            rating={rating} 
            onRatingChange={handleRating}
          />
          <Button 
            color="primary"
            variant="flat"
            onClick={handleSubmit}
            isDisabled={characterStats.isOverLimit || isSubmitting}
            isLoading={isSubmitting}
            startContent={
              !isSubmitting && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-4 h-4"
                >
                  <path d="M22 2L11 13" />
                  <path d="M22 2L15 22L11 13L2 9L22 2Z" />
                </svg>
              )
            }
          >
            {isSubmitting ? 'Enviando...' : 'Enviar valoración'}
          </Button>
        </div>
      </CardBody>
    </Card>
  );
};

export default Valoration;