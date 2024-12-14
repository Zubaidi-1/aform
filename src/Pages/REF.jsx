import { useEffect, useState } from "react";
export default function Ref() {
  const token = localStorage.getItem("authToken");
  const [ref, setRef] = useState([]);
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
      const result = await fetch("http://localhost:3001/REF", {
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

      fetchRef();
    } catch (e) {
      setErrorMessage(e.message);
    }
  };
  const color = (id) => {
    if (ref[id - 1]?.finished) return "bg-green-500";
    if (ref[id - 1]?.wrong) return "bg-red-500";
    return "bg-[#bce0f0]";
  };

  const fetchRef = async () => {
    try {
      const results = await fetch("http://localhost:3001/REF", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!results.ok) {
        throw new Error("Failed to fetch");
      }
      const refData = await results.json();
      setRef(refData.ref);
    } catch (e) {
      setErrorMessage(e.errorMessage);
    }
  };
  useEffect(() => {
    fetchRef();
  }, [token]);

  console.log(ref);

  return (
    <div>
      <table className="min-w-full mt-2 flex flex-col">
        <thead className=" justify-between">
          <tr className="grid grid-cols-7">
            <th>ID</th>
            <th>Email</th>
            <th>Order</th>
            <th>Reason</th>
            <th>Created At</th>
            <th>Finished</th>
            <th>Wrong</th>
          </tr>
        </thead>
        <tbody>
          {ref &&
            ref.map((ref) => (
              <tr
                key={ref.idref}
                className={`${color(ref.idref)} grid grid-cols-7 text-center`}
              >
                <td>{ref.idref}</td>
                <td>{ref.email}</td>
                <td>{ref.orderNo}</td>
                <td>{ref.rfr}</td>

                <td>
                  {ref["created At"]
                    ?.replace("T", " ")
                    .replace("Z", "")
                    .replace(".000", "")}
                </td>

                <td>
                  <input
                    type="checkbox"
                    onChange={() => handleToggleCheck(ref.idref, "finished")}
                    checked={ref?.finished}
                  />
                </td>
                <td>
                  <input
                    type="checkbox"
                    onChange={() => handleToggleCheck(ref.idref, "wrong")}
                    checked={ref?.wrong}
                  />
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
