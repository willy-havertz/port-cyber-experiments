import { Toaster } from "sonner";

export default function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      richColors
      theme="dark"
      expand
      closeButton
      style={{
        fontFamily: "inherit",
      }}
      toastOptions={{
        duration: 3000,
        style: {
          background: "rgba(30, 41, 59, 0.9)",
          border: "1px solid rgba(6, 182, 212, 0.3)",
          color: "#f1f5f9",
        },
      }}
    />
  );
}
