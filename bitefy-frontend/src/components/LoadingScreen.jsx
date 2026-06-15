import { MutatingDots } from "react-loader-spinner";

function LoadingScreen() {
  const containerStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.7)", // Dark overlay
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  };

  return (
    <div style={containerStyle}>
      <MutatingDots
        visible={true}
        height="100"
        width="100"
        color="#FF6F3C" // Your blue!
        secondaryColor="#FF6F3C"
        radius="12.5"
        ariaLabel="mutating-dots-loading"
      />
    </div>
  );
}

export default LoadingScreen;
