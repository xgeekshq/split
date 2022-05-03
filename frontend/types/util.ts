import { ReactNode } from "react";

export type WithChildren<P = {}> = P & { children?: ReactNode };
