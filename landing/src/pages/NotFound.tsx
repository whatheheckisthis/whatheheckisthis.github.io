import { Link } from "react-router-dom";
import Header from "../components/Header";

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="prose fade-in">
        <h1>Not found</h1>
        <p>
          That page doesn't exist. <Link to="/">Go home</Link>.
        </p>
      </main>
    </>
  );
}
