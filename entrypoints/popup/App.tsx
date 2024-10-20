import StartButton from "./startButton";

function App() {
  return (
    <>
      <div className="Main-container w-72 p-4 text-center">
        <h1 className="text-2xl text-center text-faint_blue font-bold">
          LinkedIn AI Reply
        </h1>
        {/* faint blue is custom created by me in tailwind.conifg.js */}
        <p className="mt-1 text-center">
          LinkedIn Reply AI is a Chrome extension that helps users quickly
          generate and insert replies into LinkedIn messages with ease.{" "}
          <span className="font-bold block my-1">
            (To get started please click on "Write a message..." placeholder !)
          </span>
        </p>
        <StartButton />
      </div>
    </>
  );
}

export default App;
