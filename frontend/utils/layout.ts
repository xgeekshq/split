import { ReactElement, ReactNode } from "react";

export interface GetLayoutProps {
    getLayout?: (page: ReactElement) => ReactNode;
}