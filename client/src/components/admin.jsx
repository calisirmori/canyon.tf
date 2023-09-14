import React, { useState, useEffect } from "react";
import axios from "axios";

function AdminPage() {
  const [totalReactPackages, setTotalReactPackages] = useState(0);
  const [RedTeamDetails, setRedTeamDetails] = useState({
    scout: null,
    soldier: null,
    pyro: null,
    demoman: null,
    heavy: null,
    engie: null,
    medic: null,
    sniper: null,
    spy: null,
  });

  const [BlueTeamDetails, setBlueTeamDetails] = useState({
    scout: null,
    soldier: null,
    pyro: null,
    demoman: null,
    heavy: null,
    engie: null,
    medic: null,
    sniper: null,
    spy: null,
  });

  const [RedTeam, setRedTeam] = useState({
    scout: 0,
    soldier: 0,
    pyro: 0,
    demoman: 0,
    heavy: 0,
    engie: 0,
    medic: 0,
    sniper: 0,
    spy: 0,
  });

  const RedTeamSum = Object.values(RedTeam).reduce(
    (partialSum, a) => partialSum + a,
    0
  );
  const [BlueTeam, setBlueTeam] = useState({
    scout: 0,
    soldier: 0,
    pyr: 0,
    demoman: 0,
    heavy: 0,
    engie: 0,
    medic: 0,
    snipe: 0,
    spy: 0,
  });

  const BlueTeamSum = Object.values(BlueTeam).reduce(
    (partialSum, a) => partialSum + a,
    0
  );

  if (RedTeamSum + BlueTeamSum === 18) SubmitButton();

  function SubmitButton() {
    return (
      <div
        className="flex justify-center items-center mt-6"
        onClick={logTeamsDetails}
      >
        <div className="select-none font-5xl flex justify-center items-center bg-tf-orange w-40 rounded-md border-2 p-1 border-tf-orange-dark font-bold text-xl text-stone-900 hover:scale-105 cursor-pointer duration-150">
          SUBMIT
        </div>
      </div>
    );
  }

  const userAvatarAndNameGetter = async (RGLLink) => {
    const splittedRGLLinkArr = RGLLink.split("p=");

    let UserID =
      splittedRGLLinkArr[1] && splittedRGLLinkArr[1].includes("&")
        ? splittedRGLLinkArr[1].split("&")[0]
        : splittedRGLLinkArr[1];

    var URL = `https://canyon-tf-site-dg3ts.ondigitalocean.app/api/rgl-profile/${UserID}`;
    const response = await axios.get(URL);
    setTotalReactPackages(response.data.total);
    console.log(response.data.name);
    console.log(response.data.avatar);

    // Return both the response and the UserID
    return { data: response.data, userId: UserID };
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
        <div className=" text-3xl font-bold p-3 pl-6 bg-stone-950 bg-opacity-40 text-stone-200 mb-10">
          canyon.tf
        </div>
        <div className=" font-mont">
          <img src={""} alt="" className=" h-8 mx-4" />
          <div className="grid justify-center items-center">
            {NameAndAvatarChecker("scout")}
            {NameAndAvatarChecker("soldier")}
            {NameAndAvatarChecker("pyro")}
            {NameAndAvatarChecker("demoman")}
            {NameAndAvatarChecker("heavy")}
            {NameAndAvatarChecker("engie")}
            {NameAndAvatarChecker("medic")}
            {NameAndAvatarChecker("sniper")}
            {NameAndAvatarChecker("spy")}
          </div>
          {RedTeamSum + BlueTeamSum === 18 && <SubmitButton />}
        </div>
      </div>
    </div>
  );

  function NameAndAvatarChecker(className) {
    const [RedClassRGLLink, setRedClassRGLLink] = useState("");
    const [RedResponse, setRedResponse] = useState({ isChecked: 0 });
    const [BlueClassRGLLink, setBlueClassRGLLink] = useState("");
    const [BlueResponse, setBlueResponse] = useState({ isChecked: 0 });

    useEffect(() => {
      if (RedClassRGLLink) {
        userAvatarAndNameGetter(RedClassRGLLink).then(({ data, userId }) => {
          setRedResponse(data);

          // Update the details state
          setRedTeamDetails((prevDetails) => ({
            ...prevDetails,
            [className]: {
              name: data.name,

              userId: userId,
            },
          }));
        });
      }
    }, [RedClassRGLLink]);

    useEffect(() => {
      if (BlueClassRGLLink) {
        userAvatarAndNameGetter(BlueClassRGLLink).then(({ data, userId }) => {
          setBlueResponse(data);

          // Update the details state
          setBlueTeamDetails((prevDetails) => ({
            ...prevDetails,
            [className]: {
              name: data.name,

              userId: userId,
            },
          }));
        });
      }
    }, [BlueClassRGLLink]);

    useEffect(() => {
      if (RedClassRGLLink) {
        userAvatarAndNameGetter(RedClassRGLLink).then((data) =>
          setRedResponse(data.data)
        );
      }
    }, [RedClassRGLLink]);

    useEffect(() => {
      if (BlueClassRGLLink) {
        userAvatarAndNameGetter(BlueClassRGLLink).then((data) =>
          setBlueResponse(data.data)
        );
      }
    }, [BlueClassRGLLink]);

    //Button Handlers
    const handleBlueToggle = () => {
      setBlueResponse((prevData) => ({
        ...prevData,
        isChecked: prevData.isChecked === 0 ? 1 : 0,
      }));
    };
    const handleRedToggle = () => {
      setRedResponse((prevData) => ({
        ...prevData,
        isChecked: prevData.isChecked === 0 ? 1 : 0,
      }));
    };

    useEffect(() => {
      setRedTeam((prevTeam) => ({
        ...prevTeam,
        [className]: RedResponse.isChecked,
      }));
    }, [RedResponse.isChecked]);

    useEffect(() => {
      setBlueTeam((prevTeam) => ({
        ...prevTeam,
        [className]: BlueResponse.isChecked,
      }));
    }, [BlueResponse.isChecked]);

    return (
      <div className="mb-5 flex justify-center items-center ">
        <div className="w-80 justify-end items-center flex">
          {RedResponse.name && (
            <span className="text-stone-200 font-semibold text-xl">
              #{RedResponse.name}
            </span>
          )}
          {RedResponse.avatar && (
            <img
              src={`${RedResponse.avatar}`}
              alt=""
              className="rounded-lg h-8 mx-4 "
            />
          )}
        </div>
        <button
          className={`rounded-lg border-2 h-8 w-8 mr-2 ${
            RedResponse.isChecked === 1
              ? " bg-green-500 border-green-900"
              : "bg-red-600 border-red-900"
          }`}
          onClick={handleRedToggle}
        />
        <input
          id="RGLLink"
          placeholder={`Red ${className.toUpperCase()} RGL Link`}
          type="text"
          value={RedClassRGLLink}
          onChange={(e) => {
            setRedClassRGLLink(e.target.value);
          }}
          className="h-10 bg-stone-200 rounded-md text-xs w-[26rem] font-semibold border-2 border-tf-red px-2 outline-none"
        />
        <img
          src={`../../../classIcons/${className}.png`}
          alt=""
          className="h-8 mx-4"
        />
        <input
          id="RGLLink"
          placeholder={`Blue ${className.toUpperCase()} RGL Link`}
          type="text"
          value={BlueClassRGLLink}
          onChange={(e) => {
            setBlueClassRGLLink(e.target.value);
          }}
          className="h-10 bg-stone-200 rounded-md text-xs w-[26rem] font-semibold border-2 border-tf-blue px-2 outline-none"
        />
        <button
          className={`rounded-lg border-2 h-8 w-8 ml-2 ${
            BlueResponse.isChecked === 1
              ? " bg-green-500 border-green-900"
              : "bg-red-600 border-red-900"
          }`}
          onClick={handleBlueToggle}
        />
        <div className="w-80 flex justify-start items-center">
          {BlueResponse.avatar && (
            <img
              src={`${BlueResponse.avatar}`}
              alt=""
              className="rounded-lg h-8 ml-4 mr-2"
            />
          )}
          {BlueResponse.name && (
            <span className="text-stone-200 font-semibold text-xl">
              #{BlueResponse.name}
            </span>
          )}
        </div>
      </div>
    );
  }
  function logTeamsDetails() {
    const Teams = { RedTeamDetails, BlueTeamDetails };
    console.log("Team Details:", Teams);
  }
}

export default AdminPage;
