import { useEffect, useState } from "react";
export default function Contact() {
  const token = localStorage.getItem("authToken");
  const [contact, setContact] = useState([]);
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
      const result = await fetch("http://localhost:3001/CC", {
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

      fetchCC();
    } catch (e) {
      setErrorMessage(e.message);
    }
  };
  const color = (id) => {
    if (contact[id - 1]?.finished) return "bg-green-500";
    if (contact[id - 1]?.wrong) return "bg-red-500";
    return "bg-[#bce0f0]";
  };

  const fetchCC = async () => {
    try {
      const results = await fetch("http://localhost:3001/CC", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!results.ok) {
        throw new Error("Failed to fetch");
      }
      const CCData = await results.json();
      setContact(CCData.cc);
    } catch (e) {
      setErrorMessage(e.errorMessage);
    }
  };
  useEffect(() => {
    fetchCC();
  }, [token]);

  console.log(contact);

  return (
    <div>
      <table className="min-w-full mt-2 flex flex-col">
        <thead className=" justify-between">
          <tr className="grid grid-cols-8">
            <th>ID</th>
            <th>Email</th>
            <th>Order</th>
            <th>Phone Number</th>
            <th>Reason</th>
            <th>Created At</th>
            <th>Finished</th>
            <th>Wrong</th>
          </tr>
        </thead>
        <tbody>
          {contact &&
            contact.map((cc) => (
              <tr
                key={cc.idcontact}
                className={`${color(
                  cc.idcontact
                )} grid grid-cols-8 text-center`}
              >
                <td>{cc.idcontact}</td>
                <td>{cc.email}</td>
                <td>{cc.orderNo}</td>
                <td>{cc.phoneNumber}</td>
                <td>{cc.reason}</td>

                <td>
                  {cc["created At"]
                    ?.replace("T", " ")
                    .replace("Z", "")
                    .replace(".000", "")}
                </td>

                <td>
                  <input
                    type="checkbox"
                    onChange={() => handleToggleCheck(cc.idcontact, "finished")}
                    checked={cc?.finished}
                  />
                </td>
                <td>
                  <input
                    type="checkbox"
                    onChange={() => handleToggleCheck(cc.idcontact, "wrong")}
                    checked={cc?.wrong}
                  />
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
