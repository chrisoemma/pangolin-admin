import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Plus, Edit, Search, Users, Eye, Trash2 } from 'lucide-react'
import { tutorsService, type Tutor } from '../../../services/tutorsService'
import Pagination from '../../../components/Pagination'
import Loader from '../../../components/Loader'
import ConfirmationModal from '../../../components/ConfirmationModal'
import { useToast } from '../../../contexts/ToastContext'

const Tutors = () => {
  const navigate = useNavigate()
  const toast = useToast()
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 15
  
  const [tutors, setTutors] = useState<Tutor[]>([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<number | string | null>(null)
  const [confirmationModal, setConfirmationModal] = useState<{
    isOpen: boolean
    tutor: Tutor | null
  } | null>(null)

  useEffect(() => {
    fetchTutors()
  }, [])

  const fetchTutors = async () => {
    setLoading(true)
    try {
      const response = await tutorsService.getAll()

      console.log('response,123455', response)
      if (response.status && response.data) {
        setTutors(Array.isArray(response.data) ? response.data : [])
      } else {
        toast.error('Failed to fetch tutors')
        setTutors([])
      }
    } catch (error) {
      console.error('Error fetching tutors:', error)
      toast.error('Error fetching tutors')
      setTutors([])
    } finally {
      setLoading(false)
    }
  }

  const filteredTutors = tutors.filter(
    (tutor) =>
      tutor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (tutor.email && tutor.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (tutor.phone && tutor.phone.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const totalPages = Math.ceil(filteredTutors.length / itemsPerPage)
  const paginatedTutors = filteredTutors.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm])

  const handleDeleteClick = (tutor: Tutor) => {
    setConfirmationModal({
      isOpen: true,
      tutor,
    })
  }

  const handleDelete = async () => {
    if (!confirmationModal?.tutor) return

    const tutor = confirmationModal.tutor
    setDeletingId(tutor.id)
    setConfirmationModal(null)

    try {
      const response = await tutorsService.delete(tutor.id)
      if (response.status) {
        toast.success(`"${tutor.name}" has been deleted successfully.`)
        fetchTutors()
      } else {
        toast.error(response.message || 'Failed to delete tutor')
      }
    } catch (error) {
      console.error('Error deleting tutor:', error)
      toast.error('Error deleting tutor')
    } finally {
      setDeletingId(null)
    }
  }

  if (loading) {
    return <Loader fullScreen text="Loading tutors..." />
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tutors</h1>
          <p className="text-gray-600 mt-2">Manage all tutors in the system</p>
        </div>
        <Link
          to="/master-data/tutors/new"
          className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
        >
          <Plus size={20} />
          Add New Tutor
        </Link>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search tutors by name, email, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
      </div>

      {/* Tutors Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {filteredTutors.length === 0 ? (
          <div className="text-center py-12">
            <Users className="mx-auto mb-4 text-gray-400" size={48} />
            <p className="text-gray-500 mb-4">No tutors found</p>
            <Link
              to="/master-data/tutors/new"
              className="text-primary hover:underline font-medium"
            >
              Add your first tutor
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
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Phone
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedTutors.map((tutor) => (
                    <tr key={tutor.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{tutor.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{tutor.email || '-'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{tutor.phone || '-'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <button
                          onClick={() => navigate(`/master-data/tutors/${tutor.id}`)}
                          className="text-primary hover:text-primary/80 inline-flex items-center gap-1"
                        >
                          <Eye size={16} />
                          View
                        </button>
                        <Link
                          to={`/master-data/tutors/${tutor.id}/edit`}
                          className="text-primary hover:text-primary/80 inline-flex items-center gap-1"
                        >
                          <Edit size={16} />
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDeleteClick(tutor)}
                          disabled={deletingId === tutor.id}
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
            {filteredTutors.length > 0 && (
              <div className="border-t border-gray-200 px-4 py-3">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                  itemsPerPage={itemsPerPage}
                  totalItems={filteredTutors.length}
                />
              </div>
            )}
          </>
        )}
      </div>

      {/* Confirmation Modal */}
      {confirmationModal && (
        <ConfirmationModal
          isOpen={confirmationModal.isOpen}
          onClose={() => setConfirmationModal(null)}
          onConfirm={handleDelete}
          title="Delete Tutor"
          message={`Are you sure you want to delete "${confirmationModal.tutor?.name}"? This action cannot be undone.`}
          type="danger"
          isLoading={deletingId !== null}
        />
      )}
    </div>
  )
}

export default Tutors

