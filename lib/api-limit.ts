import User from "../models/user";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"

interface User {
  id: string
  name: string
  email: string
  image: string
}

export const getApiLimit = async () => {
  const session = await getServerSession(authOptions);

  if (!session) {
    return false;
  }

  const user = session.user as User;

  const userApiLimit = await User.findOne({ email: user.email });

  if (!userApiLimit) return false;

  return userApiLimit.apiLimit;
};

export const decrementApiLimit = async () => {
  const session = await getServerSession(authOptions);

  if (!session) {
    return false;
  }

  const user = session.user as User;
  await User.findOneAndUpdate({ email: user.email }, { $inc: { apiLimit: -1 } });
}