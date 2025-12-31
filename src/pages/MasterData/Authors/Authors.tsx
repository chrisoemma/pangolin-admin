import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Plus, Edit, Search, BookOpen, Eye, Trash2 } from 'lucide-react'
import { authorsService, type Author } from '../../../services/authorsService'
import Pagination from '../../../components/Pagination'
import Loader from '../../../components/Loader'
import ConfirmationModal from '../../../components/ConfirmationModal'
import { useToast } from '../../../contexts/ToastContext'

const Authors = () => {
  const navigate = useNavigate()
  const toast = useToast()
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 15
  
  const [authors, setAuthors] = useState<Author[]>([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<number | string | null>(null)
  const [confirmationModal, setConfirmationModal] = useState<{
    isOpen: boolean
    author: Author | null
  } | null>(null)

  useEffect(() => {
    fetchAuthors()
  }, [])

  const fetchAuthors = async () => {
    setLoading(true)
    try {
      const response = await authorsService.getAll()
      if (response.status && response.data) {
        setAuthors(Array.isArray(response.data) ? response.data : [])
      } else {
        toast.error('Failed to fetch authors')
        setAuthors([])
      }
    } catch (error) {
      console.error('Error fetching authors:', error)
      toast.error('Error fetching authors')
      setAuthors([])
    } finally {
      setLoading(false)
    }
  }

  const filteredAuthors = authors.filter(
    (author) =>
      author.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (author.email && author.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (author.bio && author.bio.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const totalPages = Math.ceil(filteredAuthors.length / itemsPerPage)
  const paginatedAuthors = filteredAuthors.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm])

  const handleDeleteClick = (author: Author) => {
    setConfirmationModal({
      isOpen: true,
      author,
    })
  }

  const handleDelete = async () => {
    if (!confirmationModal?.author) return

    const author = confirmationModal.author
    setDeletingId(author.id)
    setConfirmationModal(null)

    try {
      const response = await authorsService.delete(author.id)
      if (response.status) {
        toast.success(`"${author.name}" has been deleted successfully.`)
        fetchAuthors()
      } else {
        toast.error(response.message || 'Failed to delete author')
      }
    } catch (error) {
      console.error('Error deleting author:', error)
      toast.error('Error deleting author')
    } finally {
      setDeletingId(null)
    }
  }

  if (loading) {
    return <Loader fullScreen text="Loading authors..." />
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Authors</h1>
          <p className="text-gray-600 mt-2">Manage all authors in the system</p>
        </div>
        <Link
          to="/master-data/authors/new"
          className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
        >
          <Plus size={20} />
          Add New Author
        </Link>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search authors by name, email, or bio..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
      </div>

      {/* Authors Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {filteredAuthors.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="mx-auto mb-4 text-gray-400" size={48} />
            <p className="text-gray-500 mb-4">No authors found</p>
            <Link
              to="/master-data/authors/new"
              className="text-primary hover:underline font-medium"
            >
              Add your first author
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
                  Bio
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedAuthors.map((author) => (
                <tr key={author.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{author.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{author.email || '-'}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-500 max-w-xs truncate">
                      {author.bio || '-'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {author.created_at ? new Date(author.created_at).toLocaleDateString() : '-'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      onClick={() => navigate(`/master-data/authors/${author.id}`)}
                      className="text-primary hover:text-primary/80 inline-flex items-center gap-1"
                    >
                      <Eye size={16} />
                      View
                    </button>
                    <Link
                      to={`/master-data/authors/${author.id}/edit`}
                      className="text-primary hover:text-primary/80 inline-flex items-center gap-1"
                    >
                      <Edit size={16} />
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDeleteClick(author)}
                      disabled={deletingId === author.id}
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
        )}
        {filteredAuthors.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            itemsPerPage={itemsPerPage}
            totalItems={filteredAuthors.length}
          />
        )}
      </div>

      {confirmationModal && (
        <ConfirmationModal
          isOpen={confirmationModal.isOpen}
          onClose={() => setConfirmationModal(null)}
          onConfirm={handleDelete}
          title="Delete Author"
          message={`Are you sure you want to delete "${confirmationModal.author?.name}"? This action cannot be undone.`}
          type="danger"
          isLoading={deletingId !== null}
        />
      )}
    </div>
  )
}

export default Authors

