"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";

export function AmountInput({
  value,
  onChange,
  className,
}: {
  value: number;
  onChange: (val: number) => void;
  className?: string;
}) {
  const [localValue, setLocalValue] = useState(value === 0 ? "" : value.toString());

  useEffect(() => {
    const parsed = parseFloat(localValue);
    const isEquivalent =
      value === parsed ||
      (value === 0 && localValue === "") ||
      (value === 0 && isNaN(parsed));

    if (!isEquivalent) {
      setLocalValue(value === 0 ? "" : value.toString());
    }
  }, [value, localValue]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalValue(e.target.value);
    const parsed = parseFloat(e.target.value);
    onChange(isNaN(parsed) ? 0 : parsed);
  };

  return (
    <Input
      type="number"
      value={localValue}
      onChange={handleChange}
      className={className}
      placeholder="0"
    />
  );
}
