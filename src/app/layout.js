import 'bootstrap/dist/css/bootstrap.min.css'
import "./style.css";

export const metadata = {
  title: "Only Content",
  description: "Pay and get access to exclusive content from your favourite creator",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
