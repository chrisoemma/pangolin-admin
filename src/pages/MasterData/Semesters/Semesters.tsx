import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Plus, Edit, Search, Database, Eye, Trash2 } from 'lucide-react'
import { semestersService, type Semester } from '../../../services/semestersService'
import Pagination from '../../../components/Pagination'
import Loader from '../../../components/Loader'
import ConfirmationModal from '../../../components/ConfirmationModal'
import { useToast } from '../../../contexts/ToastContext'

const Semesters = () => {
  const navigate = useNavigate()
  const toast = useToast()
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 15
  
  const [semesters, setSemesters] = useState<Semester[]>([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<number | string | null>(null)
  const [confirmationModal, setConfirmationModal] = useState<{
    isOpen: boolean
    semester: Semester | null
  } | null>(null)

  useEffect(() => {
    fetchSemesters()
  }, [])

  const fetchSemesters = async () => {
    setLoading(true)
    try {
      const response = await semestersService.getAll()
      if (response.status && response.data) {
        setSemesters(Array.isArray(response.data) ? response.data : [])
      } else {
        toast.error('Failed to fetch semesters')
        setSemesters([])
      }
    } catch (error) {
      console.error('Error fetching semesters:', error)
      toast.error('Error fetching semesters')
      setSemesters([])
    } finally {
      setLoading(false)
    }
  }

  const filteredSemesters = semesters.filter(
    (semester) =>
      semester.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (semester.description && semester.description.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const totalPages = Math.ceil(filteredSemesters.length / itemsPerPage)
  const paginatedSemesters = filteredSemesters.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm])

  const handleDeleteClick = (semester: Semester) => {
    setConfirmationModal({
      isOpen: true,
      semester,
    })
  }

  const handleDelete = async () => {
    if (!confirmationModal?.semester) return

    const semester = confirmationModal.semester
    setDeletingId(semester.id)
    setConfirmationModal(null)

    try {
      const response = await semestersService.delete(semester.id)
      if (response.status) {
        toast.success(`"${semester.name}" has been deleted successfully.`)
        fetchSemesters()
      } else {
        toast.error(response.message || 'Failed to delete semester')
      }
    } catch (error) {
      console.error('Error deleting semester:', error)
      toast.error('Error deleting semester')
    } finally {
      setDeletingId(null)
    }
  }

  if (loading) {
    return <Loader fullScreen text="Loading semesters..." />
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Semesters</h1>
          <p className="text-gray-600 mt-2">Manage all semesters in the system</p>
        </div>
        <Link
          to="/master-data/semesters/new"
          className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
        >
          <Plus size={20} />
          Add New Semester
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search semesters..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {filteredSemesters.length === 0 ? (
          <div className="text-center py-12">
            <Database className="mx-auto mb-4 text-gray-400" size={48} />
            <p className="text-gray-500 mb-4">No semesters found</p>
            <Link
              to="/master-data/semesters/new"
              className="text-primary hover:underline font-medium"
            >
              Add your first semester
            </Link>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedSemesters.map((semester) => (
                    <tr key={semester.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{semester.name}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-500">{semester.description || '-'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <button
                          onClick={() => navigate(`/master-data/semesters/${semester.id}`)}
                          className="text-primary hover:text-primary/80 inline-flex items-center gap-1"
                        >
                          <Eye size={16} />
                          View
                        </button>
                        <Link
                          to={`/master-data/semesters/${semester.id}/edit`}
                          className="text-primary hover:text-primary/80 inline-flex items-center gap-1"
                        >
                          <Edit size={16} />
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDeleteClick(semester)}
                          disabled={deletingId === semester.id}
                          className="text-red-600 hover:text-red-800 inline-flex items-center gap-1 disabled:opacity-50"
                        >
                          <Trash2 size={16} />
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filteredSemesters.length > 0 && (
              <div className="border-t border-gray-200 px-4 py-3">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                  itemsPerPage={itemsPerPage}
                  totalItems={filteredSemesters.length}
                />
              </div>
            )}
          </>
        )}
      </div>

      {confirmationModal && (
        <ConfirmationModal
          isOpen={confirmationModal.isOpen}
          onClose={() => setConfirmationModal(null)}
          onConfirm={handleDelete}
          title="Delete Semester"
          message={`Are you sure you want to delete "${confirmationModal.semester?.name}"? This action cannot be undone.`}
          type="danger"
          isLoading={deletingId !== null}
        />
      )}
    </div>
  )
}

export default Semesters

