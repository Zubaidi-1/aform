import { useEffect, useState } from "react";
import Modal from "../../Components/Modal";
export default function Lost() {
  const token = localStorage.getItem("authToken");
  const [lost, setLost] = useState([]);
  const [errorMessage, setErrorMessage] = useState();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [check, setChecked] = useState([]);

  const openModalWithImage = (image) => {
    setModalContent(image);
    toggleModal();
  };
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };
  const handleToggleCheck = async (id, type) => {
    if (type === "finished") {
      setChecked((prev) => ({
        ...prev,
        [id]: {
          finished: !prev[id]?.finished,
          wrong: prev[id]?.finished === true ? true : false,
        },
      }));
    }
    if (type === "wrong") {
      setChecked((prev) => ({
        ...prev,
        [id]: {
          finished: prev[id]?.wrong === true ? true : false,
          wrong: !prev[id]?.wrong,
        },
      }));
    }
    const newFinishedValue =
      type === "finished"
        ? !check[id]?.finished
        : type === "wrong"
        ? !check[id]?.wrong
        : false;

    try {
      const result = await fetch(
        "https://backendaform-production.up.railway.app/lost",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            request: type,
            finished: newFinishedValue,
            id: id,
          }),
        }
      );
      if (!result.ok) {
        throw new Error("failed to update");
      }
      console.log("done");

      fetchLost();
    } catch (e) {
      setErrorMessage(e.message);
    }
  };
  const color = (id) => {
    if (lost[id - 1]?.finished) return "bg-green-500";
    if (lost[id - 1]?.wrong) return "bg-red-500";
    return "bg-[#bce0f0]";
  };

  const fetchLost = async () => {
    try {
      const results = await fetch(
        "https://backendaform-production.up.railway.app/lost",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!results.ok) {
        throw new Error("Failed to fetch");
      }
      const lostData = await results.json();
      console.log(lostData.lost);
      setLost(lostData.lost);
    } catch (e) {
      setErrorMessage(e.errorMessage);
    }
  };
  useEffect(() => {
    fetchLost();
  }, [token]);

  return (
    <div>
      <table className="min-w-full mt-2 flex flex-col">
        <thead className=" justify-between">
          <tr className="grid grid-cols-11">
            <th>ID</th>
            <th>Email</th>
            <th>Order</th>
            <th>Lost / Damaged</th>
            <th>Warehouse</th>
            <th>Date</th>
            <th>Tracking</th>
            <th>Created At</th>
            <th>Image</th>
            <th>Finished</th>
            <th>Wrong</th>
          </tr>
        </thead>
        <tbody>
          {lost &&
            lost.map((lostItem) => (
              <tr
                className={`${color(
                  lostItem.idlost
                )} grid grid-cols-11 text-center`}
                key={lostItem.idlost}
              >
                <td>{lostItem.idlost}</td>
                <td>{lostItem.email}</td>
                <td>{lostItem.orderNo}</td>
                <td>{lostItem.lostdamaged}</td>
                <td>{lostItem.warehouse}</td>
                <td>{lostItem.date}</td>
                <td>{lostItem.tracking}</td>
                <td>
                  {lostItem["created At"]
                    ?.replace("T", " ")
                    .replace("Z", "")
                    .replace(".000", "")}
                </td>
                <td>
                  <button onClick={() => openModalWithImage(lostItem.image)}>
                    {lostItem.image ? "See Image" : "No image"}
                  </button>
                </td>
                <td>
                  <input
                    type="checkbox"
                    onChange={() =>
                      handleToggleCheck(lostItem.idlost, "finished")
                    }
                    checked={lostItem?.finished}
                  />
                </td>
                <td>
                  <input
                    type="checkbox"
                    onChange={() => handleToggleCheck(lostItem.idlost, "wrong")}
                    checked={lostItem?.wrong}
                  />
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      <Modal isOpen={isModalOpen} onClose={toggleModal}>
        {console.log(modalContent?.replace("images\\", ""), "hi")}
        {modalContent ? (
          <img
            src={`https://backendaform-production.up.railway.app/${modalContent.replace(
              "images\\",
              ""
            )}`}
            alt="Modal Content"
            className="w-96 h-96"
          />
        ) : (
          <p>No image available</p>
        )}
      </Modal>
    </div>
  );
}
