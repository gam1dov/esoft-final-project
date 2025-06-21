import loader from "../../assets/loader.gif";

const Loader = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        width: "100wh",
      }}
    >
      <img src={loader} alt="Loading..." className="h-[150px] w-[150px]" />
    </div>
  );
};

export default Loader;
