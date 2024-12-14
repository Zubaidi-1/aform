import { useEffect, useState } from "react";
export default function PWDC() {
  const token = localStorage.getItem("authToken");
  const [pwdc, setPWDC] = useState([]);
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
      const result = await fetch("http://localhost:3001/PWDC", {
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

      fetchPWDC();
    } catch (e) {
      setErrorMessage(e.message);
    }
  };
  const color = (id) => {
    if (pwdc[id - 1]?.finished) return "bg-green-500";
    if (pwdc[id - 1]?.wrong) return "bg-red-500";
    return "bg-[#bce0f0]";
  };

  const fetchPWDC = async () => {
    try {
      const results = await fetch("http://localhost:3001/PWDC", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!results.ok) {
        throw new Error("Failed to fetch");
      }
      const pwdcData = await results.json();
      setPWDC(pwdcData.pwdc);
    } catch (e) {
      setErrorMessage(e.errorMessage);
    }
  };
  useEffect(() => {
    fetchPWDC();
  }, [token]);

  console.log(pwdc);

  return (
    <div>
      <table className="min-w-full mt-2 flex flex-col">
        <thead className=" justify-between">
          <tr className="grid grid-cols-7">
            <th>ID</th>
            <th>Email</th>
            <th>Part Name</th>
            <th>Specs</th>
            <th>Created At</th>
            <th>Finished</th>
            <th>Wrong</th>
          </tr>
        </thead>
        <tbody>
          {pwdc &&
            pwdc.map((pwdc) => (
              <tr
                key={pwdc.idpwdc}
                className={`${color(pwdc.idpwdc)} grid grid-cols-7 text-center`}
              >
                <td>{pwdc.idpwdc}</td>
                <td>{pwdc.email}</td>
                <td>{pwdc.partName}</td>
                <td>{pwdc.specs}</td>

                <td>
                  {pwdc["created At"]
                    ?.replace("T", " ")
                    .replace("Z", "")
                    .replace(".000", "")}
                </td>

                <td>
                  <input
                    type="checkbox"
                    onChange={() => handleToggleCheck(pwdc.idpwdc, "finished")}
                    checked={pwdc?.finished}
                  />
                </td>
                <td>
                  <input
                    type="checkbox"
                    onChange={() => handleToggleCheck(pwdc.idpwdc, "wrong")}
                    checked={pwdc?.wrong}
                  />
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
