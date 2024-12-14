import { useEffect, useState } from "react";

export default function User() {
  const [users, setUsers] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");
  const token = localStorage.getItem("authToken");
  const [role, setRole] = useState({ role: "", email: "" });

  const fetchUsers = async () => {
    try {
      const response = await fetch("http://localhost:3001/userControl", {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Handle access denied response
      if (response.status === 403) {
        setErrorMsg("No access - You do not have permission.");
        return;
      }

      if (!response.ok) {
        console.log(response);
        throw new Error("Failed to fetch users.");
      }

      const { users } = await response.json();
      setUsers(users);
    } catch (e) {
      setErrorMsg(e.message || "An error occurred.");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleChange = async (email, event) => {
    const newRole = event.target.value;

    try {
      const response = await fetch("http://localhost:3001/userControl", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role: newRole, email }),
      });

      if (!response.ok) {
        throw new Error("Failed to update role.");
      }

      
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.emailusers === email ? { ...user, role: newRole } : user
        )
      );
    } catch (e) {
      setErrorMsg(e.message || "Failed to update role.");
    }
  };

  return (
    <div className="flex justify-center mt-12">
      <div className="w-full max-w-lg">
        {/* Error message */}
        {errorMsg && <p className="text-red-500 text-center">{errorMsg}</p>}

        {/* Users list */}
        <ul className="">
          {users.length
            ? users.map((user) => (
                <div
                  key={user.idusers}
                  className="grid grid-cols-2 gap-12 mb-4"
                >
                  <li className="bg-[#219ebc] p-2 shadow-md rounded-md shadow-[#219ebc]">
                    {user.emailusers}
                  </li>
                  <li>
                    <select
                      onChange={(e) => handleChange(user.emailusers, e)}
                      value={user.role} // Bind the selected option to the user role
                      className="block w-full px-4 py-2 text-gray-700 bg-white border-2 border-[#219ebc] rounded-md shadow-md appearance-none focus:outline-none focus:ring-2 focus:ring-[#1d79a3] focus:border-[#1d79a3] transition duration-300"
                    >
                      <option value="Admin">Admin</option>
                      <option value="Agent">Agent</option>
                    </select>
                  </li>
                </div>
              ))
            : null}
        </ul>
      </div>
    </div>
  );
}
