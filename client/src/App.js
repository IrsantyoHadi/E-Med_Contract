import BasicRoute from './router';
import drizzle from './drizzleInit';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return <BasicRoute drizzle={drizzle} />;
}

export default App;
