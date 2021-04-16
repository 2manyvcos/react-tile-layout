import produce from "immer";
import React from "react";
import { Responsive } from "react-grid-layout";
import { SizeMe } from "react-sizeme";
import { TileContext, UpdateContext } from "./context";
import { ReactTileLayout } from "./types";
import { def, shallowEquals } from "./utils";

function initializeLayout(
  initialLayout: ReactGridLayout.Layouts,
  breakpoints: ReactTileLayout.Breakpoints
): ReactGridLayout.Layouts {
  const sortedBreakpoints = Object.keys(breakpoints).sort(
    (a, b) => breakpoints[b] - breakpoints[a]
  );

  const referenceBreakpoint = sortedBreakpoints.find(
    (key) => initialLayout[key] != null
  );
  let referenceLayout: ReactGridLayout.Layout[];
  if (referenceBreakpoint) referenceLayout = initialLayout[referenceBreakpoint];
  else {
    const firstLayout = Object.values(initialLayout).find(
      (item) => item != null
    );
    if (firstLayout) referenceLayout = firstLayout;
    else referenceLayout = [];
  }

  const result: ReactGridLayout.Layouts = {};
  sortedBreakpoints.forEach((key) => {
    const layout =
      initialLayout[key] || referenceLayout.map((item) => ({ ...item }));
    result[key] = layout;
    referenceLayout = layout;
  });
  return result;
}

function normalizeLayoutItem(
  item: ReactGridLayout.Layout
): ReactGridLayout.Layout {
  return produce(item, (draft) => {
    draft.w = Math.max(
      def(item.minW, 0),
      Math.min(item.w, def(item.maxW, Infinity))
    );
    draft.h = Math.max(
      def(item.minH, 0),
      Math.min(item.h, def(item.maxH, Infinity))
    );
  });
}

type TileLayoutProps = {
  [Key in keyof ReactGridLayout.ResponsiveProps as Exclude<
    Key,
    "layouts" | "width" | "onLayoutChange"
  >]: ReactGridLayout.ResponsiveProps[Key];
} & {
  initialLayout?: ReactGridLayout.Layouts;
  onChangeLayout?: (layouts: ReactGridLayout.Layouts) => void;
  onSaveLayout?: (layouts: ReactGridLayout.Layouts) => void;
  tileComponent: React.ComponentType<ReactTileLayout.TileComponentProps>;
  breakpoints: ReactTileLayout.Breakpoints;
  children: React.ReactNode;
};

