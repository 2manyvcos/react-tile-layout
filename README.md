# React-Tile-Layout

React-Tile-Layout is a grid layout for dynamically configurable tiles which is based on [React-Grid-Layout][https://npmjs.com/package/react-grid-layout]

## Installation

Install the [React-Tile-Layout package](https://npmjs.com/package/react-tile-layout):

```sh
npm install react-grid-layout
```

Include the following stylesheets in your application:

```txt
/node_modules/react-grid-layout/css/styles.css
/node_modules/react-resizable/css/styles.css
```

## Usage

```tsx
import React from "react";
import { TileLayout, Tile, ReactTileLayout } from "react-tile-layout";

const breakpoints = { lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 };
const cols = { lg: 12, md: 10, sm: 8, xs: 6, xxs: 4 };

export default function App() {
  return (
    <TileLayout
      tileComponent={TileComponent}
      breakpoints={breakpoints}
      cols={cols}
    >
      <Tile name="Tile 1" layout={{ w: 2, h: 1, static: true }} />
      <Tile name="Tile 2" layout={{ w: 2, h: 2, minW: 1, maxW: 2 }} />
      <Tile name="Tile 3" layout={{ w: 1, h: 1 }} someProp="Hello" />
      <Tile name="Tile 4" layout={{ w: 1, h: 1 }} disabled />
    </TileLayout>
  );
}

const TileComponent = React.forwardRef(
  (
    {
      name,
      layoutSpec,
      someProp,
      children,
      ...props
    }: ReactTileLayout.TileComponentProps & {
      someProp?: string;
    },
    ref: React.Ref<HTMLDivElement>
  ) => {
    return (
      <div
        {...props}
        style={{
          ...props.style,
          border: "1px solid red",
        }}
        ref={ref}
      >
        {children}
        {name} - {someProp || "default"}
      </div>
    );
  }
);
```

You can find a working example on [GitHub](https://github.com/hatsuo/react-tile-layout/blob/master/src/App.tsx).

Simply clone the project and run the following commands:

```sh
npm install
npm start
```
