import DynamicForm from "./components/DynamicForm";
import data from "./data.json";

function App() {
  return (
    <div className="border p-4 bg-blue-400 shadow-md">
      <DynamicForm formTitle={data.formTitle} formFields={data.formFields} />
    </div>
  );
}

export default App;
