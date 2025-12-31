import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Plus, Edit, Search, Database, Eye, Trash2 } from 'lucide-react'
import { yearOfStudyService, type YearOfStudy } from '../../../services/yearOfStudyService'
import Pagination from '../../../components/Pagination'
import Loader from '../../../components/Loader'
import ConfirmationModal from '../../../components/ConfirmationModal'
import { useToast } from '../../../contexts/ToastContext'

const YearOfStudyList = () => {
  const navigate = useNavigate()
  const toast = useToast()
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 15
  
  const [years, setYears] = useState<YearOfStudy[]>([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<number | string | null>(null)
  const [confirmationModal, setConfirmationModal] = useState<{
    isOpen: boolean
    year: YearOfStudy | null
  } | null>(null)

  useEffect(() => {
    fetchYears()
  }, [])

  const fetchYears = async () => {
    setLoading(true)
    try {
      const response = await yearOfStudyService.getAll()
      if (response.status && response.data) {
        setYears(Array.isArray(response.data) ? response.data : [])
      } else {
        toast.error('Failed to fetch years of study')
        setYears([])
      }
    } catch (error) {
      console.error('Error fetching years of study:', error)
      toast.error('Error fetching years of study')
      setYears([])
    } finally {
      setLoading(false)
    }
  }

  const filteredYears = years.filter(
    (year) =>
      year.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (year.description && year.description.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const totalPages = Math.ceil(filteredYears.length / itemsPerPage)
  const paginatedYears = filteredYears.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm])

  const handleDeleteClick = (year: YearOfStudy) => {
    setConfirmationModal({
      isOpen: true,
      year,
    })
  }

  const handleDelete = async () => {
    if (!confirmationModal?.year) return

    const year = confirmationModal.year
    setDeletingId(year.id)
    setConfirmationModal(null)

    try {
      const response = await yearOfStudyService.delete(year.id)
      if (response.status) {
        toast.success(`"${year.name}" has been deleted successfully.`)
        fetchYears()
      } else {
        toast.error(response.message || 'Failed to delete year of study')
      }
    } catch (error) {
      console.error('Error deleting year of study:', error)
      toast.error('Error deleting year of study')
    } finally {
      setDeletingId(null)
    }
  }

  if (loading) {
    return <Loader fullScreen text="Loading years of study..." />
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Year of Study</h1>
          <p className="text-gray-600 mt-2">Manage all years of study in the system</p>
        </div>
        <Link
          to="/master-data/year-of-study/new"
          className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
        >
          <Plus size={20} />
          Add New Year
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search years of study..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {filteredYears.length === 0 ? (
          <div className="text-center py-12">
            <Database className="mx-auto mb-4 text-gray-400" size={48} />
            <p className="text-gray-500 mb-4">No years of study found</p>
            <Link
              to="/master-data/year-of-study/new"
              className="text-primary hover:underline font-medium"
            >
              Add your first year
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
                  {paginatedYears.map((year) => (
                    <tr key={year.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{year.name}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-500">{year.description || '-'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <button
                          onClick={() => navigate(`/master-data/year-of-study/${year.id}`)}
                          className="text-primary hover:text-primary/80 inline-flex items-center gap-1"
                        >
                          <Eye size={16} />
                          View
                        </button>
                        <Link
                          to={`/master-data/year-of-study/${year.id}/edit`}
                          className="text-primary hover:text-primary/80 inline-flex items-center gap-1"
                        >
                          <Edit size={16} />
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDeleteClick(year)}
                          disabled={deletingId === year.id}
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
            {filteredYears.length > 0 && (
              <div className="border-t border-gray-200 px-4 py-3">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                  itemsPerPage={itemsPerPage}
                  totalItems={filteredYears.length}
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
          title="Delete Year of Study"
          message={`Are you sure you want to delete "${confirmationModal.year?.name}"? This action cannot be undone.`}
          type="danger"
          isLoading={deletingId !== null}
        />
      )}
    </div>
  )
}

export default YearOfStudyList

