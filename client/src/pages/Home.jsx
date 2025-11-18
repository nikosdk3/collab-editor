import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-4 text-4xl font-bold">Collaborative Document Editor</h1>
      <p className="mb-8 text-gray-600">
        Create and edit documents in real-time with others
      </p>
      <Link
        to="/document/test-doc"
        className="rounded-lg bg-blue-600 px-6 py-3 text-white transition-colors hover:bg-blue-700"
      >
        Create New Document
      </Link>
    </div>
  );
};

export default Home;
