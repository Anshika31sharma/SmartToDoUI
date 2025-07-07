import { ToastContainer } from "react-toastify";
import Home from "./pages/Home";

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-100 to-purple-200">
      <ToastContainer position="top-right" />
      <Home />
    </div>
  );
}
