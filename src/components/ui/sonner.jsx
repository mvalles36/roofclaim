import { useTheme } from "next-themes";
import { Toaster as Sonner } from "sonner";

// Additional props can be added for customization in the future
const Toaster = ({
  position = "top-right",
  duration = 3000,
  ...props
}) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme}
      position={position}
      duration={duration}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
