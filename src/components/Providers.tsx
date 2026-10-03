"use client";

import {
  BorderStyle,
  IconProvider,
  LayoutProvider,
  NeutralColor,
  ScalingSize,
  Schemes,
  SolidStyle,
  SolidType,
  SurfaceStyle,
  ThemeProvider,
  ToastProvider,
  TransitionStyle,
} from "@once-ui-system/core";
import { style } from "../resources";
import { iconLibrary } from "../resources/icons";

// Once UI context for the pages not yet migrated to src/ui. Removed in step D.
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <LayoutProvider>
      <ThemeProvider
        theme="dark"
        brand={style.brand as Schemes}
        accent={style.accent as Schemes}
        neutral={style.neutral as NeutralColor}
        solid={style.solid as SolidType}
        solidStyle={style.solidStyle as SolidStyle}
        border={style.border as BorderStyle}
        surface={style.surface as SurfaceStyle}
        transition={style.transition as TransitionStyle}
        scaling={style.scaling as ScalingSize}
      >
        <ToastProvider>
          <IconProvider icons={iconLibrary}>{children}</IconProvider>
        </ToastProvider>
      </ThemeProvider>
    </LayoutProvider>
  );
}
