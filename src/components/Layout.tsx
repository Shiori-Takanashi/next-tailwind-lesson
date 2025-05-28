import Header from "./Header";
import Footer from "./Footer";
import { ReactNode } from "react";
import styles from "../styles/Layout.module.css";

type HeaderPropsForLayout = {
    mainTitle: string;
    subTitle: string;
};

type LayoutProps = {
    children: ReactNode;
    showHeader?: boolean;
    showFooter?: boolean;
    headerProps?: HeaderPropsForLayout;
};

export default function Layout({ children, showHeader = true, showFooter = true, headerProps }: LayoutProps) {
    return (
        <div className={styles.layoutContainer}>
            {showHeader && headerProps && <Header {...headerProps} />}
            {children}
            {showFooter && <Footer />}
        </div>
    );
}
