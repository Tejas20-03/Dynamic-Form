import Form from "./components/Form";
import data from "./data.json";

function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Form formTitle={data.formTitle} formFields={data.formFields} />
    </div>
  );
}

export default App;
