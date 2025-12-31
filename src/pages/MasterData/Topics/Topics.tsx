import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Plus, Edit, Search, Database, Eye, Trash2 } from 'lucide-react'
import { topicsService, type Topic } from '../../../services/topicsService'
import Pagination from '../../../components/Pagination'
import Loader from '../../../components/Loader'
import ConfirmationModal from '../../../components/ConfirmationModal'
import { useToast } from '../../../contexts/ToastContext'

const Topics = () => {
  const navigate = useNavigate()
  const toast = useToast()
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 15
  
  const [topics, setTopics] = useState<Topic[]>([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<number | string | null>(null)
  const [confirmationModal, setConfirmationModal] = useState<{
    isOpen: boolean
    topic: Topic | null
  } | null>(null)

  useEffect(() => {
    fetchTopics()
  }, [])

  const fetchTopics = async () => {
    setLoading(true)
    try {
      const response = await topicsService.getAll()
      if (response.status && response.data) {
        setTopics(Array.isArray(response.data) ? response.data : [])
      } else {
        toast.error('Failed to fetch topics')
        setTopics([])
      }
    } catch (error) {
      console.error('Error fetching topics:', error)
      toast.error('Error fetching topics')
      setTopics([])
    } finally {
      setLoading(false)
    }
  }

  const filteredTopics = topics.filter(
    (topic) =>
      topic.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (topic.description && topic.description.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const totalPages = Math.ceil(filteredTopics.length / itemsPerPage)
  const paginatedTopics = filteredTopics.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm])

  const handleDeleteClick = (topic: Topic) => {
    setConfirmationModal({
      isOpen: true,
      topic,
    })
  }

  const handleDelete = async () => {
    if (!confirmationModal?.topic) return

    const topic = confirmationModal.topic
    setDeletingId(topic.id)
    setConfirmationModal(null)

    try {
      const response = await topicsService.delete(topic.id)
      if (response.status) {
        toast.success(`"${topic.name}" has been deleted successfully.`)
        fetchTopics()
      } else {
        toast.error(response.message || 'Failed to delete topic')
      }
    } catch (error) {
      console.error('Error deleting topic:', error)
      toast.error('Error deleting topic')
    } finally {
      setDeletingId(null)
    }
  }

  if (loading) {
    return <Loader fullScreen text="Loading topics..." />
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Topics</h1>
          <p className="text-gray-600 mt-2">Manage all topics in the system</p>
        </div>
        <Link
          to="/master-data/topics/new"
          className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
        >
          <Plus size={20} />
          Add New Topic
        </Link>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search topics by name or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
      </div>

      {/* Topics Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {filteredTopics.length === 0 ? (
          <div className="text-center py-12">
            <Database className="mx-auto mb-4 text-gray-400" size={48} />
            <p className="text-gray-500 mb-4">No topics found</p>
            <Link
              to="/master-data/topics/new"
              className="text-primary hover:underline font-medium"
            >
              Add your first topic
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
                  Description
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
              {paginatedTopics.map((topic) => (
                <tr key={topic.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{topic.name}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-500">{topic.description}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {topic.created_at ? new Date(topic.created_at).toLocaleDateString() : '-'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      onClick={() => navigate(`/master-data/topics/${topic.id}`)}
                      className="text-primary hover:text-primary/80 inline-flex items-center gap-1"
                    >
                      <Eye size={16} />
                      View
                    </button>
                    <Link
                      to={`/master-data/topics/${topic.id}/edit`}
                      className="text-primary hover:text-primary/80 inline-flex items-center gap-1"
                    >
                      <Edit size={16} />
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDeleteClick(topic)}
                      disabled={deletingId === topic.id}
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
        {filteredTopics.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            itemsPerPage={itemsPerPage}
            totalItems={filteredTopics.length}
          />
        )}
      </div>

      {confirmationModal && (
        <ConfirmationModal
          isOpen={confirmationModal.isOpen}
          onClose={() => setConfirmationModal(null)}
          onConfirm={handleDelete}
          title="Delete Topic"
          message={`Are you sure you want to delete "${confirmationModal.topic?.name}"? This action cannot be undone.`}
          type="danger"
          isLoading={deletingId !== null}
        />
      )}
    </div>
  )
}

export default Topics

