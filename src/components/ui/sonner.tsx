"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner, ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      position="top-center"
      icons={true as any}
      toastOptions={{
        classNames: {
          toast:
            "bg-orange-500 text-white border border-orange-600 shadow-lg rounded-md",
          title: "text-white font-semibold",
          description: "text-white/90 text-sm",
          closeButton: "text-white hover:text-gray-100",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
