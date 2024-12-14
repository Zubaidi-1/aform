import { useState, useEffect } from "react";

export default function RefundsForm() {
  const [refunds, setRefunds] = useState([]); // Default to an empty array
  const [error, setError] = useState(null);
  const token = localStorage.getItem("authToken");
  const [checked, setChecked] = useState({});
  const [dates, setDates] = useState([]);
  const [emails, setEmails] = useState([]);
  const [filter, setFilter] = useState({
    platform: "",
    date: "",
    email: "",
    status: "",
  });

  const fetchRefunds = async () => {
    try {
      const response = await fetch("http://localhost:3001/refunds", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setRefunds(data.refunds);
    } catch (err) {
      console.error("Failed to fetch refunds:", err);
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchRefunds();
  }, [token]);

  useEffect(() => {
    // Get all unique dates and emails
    setDates([
      ...new Set(refunds.map((refund) => refund["Created at"]?.split("T")[0])),
    ]);
    setEmails([...new Set(refunds.map((refund) => refund.email))]);
  }, [refunds]);

  const handleChange = async (id, type) => {
    setChecked((prev) => ({
      ...prev,
      [id]: {
        finished:
          type === "finished" ? !prev[id]?.finished : prev[id]?.finished,
        wrong: type === "wrong" ? !prev[id]?.wrong : prev[id]?.wrong,
        hold: type === "hold" ? !prev[id]?.hold : prev[id]?.hold,
      },
    }));

    const newFinishedValue =
      type === "finished"
        ? !checked[id]?.finished
        : type === "hold"
        ? !checked[id]?.hold
        : type === "wrong"
        ? !checked[id]?.wrong
        : false;

    try {
      const response = await fetch(`http://localhost:3001/refunds`, {
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
        throw new Error(`Failed to update refund ID: ${id}`);
      }

      fetchRefunds(); // Refresh the data after update
    } catch (error) {
      console.error("Error updating refund:", error);
      setError(`Failed to update refund ID ${id}`);
    }
  };

  const filterChange = (e) => {
    const { name, value } = e.target;
    setFilter((prev) => ({ ...prev, [name]: value }));
  };

  const getRowClass = (id) => {
    if (checked[id]?.finished || refunds[id - 1].finished)
      return "bg-green-300";
    if (checked[id]?.hold || refunds[id - 1].hold) return "bg-yellow-300";
    if (checked[id]?.wrong || refunds[id - 1].wrong) return "bg-red-300";
    return "bg-[#bce0f0]"; // Default color
  };

  // Filter refunds based on the active filter state
  const filteredRefunds = refunds.filter((refund) => {
    const matchesPlatform = filter.platform
      ? refund.platform === filter.platform
      : true;
    const matchesDate = filter.date
      ? refund["Created at"]?.split("T")[0] === filter.date
      : true;
    const matchesEmail = filter.email ? refund.email === filter.email : true;
    const matchesStatus = filter.status
      ? (filter.status === "finished" && refund.finished) ||
        (filter.status === "wrong" && refund.wrong) ||
        (filter.status === "hold" && refund.hold)
      : true;

    return matchesPlatform && matchesDate && matchesEmail && matchesStatus;
  });
  console.log([filteredRefunds[0]]);
  return (
    <div className="p-4">
      {error ? (
        <p className="text-red-600">Error: {error}</p>
      ) : (
        <div>
          {/* Filter Section */}
          <div className="flex justify-center gap-4 p-4 bg-gray-100 rounded-md mb-4 shadow-md">
            <select
              name="platform"
              onChange={filterChange}
              value={filter.platform}
              className="px-4 py-2 bg-white border border-gray-300 rounded-md"
            >
              <option value="" disabled>
                Platform
              </option>
              <option>eBay</option>
              <option>Amazon</option>
              <option>WooCommerce</option>
            </select>

            <select
              name="date"
              onChange={filterChange}
              value={filter.date}
              className="px-4 py-2 bg-white border border-gray-300 rounded-md"
            >
              <option value="" disabled>
                Date
              </option>
              {dates.map((date, index) => (
                <option key={index} value={date}>
                  {date}
                </option>
              ))}
            </select>

            <select
              name="email"
              onChange={filterChange}
              value={filter.email}
              className="px-4 py-2 bg-white border border-gray-300 rounded-md"
            >
              <option value="" disabled>
                Email
              </option>
              {emails.map((email, index) => (
                <option key={index} value={email}>
                  {email}
                </option>
              ))}
            </select>

            <select
              name="status"
              onChange={filterChange}
              value={filter.status}
              className="px-4 py-2 bg-white border border-gray-300 rounded-md"
            >
              <option value="" disabled>
                Status
              </option>
              <option value="finished">Finished</option>
              <option value="wrong">Wrong</option>
              <option value="hold">Hold</option>
            </select>

            <button
              onClick={() => {
                setFilter({ platform: "", date: "", email: "", status: "" });
              }}
              className="px-6 py-2 text-white bg-red-500 rounded-md"
            >
              Clear Filters
            </button>
          </div>

          {/* Refunds Table */}
          {filteredRefunds.length > 0 ? (
            <table
              className="p-2 rounded-full shadow-[#219ebc]"
              border="1"
              cellPadding="10"
              style={{ width: "100%", textAlign: "left" }}
            >
              <thead>
                <tr className="grid grid-cols-12  text-sm text-center bg-[#219ebc] text-[#92140c]">
                  <th>Email</th>
                  <th>Order</th>
                  <th>Reason for Refund</th>
                  <th>Tracking</th>
                  <th>Amount</th>
                  <th>Description</th>
                  <th>Reason for Discount</th>
                  <th>Platform</th>
                  <th>Created At</th>
                  <th>Finished</th>
                  <th>Wrong</th>
                  <th>Hold</th>
                </tr>
              </thead>
              <tbody>
                {filteredRefunds.map((refund) => (
                  <tr
                    className={`grid grid-cols-12 text-xs justify-center items-center text-center ${getRowClass(
                      refund.id
                    )}`}
                    key={refund.id}
                  >
                    <td>{refund.email}</td>
                    <td>{refund.orderNumber}</td>
                    <td>{refund.reasonForRefund}</td>
                    <td>{refund.tracking}</td>
                    <td>{refund.amount}</td>
                    <td>{refund.description}</td>
                    <td>
                      {refund.reasonForDiscount ? refund.reasonForDiscount : ""}
                    </td>
                    <td>{refund.platform}</td>
                    <td>
                      {refund["Created at"]?.split("T")[0]
                        ? refund["Created at"]?.split("T")[0]
                        : null}
                    </td>
                    <td>
                      <input
                        checked={
                          checked[refund.id]?.finished ||
                          refund.finished ||
                          false
                        }
                        type="checkbox"
                        onChange={() => handleChange(refund.id, "finished")}
                      />
                    </td>
                    <td>
                      <input
                        checked={
                          checked[refund.id]?.wrong || refund.wrong || false
                        }
                        type="checkbox"
                        onChange={() => handleChange(refund.id, "wrong")}
                      />
                    </td>
                    <td>
                      <input
                        checked={
                          checked[refund.id]?.hold || refund.hold || false
                        }
                        type="checkbox"
                        onChange={() => handleChange(refund.id, "hold")}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No refunds available.</p>
          )}
        </div>
      )}
    </div>
  );
}
