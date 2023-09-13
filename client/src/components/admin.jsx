import { useEffect, useState } from "react";

function AdminPage(){

    return (
        <div class="relative">
      <img
        src="https://img.maxofs2d.net/source/tf_loghouse_alpine_1920.jpg"
        className=" object-cover w-screen h-screen absolute"
        alt=""
      />
      <div class=" bg-stone-950 w-screen h-screen absolute opacity-90"></div>
      <div class="w-screen h-screen absolute font-mont">
        <div className=" text-3xl font-bold p-3 pl-6 bg-stone-950 bg-opacity-40 text-stone-200 mb-10">
          canyon.tf
        </div>
        <div className=" font-mont">
            <div className="flex justify-center items-center">
                <input type="text" className="h-10 bg-stone-200 rounded-md text-xs w-[26rem] font-semibold border-2 border-tf-red px-2 outline-none" />
                <img src={`../../../classIcons/scout.png`} alt="" className=" h-8 mx-4"/>
                <input type="text" className="h-10 bg-stone-200 rounded-md text-xs w-[26rem] font-semibold border-2 border-tf-blue px-2 outline-none" />

            </div>
        </div>
      </div>
    </div>
    );
}

export default AdminPage;