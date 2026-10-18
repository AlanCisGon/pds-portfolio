"use client";

import { Chip } from "@/sds";
import { ViewGrid } from "iconoir-react";

/** Chip removible para la anatomía: el handler tiene que vivir en el cliente. */
export function ChipRemovable({ label }: { label: string }) {
  return <Chip label={label} leadingIcon={<ViewGrid />} onRemove={() => {}} />;
}
