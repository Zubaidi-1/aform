import { useState, useEffect } from "react";
import Modal from "../../Components/Modal";

export default function WE() {
  const [we, setWE] = useState([]);
  const [error, setError] = useState();
  const [checked, setChecked] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const token = localStorage.getItem("authToken");

  const fetchWE = async () => {
    try {
      const response = await fetch("http://localhost:3001/aform/WE", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setWE(data.WE);
    } catch (err) {
      console.error("Failed to fetch push and pull:", err.message);
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchWE();
  }, [token]);

  const handleChange = async (type, id) => {
    setChecked((prev) => {
      const newChecked = {
        ...prev,
        [id]: {
          finished:
            type === "finished" ? !prev[id]?.finished : prev[id]?.finished,
          wrong: type === "wrong" ? !prev[id]?.wrong : prev[id]?.wrong,
        },
      };
      return newChecked;
    });

    const newFinishedValue =
      type === "finished"
        ? !checked[id]?.finished
        : type === "wrong"
        ? !checked[id]?.wrong
        : false;

    try {
      const response = await fetch("http://localhost:3001/WE", {
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

      if (!response.ok) {
        throw new Error("failed to fetch");
      }

      fetchWE();
    } catch (e) {
      setError(e.message);
    }
  };

  const getRowClass = (id, index) => {
    if (checked[id]?.finished || we[index]?.finished) return "bg-green-300";
    if (checked[id]?.wrong || we[index]?.wrong) return "bg-red-300";

    return "bg-[#bce0f0]"; // Default color
  };

  const openModalWithImage = (image) => {
    setModalContent(image);
    toggleModal();
  };

  return (
    <div>
      <table className="w-full ml-2 text-center mr-6">
        <thead>
          <tr className="grid grid-cols-12">
            <th>ID</th>
            <th>Email</th>
            <th>Order</th>
            <th>Part</th>
            <th>Warehouse</th>
            <th>Issue</th>
            <th>Description</th>
            <th>Date</th>
            <th>Created At</th>
            <th>Image Upload</th>
            <th>Finished</th>
            <th>Wrong</th>
          </tr>
        </thead>
        <tbody>
          {we &&
            we.map((we, index) => (
              <tr
                className={`grid grid-cols-12 justify-center items-center text-center ${getRowClass(
                  we.idwarehouse,
                  index
                )}`}
                key={we.idwarehouse}
              >
                <td>{we.idwarehouse}</td>
                <td>{we.email}</td>
                <td>{we.orderNo}</td>
                <td>{we.partNumber}</td>
                <td>{we.warehouse}</td>
                <td>{we.issue}</td>
                <td>{we.description}</td>
                <td>{we.date}</td>
                <td>{we["created At"]?.replace("T", " ").replace("Z", "")}</td>
                <td>
                  <button onClick={() => openModalWithImage(we.image)}>
                    {we.image ? "See image" : "No image"}
                  </button>
                </td>
                <td>
                  <input
                    onChange={() => handleChange("finished", we.idwarehouse)}
                    type="checkbox"
                    checked={we.finished ? true : false}
                  />
                </td>
                <td>
                  <input
                    onChange={() => handleChange("wrong", we.idwarehouse)}
                    type="checkbox"
                    checked={checked[we.idwarehouse]?.wrong || we.wrong}
                  />
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      {/* Modal to display the image */}
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
