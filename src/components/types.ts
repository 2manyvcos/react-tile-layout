export namespace ReactTileLayout {
  export type Dictionary<K extends keyof any, T> = Partial<Record<K, T>>;

  export type Breakpoints = { [P: string]: number };

  export type TileLayout = {
    [Key in keyof ReactGridLayout.Layout as Exclude<
      Key,
      "i" | "x" | "y"
    >]: ReactGridLayout.Layout[Key];
  } & {
    override?: number | string;
  };

  export interface TileDescription {
    layout: TileLayout;
    disabled: boolean;
  }

  export type TileDefinitionProps = Dictionary<string, any>;

  export interface TileDefinition extends TileDescription {
    props: TileDefinitionProps;
  }

  export type NullableTileDefinition = TileDefinition | undefined;

  export type TileValueOrResolver =
    | NullableTileDefinition
    | ((previous: NullableTileDefinition) => NullableTileDefinition);

  export type TileComponentProps = Dictionary<string, any> & {
    name: string;
    layoutSpec: TileLayout;
    props: TileDefinitionProps;
  };
}
