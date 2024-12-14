export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col justify-center items-center">
      <form className="flex flex-col justify-center items-center gap-5 min-h-screen">
        <input
          type="text"
          id="Name"
          class="bg-[#68C5DB] border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-[#02182B] dark:border-[#68C5DB] dark:placeholder-[#68C5DB] dark:text-[#68C5DB] dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Request"
          required
        />
        <input
          type="text"
          id="Order"
          class="bg-[#68C5DB] border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-[#02182B] dark:border-[#68C5DB] dark:placeholder-[#68C5DB] dark:text-[#68C5DB] dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Order Number"
          required
        />

        <button className="bg-[#02182b] text-[#68C5DB] p-2 rounded-lg ">
          {" "}
          Submit{" "}
        </button>
      </form>
    </div>
  );
}
