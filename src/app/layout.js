import { config } from "@fortawesome/fontawesome-svg-core";
import React from 'react';
import './global.css';
import "@fortawesome/fontawesome-svg-core/styles.css";

config.autoAddCss = false;

const RootLayout = ({ children }) => {
    return (
        <html lang="en-us" dir="ltr">
            <head>
                <link rel="preconnect" href="https://use.typekit.net/bvh8qbs.css" as="style" crossOrigin="anonymous" />
                <link  rel="stylesheet" href="https://use.typekit.net/bvh8qbs.css" crossOrigin="anonymous" />
            </head>
            {children}
        </html>
    );
};

export default RootLayout;
