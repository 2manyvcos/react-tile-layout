import React from "react";
import { ReactTileLayout } from "./types";

type TileContextValue = ReactTileLayout.Dictionary<
  string,
  ReactTileLayout.TileDefinition
>;

const tileContextDefaultValue: TileContextValue = {};

export const TileContext = React.createContext(tileContextDefaultValue);

type UpdateContextValue = {
  (name: string, valueOrResolver: ReactTileLayout.TileValueOrResolver): void;
};

const updateContextDefaultValue: UpdateContextValue = () => {
  throw new Error("A tile was rendered outside of a TileLayout");
};

export const UpdateContext = React.createContext(updateContextDefaultValue);
