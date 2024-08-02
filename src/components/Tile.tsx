import { produce } from "immer";
import React from "react";
import { UpdateContext } from "./context";
import { ReactTileLayout } from "./types";
import { shallowEquals } from "./utils";

interface TileProps extends ReactTileLayout.TileDefinitionProps {
  name: string;
  layout: ReactTileLayout.TileLayout;
  disabled?: boolean;
}

const Tile = React.memo(
  ({ name, layout, disabled, ...props }: TileProps) => {
    if (!name) {
      throw new Error("Error in tile: Name is required");
    }
    const prevNameRef = React.useRef(name);
    const prevName = prevNameRef.current;
    prevNameRef.current = name;
    if (prevName !== name) {
      throw new Error(
        `Error in tile: The name prop must not be changed! ("${prevName.replace(
          /"/g,
          '\\"'
        )}" => "${name.replace(/"/g, '\\"')}")`
      );
    }

    const setTile = React.useContext(UpdateContext);

    React.useEffect(() => {
      setTile(name, (tile) => {
        if (tile == null) {
          return {
            layout,
            disabled: !!disabled,
            props,
          };
        }

        return produce(tile, (draft) => {
          if (!shallowEquals(draft.layout, layout)) {
            draft.layout = layout;
          }
          draft.disabled = !!disabled;
          if (!shallowEquals(draft.props, props)) {
            draft.props = props;
          }
        });
      });
    }, [name, setTile, layout, disabled, props]);

    React.useEffect(() => () => setTile(name, undefined), [name, setTile]);

    return null;
  },
  ({ layout, ...rest }, { layout: nextLayout, ...nextRest }) => {
    return shallowEquals(layout, nextLayout) && shallowEquals(rest, nextRest);
  }
);

export default Tile;
