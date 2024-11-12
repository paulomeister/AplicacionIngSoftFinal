import { Button, Input } from "@nextui-org/react";
import ProfilePicture from "./ProfilePicture";
import { useState } from "react";

const CommentSection = ({ comments, onDelete, onAddComment }) => {
  const [newComment, setNewComment] = useState("");

  const handleAddComment = () => {
    onAddComment(newComment);
    setNewComment("");
  };

  return (
    <div className="space-y-4">
      {comments.map((comment, index) => (
        <div key={index} className="p-4 border rounded-lg shadow-md">
          <ProfilePicture username={comment.username} imgSrc={comment.imgSrc} />
          <p className="text-gray-700 mt-2">{comment.text}</p>
          <div className="flex justify-end gap-2 mt-4">
            <Button size="sm" color="error" onClick={() => onDelete(index)}>
              Delete
            </Button>
          </div>
        </div>
      ))}
      
      {/* Campo para añadir un nuevo comentario */}
      <div className="mt-4">
        <Input
          clearable
          underlined
          placeholder="Add a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="w-full"
        />
        <Button size="sm" color="primary" onClick={handleAddComment} className="mt-2">
          Send
        </Button>
      </div>
    </div>
  );
};

export default CommentSection;
