import Home from './components/home/Home';
import Sidebar from '/components/sidebar/Sidebar'

function App() {
  return (
    <div className="app">
      <Home />
      <div className="container">
        <Topbar />
        <Sidebar />
        </div>
    </div>
  );
}

export default App;
