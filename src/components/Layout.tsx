import Header from "./Header";
import Footer from "./Footer";
import { ReactNode, CSSProperties } from "react";

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

const styles: Record<string, CSSProperties> = {
    layoutContainer: {
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
    },
};

export default function Layout({ children, showHeader = true, showFooter = true, headerProps }: LayoutProps) {
    return (
        <div style={styles.layoutContainer}>
            {showHeader && (
                <Header
                    mainTitle={headerProps?.mainTitle || ""}
                    subTitle={headerProps?.subTitle || ""}
                />
            )}
            {children}
            {showFooter && <Footer />}
        </div>
    );
}
