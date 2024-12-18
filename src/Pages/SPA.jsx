import { useEffect, useState } from "react";
export default function SPA() {
  const token = localStorage.getItem("authToken");
  const [spanish, setSpanish] = useState([]);
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
      const result = await fetch(
        "https://backendaform-production.up.railway.app/SPA",
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

      fetchSpanish();
    } catch (e) {
      setErrorMessage(e.message);
    }
  };
  const color = (id) => {
    if (spanish[id - 1]?.finished) return "bg-green-500";
    if (spanish[id - 1]?.wrong) return "bg-red-500";
    return "bg-[#bce0f0]";
  };

  const fetchSpanish = async () => {
    try {
      const results = await fetch(
        "https://backendaform-production.up.railway.app/SPA",
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
      const spanishData = await results.json();
      setSpanish(spanishData.spa);
    } catch (e) {
      setErrorMessage(e.errorMessage);
    }
  };
  useEffect(() => {
    fetchSpanish();
  }, [token]);

  console.log(spanish, "HOLA");

  return (
    <div>
      <table className="min-w-full mt-2 flex flex-col">
        <thead className=" justify-between">
          <tr className="grid grid-cols-7">
            <th>ID</th>
            <th>Email</th>
            <th>Order</th>
            <th>Phone Number</th>
            <th>Created At</th>
            <th>Finished</th>
            <th>Wrong</th>
          </tr>
        </thead>
        <tbody>
          {spanish &&
            spanish.map((spanish) => (
              <tr
                key={spanish.idspanish}
                className={`${color(
                  spanish.idspanish
                )} grid grid-cols-7 text-center`}
              >
                <td>{spanish.idspanish}</td>
                <td>{spanish.email}</td>
                <td>{spanish.orderNo ? spanish.orderNo : null}</td>
                <td>{spanish.phoneNumber}</td>

                <td>
                  {spanish["created At"]
                    ?.replace("T", " ")
                    .replace("Z", "")
                    .replace(".000", "")}
                </td>

                <td>
                  <input
                    type="checkbox"
                    onChange={() =>
                      handleToggleCheck(spanish.idspanish, "finished")
                    }
                    checked={spanish?.finished}
                  />
                </td>
                <td>
                  <input
                    type="checkbox"
                    onChange={() =>
                      handleToggleCheck(spanish.idspanish, "wrong")
                    }
                    checked={spanish?.wrong}
                  />
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
