import { useEffect, useState } from "react";
import Modal from "../../Components/Modal";
export default function DEF() {
  const token = localStorage.getItem("authToken");
  const [Def, setDef] = useState([]);
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
      const result = await fetch("http://localhost:3001/DEF", {
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
      });
      if (!result.ok) {
        throw new Error("failed to update");
      }
      console.log("done");

      fetchDEF();
    } catch (e) {
      setErrorMessage(e.message);
    }
  };
  const color = (id) => {
    if (Def[id - 1]?.finished) return "bg-green-500";
    if (Def[id - 1]?.wrong) return "bg-red-500";
    return "bg-[#bce0f0]";
  };

  const fetchDEF = async () => {
    try {
      const results = await fetch(
        "https://backendaform-production.up.railway.app/DEF",
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
      const DEFData = await results.json();
      console.log(DEFData.def);
      setDef(DEFData.def);
    } catch (e) {
      setErrorMessage(e.errorMessage);
    }
  };
  useEffect(() => {
    fetchDEF();
  }, [token]);

  return (
    <div>
      <table className="min-w-full mt-2 flex flex-col">
        <thead className=" justify-between">
          <tr className="grid grid-cols-10">
            <th>ID</th>
            <th>Email</th>
            <th>Order</th>
            <th>Part Number</th>
            <th>Warehouse</th>
            <th>Description</th>
            <th>Created At</th>
            <th>Image</th>
            <th>Finished</th>
            <th>Wrong</th>
          </tr>
        </thead>
        <tbody>
          {Def &&
            Def.map((DEF) => (
              <tr
                className={`${color(
                  DEF.iddefective
                )} grid grid-cols-10 text-center`}
                key={DEF.iddefective}
              >
                <td>{DEF.iddefective}</td>
                <td>{DEF.email}</td>
                <td>{DEF.orderNo}</td>
                <td>{DEF.partNumber}</td>
                <td>{DEF.warehouse}</td>
                <td>{DEF.description}</td>
                <td>
                  {DEF["created At"]
                    ?.replace("T", " ")
                    .replace("Z", "")
                    .replace(".000", "")}
                </td>
                <td>
                  <button onClick={() => openModalWithImage(DEF.image)}>
                    {DEF.image ? "See Image" : "No image"}
                  </button>
                </td>
                <td>
                  <input
                    type="checkbox"
                    onChange={() =>
                      handleToggleCheck(DEF.iddefective, "finished")
                    }
                    checked={DEF?.finished}
                  />
                </td>
                <td>
                  <input
                    type="checkbox"
                    onChange={() => handleToggleCheck(DEF.iddefective, "wrong")}
                    checked={DEF?.wrong}
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
            src={`http://localhost:3001/${modalContent.replace(
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
