import "./App.css";
import { MyComponent } from "./components";

function App() {
  return (
    <div className="App">
      <header>
        Edit <strong>src/App.tsx</strong> to start testing your components!
      </header>

      <section>
        <b>Put your components here:</b>
        <br />
        <br />

        <MyComponent name="MyComponent" />
      </section>
    </div>
  );
}

export default App;
