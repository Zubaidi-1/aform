import { useEffect, useState } from "react";
export default function Listing() {
  const token = localStorage.getItem("authToken");
  const [listing, setListing] = useState([]);
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
      const result = await fetch("http://localhost:3001/LE", {
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

      fetchListing();
    } catch (e) {
      setErrorMessage(e.message);
    }
  };
  const color = (id) => {
    if (listing[id - 1]?.finished) return "bg-green-500";
    if (listing[id - 1]?.wrong) return "bg-red-500";
    return "bg-[#bce0f0]";
  };

  const fetchListing = async () => {
    try {
      const results = await fetch("http://localhost:3001/LE", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!results.ok) {
        throw new Error("Failed to fetch");
      }
      const listingData = await results.json();
      setListing(listingData.list);
    } catch (e) {
      setErrorMessage(e.errorMessage);
    }
  };
  useEffect(() => {
    fetchListing();
  }, [token]);

  console.log(listing);

  return (
    <div>
      <table className="min-w-full mt-2 flex flex-col">
        <thead className=" justify-between">
          <tr className="grid grid-cols-11">
            <th>ID</th>
            <th>Email</th>
            <th>Order</th>

            <th>Listing</th>
            <th>Platform</th>
            <th>Error Type</th>
            <th>Error</th>
            <th>Description</th>
            <th>Created At</th>
            <th>Finished</th>
            <th>Wrong</th>
          </tr>
        </thead>
        <tbody>
          {listing &&
            listing.map((listing) => (
              <tr
                key={listing.idllisting}
                className={`${color(
                  listing.idlisting
                )} grid grid-cols-11 text-center`}
              >
                <td>{listing.idlisting}</td>
                <td>{listing.email}</td>
                <td>{listing.orderNo}</td>
                <td>{listing.listing}</td>
                <td>{listing.platform}</td>
                <td>{listing.errorType}</td>
                <td>{listing.error}</td>
                <td>{listing.description}</td>
                <td>
                  {listing["created At"]
                    ?.replace("T", " ")
                    .replace("Z", "")
                    .replace(".000", "")}
                </td>

                <td>
                  <input
                    type="checkbox"
                    onChange={() =>
                      handleToggleCheck(listing.idlisting, "finished")
                    }
                    checked={listing?.finished}
                  />
                </td>
                <td>
                  <input
                    type="checkbox"
                    onChange={() =>
                      handleToggleCheck(listing.idlisting, "wrong")
                    }
                    checked={listing?.wrong}
                  />
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
