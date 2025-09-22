"use client";

import * as React from "react";
import { RadioGroup as RadioGroupPrimitive } from "radix-ui";
import { motion, type HTMLMotionProps } from "motion/react";

import { getStrictContext } from "@/lib/get-strict-context";
import { useControlledState } from "@/hooks/use-controlled-state";

type RadioGroupContextType = {
  value: string;
  setValue: (value: string) => void;
};

const [RadioGroupProvider, useRadioGroup] =
  getStrictContext<RadioGroupContextType>("RadioGroupContext");

type RadioGroupProps = HTMLMotionProps<"div"> &
  Omit<React.ComponentProps<typeof RadioGroupPrimitive.Root>, "asChild">;

function RadioGroup({
  defaultValue,
  value,
  onValueChange,
  disabled,
  required,
  name,
  ...props
}: RadioGroupProps) {
  const [currentValue, setCurrentValue] = useControlledState({
    value: value || undefined,
    defaultValue,
    onChange: onValueChange,
  });

  return (
    <RadioGroupProvider
      value={{ value: currentValue || "", setValue: setCurrentValue }}
    >
      <RadioGroupPrimitive.Root
        defaultValue={defaultValue}
        value={value}
        onValueChange={setCurrentValue}
        disabled={disabled}
        required={required}
        name={name}
        asChild
      >
        <motion.div data-slot="radio-group" {...props} />
      </RadioGroupPrimitive.Root>
    </RadioGroupProvider>
  );
}

type RadioGroupItemProps = HTMLMotionProps<"button"> &
  Omit<React.ComponentProps<typeof RadioGroupPrimitive.Item>, "asChild">;

function RadioGroupItem({
  value,
  disabled,
  required,
  ...props
}: RadioGroupItemProps) {
  return (
    <RadioGroupPrimitive.Item
      value={value}
      disabled={disabled}
      required={required}
      asChild
    >
      <motion.button
        data-slot="radio-group-item"
        whileTap={{ scale: 0.95 }}
        whileHover={{ scale: 1.05 }}
        {...props}
      />
    </RadioGroupPrimitive.Item>
  );
}

type RadioGroupIndicatorProps = HTMLMotionProps<"div">;

function RadioGroupIndicator(props: RadioGroupIndicatorProps) {
  return (
    <RadioGroupPrimitive.Indicator asChild>
      <motion.div
        data-slot="radio-group-indicator"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0, opacity: 0 }}
        transition={{ duration: 0.2 }}
        {...props}
      />
    </RadioGroupPrimitive.Indicator>
  );
}

export {
  RadioGroup,
  RadioGroupItem,
  RadioGroupIndicator,
  useRadioGroup,
  type RadioGroupProps,
  type RadioGroupItemProps,
  type RadioGroupIndicatorProps,
  type RadioGroupContextType,
};
