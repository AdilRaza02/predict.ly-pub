"use client";

import { Modal } from "flowbite-react";
import { useEffect, useState } from "react";

export default function DetailView({ data }) {
  const [displayName, setDisplayName] = useState("Loading...");
  const [openModal, setOpenModal] = useState(false);

  async function getDisplayName() {
    if (!data?.coordinate?.length) return;

    try {
      const response = await fetch(
        `https://geocode.maps.co/reverse?lat=${data.coordinate[1]}&lon=${data.coordinate[0]}`
      );
      const { display_name: displayName } = await response.json();
      setDisplayName(displayName);
    } catch (error) {
      console.error("Error:", error.message);
    }
  }

  useEffect(() => {
    getDisplayName();
    setOpenModal(!!data);
  }, [data]);

  return (
    <>
      <Modal show={!!data && openModal}>
        <div className="space-y-6 bg-transparent p-4">
          <div onClick={() => setOpenModal(false)}>
            <svg
              className="fill-gray-300 float-right hover:fill-gray-400 text-right -mb-4 pointer"
              xmlns="http://www.w3.org/2000/svg"
              x="0px"
              y="0px"
              width="20"
              height="20"
              viewBox="0 0 24 24"
            >
              <path d="M 4.9902344 3.9902344 A 1.0001 1.0001 0 0 0 4.2929688 5.7070312 L 10.585938 12 L 4.2929688 18.292969 A 1.0001 1.0001 0 1 0 5.7070312 19.707031 L 12 13.414062 L 18.292969 19.707031 A 1.0001 1.0001 0 1 0 19.707031 18.292969 L 13.414062 12 L 19.707031 5.7070312 A 1.0001 1.0001 0 0 0 18.980469 3.9902344 A 1.0001 1.0001 0 0 0 18.292969 4.2929688 L 12 10.585938 L 5.7070312 4.2929688 A 1.0001 1.0001 0 0 0 4.9902344 3.9902344 z"></path>
            </svg>
          </div>
          <h1 className="text-xl text-gray-300 ">{displayName}</h1>
        </div>
      </Modal>
    </>
  );
}
