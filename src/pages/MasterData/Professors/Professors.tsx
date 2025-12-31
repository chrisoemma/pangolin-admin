import { useState, useMemo, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Plus, Edit, Search, Users, Eye, Trash2 } from 'lucide-react'
import { mockProfessors, type Professor } from '../../../data/mockData'
import Pagination from '../../../components/Pagination'
import Loader from '../../../components/Loader'

const Professors = () => {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5
  
  // TODO: Replace with actual data from API
  const [professors, setProfessors] = useState<Professor[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // TODO: Fetch professors from API
    setLoading(true)
    setTimeout(() => {
      setProfessors(mockProfessors)
      setLoading(false)
    }, 500)
  }, [])

  const filteredProfessors = useMemo(() => 
    professors.filter(
      (professor) =>
        professor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        professor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        professor.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
        professor.specialization.toLowerCase().includes(searchTerm.toLowerCase())
    ),
    [professors, searchTerm]
  )

  const totalPages = Math.ceil(filteredProfessors.length / itemsPerPage)
  const paginatedProfessors = filteredProfessors.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  // Reset to page 1 when search changes
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm])

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this professor?')) {
      // TODO: Replace with actual API call
      setProfessors(prev => prev.filter(professor => professor.id !== id))
    }
  }

  if (loading) {
    return <Loader fullScreen text="Loading professors..." />
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Professors</h1>
          <p className="text-gray-600 mt-2">Manage all professors in the system</p>
        </div>
        <Link
          to="/master-data/professors/new"
          className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
        >
          <Plus size={20} />
          Add New Professor
        </Link>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search professors by name, email, department, or specialization..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
      </div>

      {/* Professors Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {filteredProfessors.length === 0 ? (
          <div className="text-center py-12">
            <Users className="mx-auto mb-4 text-gray-400" size={48} />
            <p className="text-gray-500 mb-4">No professors found</p>
            <Link
              to="/master-data/professors/new"
              className="text-primary hover:underline font-medium"
            >
              Add your first professor
            </Link>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Specialization
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedProfessors.map((professor) => (
                <tr key={professor.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{professor.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{professor.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{professor.department}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-500">{professor.specialization}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      onClick={() => navigate(`/master-data/professors/${professor.id}`)}
                      className="text-primary hover:text-primary/80 inline-flex items-center gap-1"
                    >
                      <Eye size={16} />
                      View
                    </button>
                    <Link
                      to={`/master-data/professors/${professor.id}/edit`}
                      className="text-primary hover:text-primary/80 inline-flex items-center gap-1"
                    >
                      <Edit size={16} />
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(professor.id)}
                      className="text-red-600 hover:text-red-800 inline-flex items-center gap-1"
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {filteredProfessors.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            itemsPerPage={itemsPerPage}
            totalItems={filteredProfessors.length}
          />
        )}
      </div>
    </div>
  )
}

export default Professors

