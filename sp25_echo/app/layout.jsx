import './globals.css'
import {noto_serif} from "@/app/ui/fonts";
import Footer from "@/app/components/footer";
import { AuthProvider } from "@/app/config/AuthContext";
import { CartProvider } from "@/app/config/CartContext";
import NavbarSelector from "@/app/components/NavbarSelector";
import { MantineProvider } from '@mantine/core';
import '@mantine/dates/styles.css';
import '@mantine/core/styles.css';
export const metadata = {
  title: "Rolls By The Pound",
  description: "Local Bakery Rolls By The Pound",
};

export default function RootLayout({ children }) {
  return (
      <html lang="en">
      <body className={`${noto_serif.className} antialiased`}>
      <AuthProvider>
          <CartProvider>
              <MantineProvider withGlobalStyles withNormalizeCSS>
                  <NavbarSelector />
                  {children}
                  <Footer />
              </MantineProvider>
          </CartProvider>
      </AuthProvider>
      </body>
      </html>
  );
}
