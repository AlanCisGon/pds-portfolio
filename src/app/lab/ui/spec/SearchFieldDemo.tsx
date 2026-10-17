"use client";

import { SearchField, type SearchFieldProps } from "@/ui";
import { useState } from "react";

/** SearchField con estado propio para el lab (el componente es controlado). */
export function SearchFieldDemo(
  props: Omit<SearchFieldProps, "value" | "onChange" | "label"> & {
    initial?: string;
    label?: string;
  },
) {
  const { initial = "", label = "Buscar componentes", ...rest } = props;
  const [value, setValue] = useState(initial);
  return (
    <SearchField
      label={label}
      placeholder="Buscar por nombre o uso"
      value={value}
      onChange={setValue}
      {...rest}
    />
  );
}
