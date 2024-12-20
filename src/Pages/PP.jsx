import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
export default function PP() {
  const [pp, setPP] = useState([]);
  const [error, setError] = useState();
  const [checked, setChecked] = useState({});
  const navigate = useNavigate();
  const token = localStorage.getItem("authToken");

  const fetchPP = async () => {
    try {
      const response = await fetch(
        "https://backendaform-production.up.railway.app/aform/P&P",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setPP(data.pp);
    } catch (err) {
      console.error("Failed to fetch push and pull:", err.message);
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchPP();
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
    console.log(checked[2]);

    try {
      const response = await fetch(
        "https://backendaform-production.up.railway.app/pp",
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

      if (!response.ok) {
        throw new Error("failed to fetch");
      }
      console.log("we here");

      fetchPP();
    } catch (e) {
      setError(e.message);
    }
  };
  const getRowClass = (id) => {
    if (checked[id]?.finished || pp[id - 1].finished) return "bg-green-300";
    if (checked[id]?.wrong || pp[id - 1].wrong) return "bg-red-300";
    return "bg-[#bce0f0]"; // Default color
  };
  return (
    <div className="mr-8 mt-6">
      <table className=" w-full flex flex-col">
        <thead>
          <tr className="grid grid-cols-11 justify-center items-center">
            <th>ID</th>
            <th>Email</th>
            <th>Order</th>
            <th>Part Number</th>
            <th>Reman</th>
            <th>Warehouse</th>
            <th>Push / Pull</th>
            <th>Tracking</th>
            <th>Created At</th>
            <th>Finished</th>
            <th>Wrong</th>
          </tr>
        </thead>
        <tbody>
          {pp &&
            pp.map((request) => (
              <tr
                key={request.idpushpull}
                className={`grid grid-cols-11 justify-center items-center text-center ${getRowClass(
                  request.idpushpull
                )} `}
              >
                {/*   */}
                <td>{request.idpushpull}</td>
                <td>{request.email}</td>
                <td> {request.orderNo} </td>
                <td>{request.partNumber} </td>
                <td>{request.reman}</td>
                <td> {request.warehouse} </td>
                <td>{request.pushpull}</td>
                <td>{request.tracking ? request.tracking : ""} </td>
                <td>
                  {request["created At"].replace("T", "  ").replace("Z", "")}
                </td>
                <td>
                  <input
                    onChange={() =>
                      handleChange("finished", request.idpushpull)
                    }
                    type="checkbox"
                    checked={request.finished ? true : false}
                  />
                </td>
                <td>
                  <input
                    onChange={() => handleChange("wrong", request.idpushpull)}
                    type="checkbox"
                    checked={request.wrong ? true : false}
                  />
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
