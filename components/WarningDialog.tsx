"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
  DialogFooter,
} from "@/components/animate-ui/components/radix/dialog";
import { Trash, AlertTriangle } from "lucide-react";

interface WarningDialogProps {
  trigger?: React.ReactNode;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "destructive" | "warning" | "info";
  onConfirm?: () => void;
  onCancel?: () => void;
  children?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const WarningDialog = ({
  trigger,
  title = "Confirm Action",
  description = "Are you sure you want to proceed? This action cannot be undone.",
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "destructive",
  onConfirm,
  onCancel,
  children,
  open,
  onOpenChange,
}: WarningDialogProps) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleOpenChange = (openState: boolean) => {
    if (onOpenChange) {
      onOpenChange(openState);
    } else {
      setIsOpen(openState);
    }
  };

  const handleConfirm = () => {
    onConfirm?.();
    handleOpenChange(false);
  };

  const handleCancel = () => {
    onCancel?.();
    handleOpenChange(false);
  };

  const getIconAndColor = () => {
    switch (variant) {
      case "destructive":
        return {
          icon: Trash,
          titleColor: "text-red-600",
          buttonVariant: "destructive" as const,
        };
      case "warning":
        return {
          icon: AlertTriangle,
          titleColor: "text-yellow-600",
          buttonVariant: "destructive" as const,
        };
      case "info":
        return {
          icon: AlertTriangle,
          titleColor: "text-blue-600",
          buttonVariant: "default" as const,
        };
      default:
        return {
          icon: Trash,
          titleColor: "text-red-600",
          buttonVariant: "destructive" as const,
        };
    }
  };

  const { icon: Icon, titleColor, buttonVariant } = getIconAndColor();
  const dialogOpen = open !== undefined ? open : isOpen;

  return (
    <Dialog open={dialogOpen} onOpenChange={handleOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent
        from="bottom"
        showCloseButton={true}
        className="sm:max-w-[425px]"
      >
        <DialogHeader>
          <DialogTitle className={`flex items-center gap-2 ${titleColor}`}>
            <Icon className="h-5 w-5" />
            {title}
          </DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        {children && <div className="py-4">{children}</div>}

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" type="button" onClick={handleCancel}>
              {cancelText}
            </Button>
          </DialogClose>
          <Button variant={buttonVariant} onClick={handleConfirm}>
            <Icon className="h-4 w-4 mr-2" />
            {confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
