import { useParams } from "react-router-dom";
import CollaborativeEditor from "../components/Editor/CollaborativeEditor";

const Editor = () => {
  const { id } = useParams();

  return (
    <CollaborativeEditor
      documentId={id}
      initialContent="Start typing..."
      initialTitle="Untitled document"
    />
  );
};

export default Editor;
