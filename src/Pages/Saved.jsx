import { useEffect, useState } from "react";
export default function Saved() {
  const token = localStorage.getItem("authToken");
  const [saved, setSaved] = useState([]);
  const [errorMessage, setErrorMessage] = useState();

  const [check, setChecked] = useState([]);

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
      const result = await fetch("http://localhost:3001/SS", {
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

      fetchSaved();
    } catch (e) {
      setErrorMessage(e.message);
    }
  };
  const color = (id) => {
    if (saved[id - 1]?.finished) return "bg-green-500";
    if (saved[id - 1]?.wrong) return "bg-red-500";
    return "bg-[#bce0f0]";
  };

  const fetchSaved = async () => {
    try {
      const results = await fetch("http://localhost:3001/SS", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!results.ok) {
        throw new Error("Failed to fetch");
      }
      const savedData = await results.json();
      setSaved(savedData.saved);
    } catch (e) {
      setErrorMessage(e.errorMessage);
    }
  };
  useEffect(() => {
    fetchSaved();
  }, [token]);

  console.log(saved);

  return (
    <div>
      <table className="min-w-full mt-2 flex flex-col">
        <thead className=" justify-between">
          <tr className="grid grid-cols-9">
            <th>ID</th>
            <th>Email</th>
            <th>Order</th>
            <th>Reason</th>
            <th>Action Taken</th>
            <th>Description</th>
            <th>Created At</th>
            <th>Finished</th>
            <th>Wrong</th>
          </tr>
        </thead>
        <tbody>
          {saved &&
            saved.map((ss) => (
              <tr
                key={ss.idsavedSale}
                className={`${color(
                  ss.idsavedSale
                )} grid grid-cols-9 text-center`}
              >
                <td>{ss.idsavedSale}</td>
                <td>{ss.email}</td>
                <td>{ss.orderNo}</td>
                <td>{ss.rfr}</td>
                <td>{ss.actionTaken}</td>
                <td>{ss.describeAction}</td>

                <td>
                  {ss["created At"]
                    ?.replace("T", " ")
                    .replace("Z", "")
                    .replace(".000", "")}
                </td>

                <td>
                  <input
                    type="checkbox"
                    onChange={() =>
                      handleToggleCheck(ss.idsavedSale, "finished")
                    }
                    checked={ss?.finished}
                  />
                </td>
                <td>
                  <input
                    type="checkbox"
                    onChange={() => handleToggleCheck(ss.idsavedSale, "wrong")}
                    checked={ss?.wrong}
                  />
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
