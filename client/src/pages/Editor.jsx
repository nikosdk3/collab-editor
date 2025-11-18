import { useParams } from "react-router-dom";

const Editor = () => {
  const { id } = useParams();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-4 text-2xl font-bold">Editor - Document Id: {id}</h1>
      <p className="text-gray-600">TODO</p>
    </div>
  );
};

export default Editor;
