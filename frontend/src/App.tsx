import Header from "./components/shared/Header/Header";
import Footer from "./components/Footer";

const App = () => {
  return (
    <div className="flex h-screen flex-col">
      <Header />
      <main className="flex-1 wrapper"></main>
      <Footer />
    </div>
  );
};
export default App;
