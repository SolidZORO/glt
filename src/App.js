import { DemoButton, Datatable } from '@/components';
import Cell from './components/Cell/Cell';
import ScrollContainer from './components/ScrollContainer/ScrollContainer';

function App() {
  return (
    <div className="App">
      {/* <DemoButton text="Demo" />
      <Datatable /> */}
      <Cell />
      <ScrollContainer />
    </div>
  );
}

export default App;
