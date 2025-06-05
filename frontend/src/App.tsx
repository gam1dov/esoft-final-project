import Header from "./components/shared/Header/Header";
import Footer from "./components/Footer";
import Homepage from "./components/shared/Main/Homepage";

const App = () => {
  return (
    <div className="flex h-screen flex-col">
      <Header />
      <main className="flex-1 wrapper">
        <Homepage />
      </main>
      <Footer />
    </div>
  );
};
export default App;
