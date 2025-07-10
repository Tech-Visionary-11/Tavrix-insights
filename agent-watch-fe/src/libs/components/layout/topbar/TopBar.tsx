import { Plus } from "lucide-react"

export function Topbar() {
  return (
    <div className="flex justify-between items-center py-4 px-6 bg-white border-b sticky top-0 z-10">
      <h1 className="text-xl font-bold text-gray-900">AI Agent Dashboard</h1>

      <div className="flex items-center gap-4">
        <button className="flex items-center gap-2 bg-indigo-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-indigo-700 transition">
          <Plus className="w-4 h-4" />
          Add Agent
        </button>

        {/* Replace this img with dynamic user avatar later */}
        <img
          src="https://i.pravatar.cc/300"
          alt="User"
          className="w-9 h-9 rounded-full object-cover border"
        />
      </div>
    </div>
  )
}
