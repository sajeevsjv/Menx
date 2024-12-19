// Dashboard.js
import React from "react";

const Dashboard = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white flex flex-col">
        <div className="p-4 text-2xl font-bold">Admin Panel</div>
        <nav className="flex-1">
          <ul>
            <li className="p-4 hover:bg-gray-700 cursor-pointer">Dashboard</li>
            <li className="p-4 hover:bg-gray-700 cursor-pointer">Buyers</li>
            <li className="p-4 hover:bg-gray-700 cursor-pointer">Sellers</li>
            <li className="p-4 hover:bg-gray-700 cursor-pointer">Products</li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="p-6 bg-white shadow-md flex justify-between items-center">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <div className="flex items-center space-x-4">
            <button className="bg-blue-500 text-white px-4 py-2 rounded">Logout</button>
          </div>
        </header>

        {/* Content */}
        <main className="p-6 flex-1 overflow-y-auto">
          {/* Overview Cards */}
          <div className="grid grid-cols-3 gap-6">
            <div className="bg-white p-6 shadow-md rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Total Buyers</h3>
              <p className="text-2xl font-bold">150</p>
            </div>
            <div className="bg-white p-6 shadow-md rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Total Sellers</h3>
              <p className="text-2xl font-bold">50</p>
            </div>
            <div className="bg-white p-6 shadow-md rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Total Products</h3>
              <p className="text-2xl font-bold">1200</p>
            </div>
          </div>

          {/* Product Table */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">All Products</h2>
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b">ID</th>
                  <th className="py-2 px-4 border-b">Name</th>
                  <th className="py-2 px-4 border-b">Category</th>
                  <th className="py-2 px-4 border-b">Price</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="py-2 px-4 border-b">1</td>
                  <td className="py-2 px-4 border-b">Product A</td>
                  <td className="py-2 px-4 border-b">Category 1</td>
                  <td className="py-2 px-4 border-b">$10</td>
                </tr>
                <tr>
                  <td className="py-2 px-4 border-b">2</td>
                  <td className="py-2 px-4 border-b">Product B</td>
                  <td className="py-2 px-4 border-b">Category 2</td>
                  <td className="py-2 px-4 border-b">$20</td>
                </tr>
                <tr>
                  <td className="py-2 px-4 border-b">3</td>
                  <td className="py-2 px-4 border-b">Product C</td>
                  <td className="py-2 px-4 border-b">Category 3</td>
                  <td className="py-2 px-4 border-b">$30</td>
                </tr>
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
