import { UserInterface } from "./user";

export interface ChatMessageInterface {
    _id: string;
    sender: Pick<UserInterface, "id" | "firstName" | "lastName" | "createdAt" | "profileImage" | "email">;
    content: string;
    chat: string;
    createdAt: string;
    updatedAt: string;
  }