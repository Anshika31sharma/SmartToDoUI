import { ToastContainer } from "react-toastify";
import Home from "./pages/Home";

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#eef2ff] via-[#d8b4fe] to-[#c084fc] bg-fixed">
      <ToastContainer position="top-right" />
      <Home />
    </div>
  );
}
