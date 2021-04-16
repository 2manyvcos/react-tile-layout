import React from "react";
import "./App.css";
import { Tile, TileLayout } from "./components";
import "react-resizable/css/styles.css";
import "react-grid-layout/css/styles.css";
import { ReactTileLayout } from "./components/types";

const breakpoints = { lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 };
const cols = { lg: 12, md: 10, sm: 8, xs: 6, xxs: 4 };

function App() {
  const [isDisabled, setDisabled] = React.useState(false);

  return (
    <div className="App">
      <header>
        Edit <strong>src/App.tsx</strong> to start testing your components!
      </header>

      <section>
        <b>Put your components here:</b>
        <br />
        <br />
        <button
          onClick={() => {
            setDisabled((prev) => !prev);
          }}
        >
          test2 disabled [{isDisabled ? "x" : "_"}]
        </button>
        👇🏻
        <TileLayout
          className="layout"
          tileComponent={SomeComponent}
          breakpoints={breakpoints}
          cols={cols}
          rowHeight={60}
        >
          <Tile name="test1" layout={{ w: 1, h: 1 }} />
          <Tile name="test2" layout={{ w: 1, h: 1 }} />
          <Tile name="test3" layout={{ w: 1, h: 1 }} />
          <Tile name="test4" layout={{ w: 1, h: 1 }} />
          <Tile name="test5" layout={{ w: 1, h: 1 }} />
          <Tile name="test6" layout={{ w: 1, h: 1 }} />
        </TileLayout>
      </section>
    </div>
  );
}

export default App;

const SomeComponent = React.forwardRef(
  (
    {
      name,
      layoutSpec,
      children,
      ...props
    }: ReactTileLayout.TileComponentProps,
    ref: React.Ref<HTMLDivElement>
  ) => {
    return (
      <div {...props} ref={ref}>
        {name}
        <br />
        {children}
      </div>
    );
  }
);
