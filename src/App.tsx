import React from "react";

import { Tile, TileLayout } from "./components";
import { ReactTileLayout } from "./components/types";

import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

const breakpoints = { lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 };
const cols = { lg: 12, md: 10, sm: 8, xs: 6, xxs: 4 };

function App() {
  return (
    <TileLayout
      style={{ border: "1px dashed gray" }}
      tileComponent={TileComponent}
      breakpoints={breakpoints}
      cols={cols}
      rowHeight={60}
    >
      {/*
        Tiles can be rendered in any depth inside of <TileLayout>, as they use React's context API.
        However, the order is determined by the order in which the <Tile> components were rendered.
      */}
      <Tile name="Tile 1" layout={{ w: 2, h: 1, static: true }} />
      <Tile name="Tile 2" layout={{ w: 2, h: 2, minW: 1, maxW: 2 }} />
      <Tile name="Tile 3" layout={{ w: 1, h: 1 }} someProp="Hello" />
      {/*
        You can temporarily remove specific tiles based on your own logic by using the disabled prop.
        The tile's layout configuration and order is being preserved as long as the <Tile> component
        itself is not unmounted.
        However, React-Grid-Layout uses a mechanism to automatically compact the layout, which may
        result in unexpected placement changes.
       */}
      <Tile name="Tile 4" layout={{ w: 1, h: 1 }} disabled />
    </TileLayout>
  );
}

const TileComponent = React.forwardRef(
  (
    {
      name,
      layoutSpec,
      props: { someProp },
      children,
      ...rest
    }: ReactTileLayout.TileComponentProps,
    ref: React.Ref<HTMLDivElement>
  ) => {
    return (
      <div
        {...rest}
        style={{
          ...rest.style,
          border:
            layoutSpec.static || layoutSpec.isDraggable === false
              ? "1px solid blue"
              : "1px solid red",
        }}
        ref={ref}
      >
        {children}
        {name} - {someProp || "default"}
      </div>
    );
  }
);

export default App;
