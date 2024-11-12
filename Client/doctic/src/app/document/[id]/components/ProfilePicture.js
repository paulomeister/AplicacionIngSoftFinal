import { Avatar } from "@nextui-org/react";

const ProfilePicture = ({ username, imgSrc }) => (
  <div className="flex items-center gap-2">
    <Avatar src={imgSrc} size="lg" alt={username} />
    <span className="font-semibold">{username}</span>
  </div>
);

export default ProfilePicture;