const TileLayout = React.memo(
  ({
    initialLayout,
    onChangeLayout,
    onSaveLayout,
    tileComponent,
    breakpoints: initialBreakpoints,
    isResizable = true,
    isBounded = true,
    children,
    ...rest
  }: TileLayoutProps) => {
    const [
      { breakpoints, names, layout, definitions },
      setState,
    ] = React.useState<{
      breakpoints: ReactTileLayout.Breakpoints;
      names: string[];
      layout: ReactGridLayout.Layouts;
      definitions: ReactTileLayout.Dictionary<
        string,
        ReactTileLayout.TileDefinition
      >;
    }>(() => ({
      breakpoints: initialBreakpoints,
      names: [],
      layout: initializeLayout(initialLayout || {}, initialBreakpoints),
      definitions: {},
    }));

    const setTile = React.useCallback(
      (name: string, valueOrResolver: ReactTileLayout.TileValueOrResolver) => {
        if (!name) throw new Error("Could not set tile: Name is required");
        setState((prevState) =>
          produce(prevState, (draft) => {
            const prevValue = draft.definitions[name];
            const nextValue =
              typeof valueOrResolver === "function"
                ? valueOrResolver(prevValue)
                : valueOrResolver;
            if (prevValue === nextValue) return;
            if (nextValue == null) {
              delete draft.definitions[name];
              Object.keys(draft.layout).forEach((key) => {
                const index = draft.layout[key].findIndex(
                  (item) => item.i === name
                );
                if (index !== -1) {
                  draft.layout[key].splice(index, 1);
                }
              });
            } else {
              draft.definitions[name] = nextValue;
              Object.keys(draft.layout).forEach((key) => {
                const {
                  override,
                  w,
                  h,
                  minW,
                  maxW,
                  minH,
                  maxH,
                  ...rest
                } = nextValue.layout;
                const isStatic =
                  !isResizable || rest.static || rest.isResizable === false;
                const index = draft.layout[key].findIndex(
                  (item) => item.i === name
                );
                if (index === -1) {
                  draft.layout[key].push(
                    normalizeLayoutItem({
                      i: name,
                      x: 0,
                      y: 0,
                      w,
                      h,
                      minW: isStatic ? w : minW,
                      maxW: isStatic ? h : maxW,
                      minH: isStatic ? w : minH,
                      maxH: isStatic ? h : maxH,
                      ...rest,
                    })
                  );
                } else {
                  const prevItem = draft.layout[key][index];
                  const overrideChanged =
                    prevValue?.layout.override !== override;
                  const nextItem = normalizeLayoutItem({
                    i: prevItem.i,
                    x: prevItem.x,
                    y: prevItem.y,
                    w:
                      prevValue?.layout.w !== w || overrideChanged
                        ? w
                        : prevItem.w,
                    h:
                      prevValue?.layout.h !== h || overrideChanged
                        ? h
                        : prevItem.h,
                    minW: isStatic ? w : minW,
                    maxW: isStatic ? h : maxW,
                    minH: isStatic ? w : minH,
                    maxH: isStatic ? h : maxH,
                    ...rest,
                  });
                  if (!shallowEquals(prevItem, nextItem)) {
                    draft.layout[key][index] = nextItem;
                  }
                }
              });
            }
            if (
              (prevValue == null) !== (nextValue == null) ||
              !!prevValue?.disabled !== !!nextValue?.disabled
            ) {
              draft.names = Object.keys(draft.definitions).filter(
                (name) => !draft.definitions[name]?.disabled
              );
            }
          })
        );
      },
      [isResizable]
    );

    const onLayoutChange = React.useCallback(
      (
        currentLayout: ReactGridLayout.Layout[],
        layouts: ReactGridLayout.Layouts
      ) => {
        setState((prevState) => {
          const nextState = produce(prevState, (draft) => {
            Object.keys(draft.layout).forEach((key) => {
              if (layouts[key] == null) return;
              const mapping: ReactTileLayout.Dictionary<
                string,
                ReactGridLayout.Layout
              > = {};
              layouts[key].forEach((item) => {
                mapping[item.i] = item;
              });
              draft.layout[key].forEach((prevItem, index) => {
                const item = mapping[prevItem.i];
                if (item == null) return;
                draft.layout[key][index] = normalizeLayoutItem(
                  produce(prevItem, (itemDraft) => {
                    itemDraft.x = item.x;
                    itemDraft.y = item.y;
                    itemDraft.w = item.w;
                    itemDraft.h = item.h;
                    itemDraft.moved = item.moved;
                  })
                );
              });
            });
          });
          if (prevState.layout !== nextState.layout && onChangeLayout) {
            onChangeLayout(nextState.layout);
          }
          return nextState;
        });
      },
      [onChangeLayout]
    );

    const gridLayouts = React.useMemo(
      () =>
        produce(layout, (draft) => {
          const map: ReactTileLayout.Dictionary<string, boolean> = {};
          names.forEach((name) => {
            map[name] = true;
          });
          Object.keys(draft).forEach((key) => {
            const f = draft[key].filter((item) => item.i in map);
            if (draft[key].length !== f.length) draft[key] = f;
          });
        }),
      [layout, names]
    );

    const nodes = React.useMemo(
      () =>
        names.length > 0
          ? names.map((name) => {
              return (
                <TileResolver
                  component={tileComponent}
                  key={name}
                  name={name}
                />
              );
            })
          : null,
      [names, tileComponent]
    );

    return (
      <>
        <UpdateContext.Provider value={setTile}>
          {children}
        </UpdateContext.Provider>

        <TileContext.Provider value={definitions}>
          <SizeMe>
            {({ size }) => (
              <Responsive
                {...rest}
                layouts={gridLayouts}
                width={size.width || 0}
                breakpoints={breakpoints}
                isResizable={isResizable}
                isBounded={isBounded}
                onLayoutChange={onLayoutChange}
              >
                {nodes}
              </Responsive>
            )}
          </SizeMe>
        </TileContext.Provider>
      </>
    );
  }
);

export default TileLayout;

type TileResolverProps = {
  component: React.ComponentType<
    ReactTileLayout.TileComponentProps & { ref?: React.Ref<any> }
  >;
  name: string;
};

const TileResolver = React.forwardRef(
  (
    { component: Component, name, ...rest }: TileResolverProps,
    ref: React.Ref<any>
  ) => {
    const tiles = React.useContext(TileContext);
    const { layout, props } = tiles[name]!;

    return (
      <Component
        {...props}
        {...rest}
        ref={ref}
        name={name}
        layoutSpec={layout}
      />
    );
  }
);
