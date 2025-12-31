import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Plus, Edit, Users, Search, Calendar, Eye, Trash2 } from 'lucide-react'
import { discussionsService, type Discussion } from '../../services/discussionsService'
import Pagination from '../../components/Pagination'
import Loader from '../../components/Loader'
import ConfirmationModal from '../../components/ConfirmationModal'
import { useToast } from '../../contexts/ToastContext'

const Discussions = () => {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 15
  
  const [discussions, setDiscussions] = useState<Discussion[]>([])
  const [loading, setLoading] = useState(true)
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const [searchTimeout, setSearchTimeout] = useState<ReturnType<typeof setTimeout> | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [discussionToDelete, setDiscussionToDelete] = useState<Discussion | null>(null)
  const [confirmationModal, setConfirmationModal] = useState<{
    isOpen: boolean
    type: 'danger' | 'warning' | 'success' | 'info'
    title: string
    message: string
    onConfirm: () => void
    showCancel?: boolean
  } | null>(null)
  const toast = useToast()

  useEffect(() => {
    const fetchDiscussions = async () => {
      setLoading(true)
      try {
        const response = await discussionsService.getAll({
          search: searchTerm || undefined,
          per_page: itemsPerPage,
          page: currentPage,
        })

        console.log('Fetch discussions response:', response);
        
        if (response.status && response.data) {
          const discussionsData = Array.isArray(response.data) ? response.data : []
          setDiscussions(discussionsData)
          // Pagination comes from the spread of backend response
          const pagination = (response as any).pagination
          if (pagination) {
            setTotalPages(pagination.last_page || 1)
            setTotalItems(pagination.total || 0)
          }
        } else {
          console.error('Failed to fetch discussions:', response.message)
          setDiscussions([])
        }
      } catch (error) {
        console.error('Error fetching discussions:', error)
        setDiscussions([])
      } finally {
        setLoading(false)
      }
    }

    // Debounce search
    if (searchTimeout) {
      clearTimeout(searchTimeout)
    }
    
    const timeout = setTimeout(() => {
      fetchDiscussions()
    }, searchTerm ? 500 : 0)
    
    setSearchTimeout(timeout)
    
    return () => {
      if (timeout) clearTimeout(timeout)
    }
  }, [searchTerm, currentPage])

  const canDelete = (discussion: Discussion): boolean => {
    // Can delete if:
    // 1. Status is draft, OR
    // 2. Status is published but has no enrollments
    if (discussion.status === 'draft') return true
    if (discussion.status === 'published' && discussion.enrolledStudents === 0) return true
    return false
  }

  const handleDeleteClick = (discussion: Discussion, e: React.MouseEvent) => {
    e.stopPropagation()
    
    if (!canDelete(discussion)) {
      toast.warning('Published discussions with enrollments cannot be deleted. Please archive or complete the discussion instead.')
      return
    }

    setDiscussionToDelete(discussion)
    setConfirmationModal({
      isOpen: true,
      type: 'danger',
      title: 'Delete Discussion',
      message: `Are you sure you want to delete "${discussion.title}"?\n\nThis action cannot be undone.`,
      onConfirm: handleDelete,
    })
  }

  const handleDelete = async () => {
    if (!discussionToDelete) {
      setConfirmationModal(null)
      return
    }

    const discussion = discussionToDelete
    setDeletingId(discussion.id)
    setConfirmationModal(null)
    
    try {
      const response = await discussionsService.delete(discussion.id)
      if (response.status) {
        // Refresh the list
        const fetchResponse = await discussionsService.getAll({
          search: searchTerm || undefined,
          per_page: itemsPerPage,
          page: currentPage,
        })
        
        if (fetchResponse.status && fetchResponse.data) {
          const discussionsData = Array.isArray(fetchResponse.data) ? fetchResponse.data : []
          setDiscussions(discussionsData)
          const pagination = (fetchResponse as any).pagination
          if (pagination) {
            setTotalPages(pagination.last_page || 1)
            setTotalItems(pagination.total || 0)
          }
        }
        
        toast.success(`"${discussion.title}" has been deleted successfully.`)
      } else {
        toast.error(response.message || 'Failed to delete discussion. Please try again.')
      }
    } catch (error) {
      console.error('Error deleting discussion:', error)
      toast.error('An error occurred while deleting the discussion. Please try again.')
    } finally {
      setDeletingId(null)
      setDiscussionToDelete(null)
    }
  }

  if (loading) {
    return <Loader fullScreen text="Loading discussions..." />
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Discussions</h1>
          <p className="text-gray-600 mt-2">Manage all class discussions</p>
        </div>
        <Link
          to="/discussions/new"
          className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
        >
          <Plus size={20} />
          Create Discussion
        </Link>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search discussions by title, professor, or topic..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
      </div>

      {/* Discussions Table */}
      <div className="bg-white rounded-lg shadow">
        {discussions.length === 0 && !loading ? (
          <div className="text-center py-12">
            <Users className="mx-auto mb-4 text-gray-400" size={48} />
            <p className="text-gray-500 mb-4">No discussions found</p>
            <Link
              to="/discussions/new"
              className="text-primary hover:underline font-medium"
            >
              Create your first discussion
            </Link>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-48">
                      Title
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                      Professor
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                      Topic
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-40">
                      Schedule
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                      Enrolled
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-28">
                      Status
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32 sticky right-0 bg-gray-50">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {discussions.map((discussion) => {
                    // Parse schedule - split by comma and show first one, indicate if more
                    const schedules = discussion.schedule ? discussion.schedule.split(',').map(s => s.trim()) : []
                    const firstSchedule = schedules[0] || 'TBA'
                    const hasMoreSchedules = schedules.length > 1
                    
                    // Status badge color
                    const getStatusColor = (status: string) => {
                      switch (status) {
                        case 'published':
                          return 'bg-green-100 text-green-800'
                        case 'draft':
                          return 'bg-gray-100 text-gray-800'
                        case 'archived':
                          return 'bg-yellow-100 text-yellow-800'
                        case 'completed':
                          return 'bg-blue-100 text-blue-800'
                        default:
                          return 'bg-gray-100 text-gray-800'
                      }
                    }

                    return (
                      <tr 
                        key={discussion.id} 
                        className="hover:bg-gray-50 cursor-pointer" 
                        onClick={() => navigate(`/discussions/${discussion.id}`)}
                      >
                        <td className="px-3 py-2">
                          <div className="text-sm font-medium text-gray-900 truncate max-w-xs" title={discussion.title}>
                            {discussion.title}
                          </div>
                        </td>
                        <td className="px-3 py-2">
                          <div className="text-sm text-gray-500 truncate max-w-[120px]" title={discussion.professor}>
                            {discussion.professor}
                          </div>
                        </td>
                        <td className="px-3 py-2">
                          <div className="text-sm text-gray-500 truncate max-w-[120px]" title={discussion.topic}>
                            {discussion.topic}
                          </div>
                        </td>
                        <td className="px-3 py-2">
                          <div className="text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <Calendar size={12} className="flex-shrink-0" />
                              <span className="truncate max-w-[140px]" title={discussion.schedule}>
                                {firstSchedule}
                              </span>
                            </div>
                            {hasMoreSchedules && (
                              <div className="text-xs text-gray-400 mt-0.5">
                                +{schedules.length - 1} more
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-3 py-2">
                          <div className="text-sm text-gray-900">
                            {discussion.enrolledStudents}/{discussion.maxStudents}
                          </div>
                        </td>
                        <td className="px-3 py-2">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(discussion.status)}`}>
                            {discussion.status}
                          </span>
                        </td>
                        <td className="px-3 py-2 text-sm font-medium sticky right-0 bg-white hover:bg-gray-50" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => navigate(`/discussions/${discussion.id}`)}
                              className="p-1.5 text-primary hover:bg-primary/10 rounded transition-colors"
                              title="View"
                            >
                              <Eye size={14} />
                            </button>
                            <Link
                              to={`/discussions/${discussion.id}/edit`}
                              className="p-1.5 text-primary hover:bg-primary/10 rounded transition-colors"
                              title="Edit"
                            >
                              <Edit size={14} />
                            </Link>
                            <Link
                              to={`/discussions/${discussion.id}/subscriptions`}
                              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                              title="Subscriptions"
                            >
                              <Users size={14} />
                            </Link>
                            {canDelete(discussion) && (
                              <button
                                onClick={(e) => handleDeleteClick(discussion, e)}
                                disabled={deletingId === discussion.id}
                                className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors disabled:opacity-50"
                                title="Delete"
                              >
                                <Trash2 size={14} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
            {discussions.length > 0 && (
              <div className="border-t border-gray-200 px-4 py-3">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                  itemsPerPage={itemsPerPage}
                  totalItems={totalItems}
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
          onClose={() => {
            setConfirmationModal(null)
            setDiscussionToDelete(null)
          }}
          onConfirm={confirmationModal.onConfirm}
          title={confirmationModal.title}
          message={confirmationModal.message}
          type={confirmationModal.type}
          showCancel={confirmationModal.showCancel}
          isLoading={deletingId !== null}
        />
      )}
    </div>
  )
}

export default Discussions

