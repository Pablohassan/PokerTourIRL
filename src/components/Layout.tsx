import React, { ReactNode } from 'react';
import { Content } from "./Content"
import { Box } from "./Box.js";


interface LayoutProps {
  children: ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => (
  <Box
    css={{
      maxW: '100%',
    }}
  >
    {children}
    <Content />
  </Box>
);