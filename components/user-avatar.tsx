'use client'
import { useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const UserAvatar = () => {
  const image = useSession().data?.user?.image;
  const letter = useSession().data?.user?.name?.charAt(0);

  if (image) {
    return (
      <Avatar className="h-8 w-8">
        <AvatarImage src={image} />
        <AvatarFallback>
          {letter}
        </AvatarFallback>
      </Avatar>
    )
  }


};