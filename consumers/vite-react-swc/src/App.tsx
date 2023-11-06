import { RootDestructured } from "./components/Effect/RootDestructured"
import { RootWildcard } from "./components/Effect/RootWildcard"
import { SubpathDestructured } from "./components/Effect/SubpathDestructured"
import { SubpathWildcard } from "./components/Effect/SubpathWildcard"

function App() {
  return (
    <>
      <RootDestructured />
      <RootWildcard />
      <SubpathDestructured />
      <SubpathWildcard />
    </>
  )
}

export default App
