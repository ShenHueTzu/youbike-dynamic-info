import { REPO_PATH } from ".";

const prefix = process.env.NODE_ENV === "production" ? REPO_PATH : "";
export const icons: { [key: string]: string } = {
  close: `${prefix}/icons/close.png`,
};
