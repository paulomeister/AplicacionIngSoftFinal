import { useState, useMemo } from 'react';
import { Card, CardBody, Button, Textarea, Tooltip, Progress, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@nextui-org/react';
import { Star } from "lucide-react";
import { FaEdit, FaTrash } from "react-icons/fa";
const MAX_CHARS = 230;
import "./avatar.css"

const RatingStars = ({ rating, onRatingChange }) => {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-default-600 mr-2">Valoración:</span>
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
    </div>
  );
};

const CommentItem = ({ comment, currentUserId, onEdit, onDelete }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedContent, setEditedContent] = useState(comment.content || '');
    const [editedRating, setEditedRating] = useState(comment.rating);
    const [errorMessage, setErrorMessage] = useState('');
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const isOwner = currentUserId === comment.userId;

    const characterStats = useMemo(() => {
      const charsWithoutSpaces = editedContent.replace(/\s/g, '').length;
      const percentage = (charsWithoutSpaces / MAX_CHARS) * 100;
      const remaining = MAX_CHARS - charsWithoutSpaces;

      return {
        current: charsWithoutSpaces,
        percentage: Math.min(percentage, 100),
        remaining: Math.max(remaining, 0),
        isOverLimit: charsWithoutSpaces > MAX_CHARS
      };
    }, [editedContent]);

    const handleSaveEdit = () => {
      if (characterStats.isOverLimit || !editedContent.trim()) {
        setErrorMessage('El comentario no puede estar vacío o exceder el límite de caracteres.');
        return;
      }
      onEdit(comment.userId, editedContent, editedRating);
      setIsEditing(false);
      setErrorMessage('');
    };

    const handleDeleteClick = () => {
      console.log("Abriendo modal de confirmación");
      setShowDeleteModal(true);
    };

    const handleConfirmDelete = () => {
      console.log("Confirmando eliminación del comentario del usuario:", comment.userId);
      if (onDelete) {
        onDelete(comment.userId);
      }
      setShowDeleteModal(false);
    };

    const handleCancelEdit = () => {
      setEditedContent(comment.content);
      setEditedRating(comment.rating);
      setIsEditing(false);
      setErrorMessage('');
    };

    const handleCommentChange = (e) => {
      const newValue = e.target.value;
      const charsWithoutSpaces = newValue.replace(/\s/g, '').length;
      setEditedContent(newValue);

      if (charsWithoutSpaces > MAX_CHARS) {
        setErrorMessage(`Has excedido el límite de ${MAX_CHARS} caracteres`);
      } else {
        setErrorMessage('');
      }
    };

    return (
      <Card className="w-full">
        <CardBody className="p-4">
          <div className="flex gap-4">
            <img src={comment.avatarUrl} alt="Avatar" className="avatar" />

            <div className="flex-grow space-y-2">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-default-700">{comment.userName}</h4>
                    <span className="text-small text-default-400">•</span>
                    <span className="text-small text-default-400">
                      {new Date(comment.createdAt).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                  {!isEditing ? (
                    <RatingStars rating={comment.rating} onRatingChange={() => {}} />
                  ) : (
                    <RatingStars rating={editedRating} onRatingChange={setEditedRating} />
                  )}
                </div>

                {isOwner && !isEditing && (
                  <div className="flex gap-2">
                    <Tooltip content="Editar comentario">
                      <Button isIconOnly size="sm" variant="light" onClick={() => setIsEditing(true)}>
                        <FaEdit className="w-4 h-4" />
                      </Button>
                    </Tooltip>
                    <Tooltip content="Eliminar comentario" color="danger">
                      <Button
                        isIconOnly
                        size="sm"
                        variant="light"
                        color="danger"
                        onClick={handleDeleteClick}
                      >
                        <FaTrash className="w-4 h-4" />
                      </Button>
                    </Tooltip>
                  </div>
                )}
              </div>

              {isEditing ? (
                <div className="space-y-3">
                  <Textarea
                    value={editedContent}
                    onChange={handleCommentChange}
                    minRows={2}
                    classNames={{ base: "w-full", input: "resize-none" }}
                  />
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

                  {errorMessage && <p className="text-sm text-danger">{errorMessage}</p>}
                  <div className="flex justify-end gap-2">
                    <Button size="sm" variant="light" onClick={handleCancelEdit}>
                      Cancelar
                    </Button>
                    <Button size="sm" color="primary" onClick={handleSaveEdit} isDisabled={characterStats.isOverLimit}>
                      Guardar cambios
                    </Button>
                  </div>
                </div>
              ) : (
                <p className="text-default-600">{comment.content}</p>
              )}
            </div>
          </div>

          <Modal 
            isOpen={showDeleteModal} 
            onOpenChange={(open) => setShowDeleteModal(open)}
            placement="center"
          >
            <ModalContent>
              {(onClose) => (
                <>
                  <ModalHeader className="flex flex-col gap-1">
                    Confirmar eliminación
                  </ModalHeader>
                  <ModalBody>
                    <p>¿Estás seguro de que deseas eliminar este comentario?</p>
                  </ModalBody>
                  <ModalFooter>
                    <Button 
                      variant="light" 
                      onPress={onClose}
                    >
                      Cancelar
                    </Button>
                    <Button
                      color="danger"
                      onPress={() => {
                        handleConfirmDelete();
                        onClose();
                      }}
                    >
                      Eliminar
                    </Button>
                  </ModalFooter>
                </>
              )}
            </ModalContent>
          </Modal>
        </CardBody>
      </Card>
    );
};

const CommentsList = ({ comments, currentUserId, onEditComment, onDeleteComment }) => {
  console.log("CommentsList props:", { comments, currentUserId, onEditComment, onDeleteComment });
  return (
    <div className="space-y-4">
      {comments.map(comment => (
        <CommentItem
          key={comment.userId}
          comment={comment}
          currentUserId={currentUserId}
          onEdit={onEditComment}
          onDelete={onDeleteComment}
        />
      ))}
    </div>
  );
};

export { CommentItem, CommentsList };