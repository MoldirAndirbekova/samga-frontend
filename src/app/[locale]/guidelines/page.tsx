"use client";

import { useState } from "react";

export default function GuidelinesPage() {
  const [activeTab, setActiveTab] = useState("play");

  return (
    <div className="min-h-screen bg-[#FFF5E1] flex flex-col text-[#694800]">
      <div className="flex flex-1">
        <main className="flex-1 p-6">
          <h1 className="text-3xl font-bold ">Guidelines</h1>
          <h4 className=" mt-7 font-bold text-xl">
            Games are way more enjoyable without any glitches. To make sure your{" "}
            <br />
            experience is smooth and glitch-free while learning through play,
            follow the <br />
            guidelines.
          </h4>

          <div className="mt-6 flex space-x-6 border-b-8 border-[#E8DEF8]  pb-2 text-lg font-bold">
            <button
              className={`font-semibold pb-2 ${
                activeTab === "play" ? " border-b-2 " : "text-yellow-800"
              }`}
              onClick={() => setActiveTab("play")}
            >
              Play Setup
            </button>
            <button
              className={`font-semibold pb-2 ${
                activeTab === "faq" ? " border-b-2 " : "text-yellow-800"
              }`}
              onClick={() => setActiveTab("faq")}
            >
              FAQ
            </button>
          </div>

          {activeTab === "play" && (
            <div className="grid md:grid-cols-2 gap-6 mt-6">
              <div className="bg-white p-4 shadow-md rounded-lg grid grid-cols-2">
                <div className="flex flex-col items-center ">
                  <img
                    src="/guidelines/laptop.png"
                    alt="Laptop"
                    className="w-30 h-30 object-contain"
                  />
                  <img
                    src="/guidelines/router.png"
                    alt="Router"
                    className="w-26 h-26 object-contain"
                  />
                  <img
                    src="/guidelines/camera.png"
                    alt="Camera"
                    className="w-12 h-12 object-contain"
                  />
                </div>
                <div className="">
                  <h2 className="text-xl font-bold flex items-center ">
                    <span className="text-[#2959bf] font-bold border-3 border-[#2959bf] rounded-full w-6 h-6 flex items-center justify-center mr-3  mb-20">
                      1
                    </span>
                    What you <br /> need to <br />
                    start the
                    <br /> game
                  </h2>
                  <p className="text-neutral-950 mt-2 font-semibold ml-9">
                    To dive into the
                    <br /> game, all you <br /> need is a solid
                    <br /> internet
                    <br />
                    connection, a<br /> laptop, and a<br /> webcam.
                  </p>
                </div>
              </div>

              <div className="bg-white p-4 shadow-md rounded-lg grid grid-cols-2 ">
                <div className="mt-4">
                  <img
                    src="/guidelines/webcam_placement.png"
                    alt="Webcam Placement"
                    className="w-80 h-50 object-contain rounded-lg  items-center"
                  />
                </div>
                <div>
                  <h2 className="text-xl font-bold flex items-center ">
                    <span className="text-[#2959bf] font-bold border-3 border-[#2959bf] rounded-full w-6 h-6 flex items-center justify-center mr-3 mb-20">
                      2
                    </span>
                    Webcam <br /> placement
                    <br /> and Moving
                    <br /> Space
                  </h2>
                  <p className="text-neutral-950 mt-2 font-semibold ml-9">
                    Make sure you <br /> are at least 4 feet
                    <br /> from the
                    <br /> webcam and that
                    <br /> you have sample
                    <br /> space to move.
                  </p>
                </div>
              </div>

              <div className="bg-white p-4 shadow-md rounded-lg md:col-span-2">
                <h2 className="text-lg font-semibold flex items-center space-x-2">
                  <span className="text-[#2959bf] font-bold border-3 border-[#2959bf] rounded-full w-6 h-6 flex items-center justify-center mr-3 ml-3">
                    3
                  </span>
                  Background Setup
                </h2>

                <div className="grid md:grid-cols-3 gap-3 mt-2 mb-6">
                  <div>
                    <img
                      src="/guidelines/battery_level.png"
                      alt="Battery"
                      className="mt-2 w-53 h-26"
                    />
                    <p className="ml-5 text-[15px] font-semibold text-neutral-950">
                      When playing on a <br />
                      laptop, make sure you <br />
                      have enough battery <br />
                      power.
                    </p>
                  </div>
                  <div>
                    <img
                      src="/guidelines/bright-light.png"
                      alt="Bright Light"
                      className="mt-2 w-53 h-26"
                    />
                    <p className="ml-5 text-[15px] font-semibold text-neutral-950">
                      Avoid bright lights in <br /> in the users' background.
                    </p>
                  </div>
                  <div>
                    <img
                      src="/guidelines/bad_bg.png"
                      alt="Bad background"
                      className="mt-2 w-53 h-26"
                    />
                    <p className="ml-5 text-[15px] font-semibold text-neutral-950">
                      Avoid bad lighting or
                      <br /> less light in the users'
                      <br /> background
                    </p>
                  </div>
                  <div>
                    <img
                      src="/guidelines/colorful_bg.png"
                      alt="Colorful Background"
                      className="mt-2 w-53 h-26"
                    />
                    <p className="ml-5 text-[15px] font-semibold text-neutral-950">
                      Avoid backgrounds <br /> with a lot of <br /> artwork of
                      colours.
                    </p>
                  </div>
                  <div>
                    <img
                      src="/guidelines/good_bg.png"
                      alt="Good background"
                      className="mt-2 w-50 h-25"
                    />
                    <p className="ml-5 text-[15px] font-semibold text-neutral-950">
                      Play in front of a <br /> plain background so <br /> the
                      camera detects <br /> you properly
                    </p>
                  </div>
                  <div>
                    <img
                      src="/guidelines/bad_bg.png"
                      alt="Clothing Restrictions"
                      className="mt-2 w-53 h-26"
                    />
                    <p className="ml-5 text-[15px] font-semibold text-neutral-950">
                      Avoid wearing clothing <br /> that cover your hands
                      <br /> like shawls, open
                      <br /> jackets.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "faq" && (
            <div className="mt-6 p-4 bg-white rounded-lg shadow-md">
              <h3 className="text-xl font-bold">Frequently Asked Questions</h3>
              <ul className="mt-2 space-y-2 ">
                <li>
                  <strong>Q:</strong> What devices are supported? <br />{" "}
                  <strong>A:</strong> You can play on laptops and PCs with a
                  webcam.
                </li>
                <li>
                  <strong>Q:</strong> What internet speed is required? <br />{" "}
                  <strong>A:</strong> A stable broadband connection is
                  recommended.
                </li>
                <li>
                  <strong>Q:</strong> Can I use an external webcam? <br />{" "}
                  <strong>A:</strong> Yes, as long as it provides a clear image.
                </li>
                <li>
                  <strong>Q:</strong> Why is my movement not being detected?{" "}
                  <br /> <strong>A:</strong> Ensure good lighting and a clear
                  background.
                </li>
              </ul>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
