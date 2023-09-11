import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [currentScoutPercent, setCurrentScoutPercent] = useState(50);
  const [currentSoldierPercent, setCurrentSoldierPercent] = useState(50);
  const [currentPyroPercent, setCurrentPyroPercent] = useState(50);
  const [currentDemoPercent, setCurrentDemoPercent] = useState(50);
  const [currentHeavyPercent, setCurrentHeavyPercent] = useState(50);
  const [currentEngineerPercent, setCurrentEngineerPercent] = useState(50);
  const [currentMedicPercent, setCurrentMedicPercent] = useState(50);
  const [currentSniperPercent, setCurrentSniperPercent] = useState(50);
  const [currentSpyPercent, setCurrentSpyPercent] = useState(50);

  useEffect(() => {
    console.log(currentScoutPercent);
  }, [currentScoutPercent])

  const redVote = (currentPercent, setPercentFunction) => {
    const newScore = Math.min(currentPercent + 5, 100);
    setPercentFunction(newScore);
  }

  const blueVote = (currentPercent, setPercentFunction) => {
    const newScore = Math.max(currentPercent - 5, 0);
    setPercentFunction(newScore);
  }
  
  const SCOUT_ICON = "https://github.com/calisirmori/more.tf/blob/v2/client/public/class%20icons/Leaderboard_class_scout.png?raw=true";

  const currentPlayers = {
    blue:{
      scout: "BLANK",
      soldier: "",
      pyro: "",
      demo: "",
      heavy: "",
      engie: "",
      medic: "",
      sniper: "",
      spy: ""
    },
    red:{
      scout: "HYPHEN",
      soldier: "",
      pyro: "",
      demo: "",
      heavy: "",
      engie: "",
      medic: "",
      sniper: "",
      spy: ""
    }
  }

  return (
    <div class="relative">
      <img src="https://img.maxofs2d.net/source/tf_loghouse_alpine_1920.jpg" className=' object-cover w-screen h-screen absolute' alt="" />
      <div class=" bg-stone-950 w-screen h-screen absolute opacity-90"></div>
      {classSection(currentScoutPercent, setCurrentScoutPercent, "scout", SCOUT_ICON)}
    </div>
  )

  function classSection(currentPercentSelection, setCurrentPercentSelection, className, currentClassIcon) {
    return <div class="w-screen h-screen absolute font-mont">
      <div className=' text-3xl font-bold p-3 pl-6 bg-stone-950 bg-opacity-40 text-stone-200 mb-10'>canyon.tf</div>
      <div className=' flex w-full h-fit justify-center items-center my-3'>
        <div className='flex items-center justify-center'>
          <div onClick={() => redVote(currentPercentSelection, setCurrentPercentSelection)} className='h-14 bg-stone-300 w-64 rounded-lg drop-shadow-md hover:cursor-pointer border-4 border-tf-red hover:border-tf-red-dark duration-150 flex items-center justify-center font-bold select-none'>{currentPlayers.red[className]}</div>
          <div className=' -mb-4'>
            <div className=''>
              <div className='my-1 relative mx-6'>
                <img src={currentClassIcon} className='h-7 bottom-1.5 -ml-3  absolute transform duration-150' style={{ left: `${currentPercentSelection - 1}% ` }} alt="" />
                <div className='h-2.5 rounded-lg w-1 flex justify-center items-center bg-stone-300 absolute -bottom-1 left-1/2 transform duration-150' style={{ left: `${currentPercentSelection - 1}%` }}></div>
              </div>
            </div>
            <div className='mx-6 h-1 w-60 bg-tf-blue rounded-md relative'>
              <div className='absolute h-1 bg-tf-red duration-150' style={{ width: `${currentPercentSelection}%` }}></div>
            </div>
          </div>
          <div onClick={() => blueVote(currentPercentSelection, setCurrentPercentSelection)} className='h-14 bg-stone-300 w-64 rounded-lg drop-shadow-md hover:cursor-pointer border-4 border-tf-blue hover:border-tf-blue-dark duration-150 flex items-center justify-center font-bold select-none'>{currentPlayers.blue[className]}</div>
        </div>
      </div>
    </div>;
  }
}

export default App
