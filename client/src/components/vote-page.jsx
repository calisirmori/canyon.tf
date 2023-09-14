import { useEffect, useState } from "react";
import axios from "axios";

function VotePage() {

  const homeMatchID = 69;

  const id = window.location.href;
  const idArray = id.split("/");
  let currentMatch;
  idArray[4] !== undefined ? currentMatch = idArray[4] : currentMatch = homeMatchID;

  const [currentScoutPercent, setCurrentScoutPercent] = useState(50);
  const [currentSoldierPercent, setCurrentSoldierPercent] = useState(50);
  const [currentPyroPercent, setCurrentPyroPercent] = useState(50);
  const [currentDemoPercent, setCurrentDemoPercent] = useState(50);
  const [currentHeavyPercent, setCurrentHeavyPercent] = useState(50);
  const [currentEngineerPercent, setCurrentEngineerPercent] = useState(50);
  const [currentMedicPercent, setCurrentMedicPercent] = useState(50);
  const [currentSniperPercent, setCurrentSniperPercent] = useState(50);
  const [currentSpyPercent, setCurrentSpyPercent] = useState(50);
  const [playerAlreadyVoted, setCurrentVoteStatus] = useState(true);
  const [communityAverage, setCommunityAverages] = useState({});
  const [currentUserID, setCurrentUserID] = useState(undefined);

  const currentMatchID = currentMatch;

  const sendDataToServer = async () => {
    const data = {
      playerID: currentUserID,
      matchID: currentMatchID,
      scout: currentScoutPercent,
      soldier: currentSoldierPercent,
      pyro: currentPyroPercent,
      demoman: currentDemoPercent,
      heavy: currentHeavyPercent,
      engineer: currentEngineerPercent,
      medic: currentMedicPercent,
      sniper: currentSniperPercent,
      spy: currentSpyPercent,
      pointsEarned: 0,
    };

    try {
      const response = await axios.post(
        "https://canyon-tf-site-dg3ts.ondigitalocean.app/api/testwrite",
        data
      );
      console.log("Server Response:", response.data);
    } catch (error) {
      console.error("Error posting data:", error);
    }
  };

  const params = {
    userid: currentUserID,
    matchid: currentMatchID,
  };

  useEffect(() => {
    axios
      .get("https://canyon-tf-site-dg3ts.ondigitalocean.app/api/current-user")
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
    
    if(currentUserID !== undefined){
      axios
      .get("https://canyon-tf-site-dg3ts.ondigitalocean.app/api/check-vote", { params })
      .then((response) => {
        response.data[0] === undefined
          ? setCurrentVoteStatus(false)
          : setCurrentVoteStatus(true);
        if (response.data[0] === undefined) {
          setCurrentScoutPercent(50);
          setCurrentSoldierPercent(50);
          setCurrentPyroPercent(50);
          setCurrentDemoPercent(50);
          setCurrentHeavyPercent(50);
          setCurrentEngineerPercent(50);
          setCurrentMedicPercent(50);
          setCurrentSniperPercent(50);
          setCurrentSpyPercent(50);
        } else {
          axios
            .get("https://canyon-tf-site-dg3ts.ondigitalocean.app/api/community-average", { params })
            .then((response) => {
              if(communityAverage.scout === undefined) {
                setCommunityAverages(response.data[0]);
              }
            })
            .catch((error) => {
              console.error("Error fetching data:", error);
            });
          setCurrentScoutPercent(response.data[0].scout_prediction);
          setCurrentSoldierPercent(response.data[0].soldier_prediction);
          setCurrentPyroPercent(response.data[0].pyro_prediction);
          setCurrentDemoPercent(response.data[0].demom_prediction);
          setCurrentHeavyPercent(response.data[0].heavy_prediction);
          setCurrentEngineerPercent(response.data[0].engie_prediction);
          setCurrentMedicPercent(response.data[0].medic_prediction);
          setCurrentSniperPercent(response.data[0].sniper_prediction);
          setCurrentSpyPercent(response.data[0].spy_prediction);
          console.log(communityAverage)
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
    }

    
  }, [communityAverage]);

  const redVote = (currentPercent, setPercentFunction) => {
    const newScore = Math.min(currentPercent + 5, 100);
    setPercentFunction(newScore);
  };

  const blueVote = (currentPercent, setPercentFunction) => {
    const newScore = Math.max(currentPercent - 5, 0);
    setPercentFunction(newScore);
  };

  const currentPlayers = {
    blue: {
      scout: "BLANK",
      soldier: "POSEIDON",
      pyro: "HUNTER",
      demoman: "DT",
      heavy: "RICK",
      engie: "GG",
      medic: "TOY",
      sniper: "MUJET",
      spy: "PHISH",
    },
    red: {
      scout: "HYPHEN",
      soldier: "JOEY LEMONS",
      pyro: "MELON",
      demoman: "BOWL",
      heavy: "FIREPOW",
      engie: "EXA",
      medic: "WIZENED",
      sniper: "KYNE",
      spy: "JACOB",
    },
  };

  return (
    <div className="relative">
      <img
        src="https://img.maxofs2d.net/source/tf_loghouse_alpine_1920.jpg"
        className=" object-cover w-screen h-screen absolute"
        alt=""
      />
      <div className=" bg-stone-950 w-screen h-screen absolute opacity-90"></div>
      <div className="w-screen h-screen absolute font-mont">
        <div className=" text-3xl font-bold p-3 pl-6 bg-stone-950 bg-opacity-40 text-stone-200 mb-5 justify-between flex">
          <div>canyon.tf</div>
          <a href="https://canyon-tf-site-dg3ts.ondigitalocean.app/api/myprofile">LOGIN</a>
        </div>
        <div className="flex items-center justify-center font-mont  font-bold text-stone-200 mb-5">
          <div className="w-96 flex justify-end text-5xl">FASTFOURTH</div>
          <div className="w-72 flex justify-center text-3xl">VS</div>
          <div className="w-96 flex justify-start text-5xl wra">
            SOMEBODY HELP
          </div>
        </div>
        {classSection(currentScoutPercent, setCurrentScoutPercent, "scout", "scout")}
        {classSection(
          currentSoldierPercent,
          setCurrentSoldierPercent,
          "soldier", "soldier"
        )}
        {classSection(currentPyroPercent, setCurrentPyroPercent, "pyro", "pyro")}
        {classSection(currentDemoPercent, setCurrentDemoPercent, "demoman", "demo")}
        {classSection(currentHeavyPercent, setCurrentHeavyPercent, "heavy", "heavy")}
        {classSection(
          currentEngineerPercent,
          setCurrentEngineerPercent,
          "engie", "engi"
        )}
        {classSection(currentMedicPercent, setCurrentMedicPercent, "medic", "medic")}
        {classSection(currentSniperPercent, setCurrentSniperPercent, "sniper", "sniper")}
        {classSection(currentSpyPercent, setCurrentSpyPercent, "spy", "spy")}
        <div className="flex justify-center items-center mt-6">
          {!playerAlreadyVoted && (
            <div
              onClick={() => sendDataToServer()}
              className="select-none font-5xl flex justify-center items-center bg-tf-orange w-40 rounded-md border-2 p-1 border-tf-orange-dark font-bold text-xl text-stone-900 hover:scale-105 cursor-pointer duration-150"
            >
              SUBMIT
            </div>
          )}
        </div>
      </div>
    </div>
  );

  function classSection(
    currentPercentSelection,
    setCurrentPercentSelection,
    className,
    dbName
  ) {
    return (
      <div className=" flex w-full h-fit justify-center items-center my-3">
        <div className="flex items-center justify-center">
          <div
            onClick={() => {
              !playerAlreadyVoted &&
                redVote(currentPercentSelection, setCurrentPercentSelection);
            }}
            className={`h-14 bg-stone-300 w-64 rounded-lg drop-shadow-md ${
              !playerAlreadyVoted &&
              "hover:cursor-pointer hover:border-tf-red-dark "
            } border-4 border-tf-red duration-150 flex items-center justify-center font-bold select-none`}
          >
            {currentPlayers.red[className]}
          </div>
          <div className=" -mb-4">
            <div className="">
              <div className="my-1 relative mx-6">
                <img
                  src={`../../../classIcons/${className}.png`}
                  className={`h-7 bottom-1.5 -ml-3  absolute transform ${
                    playerAlreadyVoted ? "duration-1000" : "duration-150"
                  } select-none`}
                  style={{ left: `${communityAverage[dbName] - 1}% ` }}
                  alt=""
                />
                <div
                  className={`h-2.5 rounded-lg w-1 flex justify-center items-center bg-stone-300 absolute -bottom-1 left-1/2 transform ${
                    playerAlreadyVoted ? "duration-1000" : "duration-150"
                  }`}
                  style={{ left: `${communityAverage[dbName] - 1}%` }}
                ></div>
                {playerAlreadyVoted && (
                  <div
                    className={`h-2.5 rounded-lg w-1 flex justify-center items-center bg-tf-orange absolute -bottom-2.5 left-1/2 transform ${
                      playerAlreadyVoted ? "duration-1000" : "duration-150"
                    }`}
                    style={{ left: `${currentPercentSelection}%` }}
                  >
                  </div>
                )}
              </div>
            </div>
            <div className="mx-6 h-1 w-60 bg-tf-blue rounded-md relative">
              <div
                className={`absolute rounded-l-lg h-1 bg-tf-red ${
                  playerAlreadyVoted ? "duration-1000" : "duration-150"
                }`}
                style={{ width: `${communityAverage[dbName]}%` }}
              ></div>
            </div>
          </div>
          <div
            onClick={() => {
              !playerAlreadyVoted &&
                blueVote(currentPercentSelection, setCurrentPercentSelection);
            }}
            className={`h-14  bg-stone-300 w-64 rounded-lg drop-shadow-md ${
              !playerAlreadyVoted &&
              "hover:cursor-pointer hover:border-tf-blue-dark"
            } border-4 border-tf-blue  duration-150 flex items-center justify-center font-bold select-none`}
          >
            {currentPlayers.blue[className]}
          </div>
        </div>
      </div>
    );
  }
}

export default VotePage;
