import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, Edit, Users, Calendar, Clock, DollarSign, UserCheck, UserPlus, Trash2 } from 'lucide-react'
import { discussionsService, type Discussion } from '../../services/discussionsService'
import EnrollStudentModal from '../../components/EnrollStudentModal'
import Loader from '../../components/Loader'
import ConfirmationModal from '../../components/ConfirmationModal'
import { useToast } from '../../contexts/ToastContext'

const DiscussionDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [discussion, setDiscussion] = useState<Discussion | null>(null)
  const [enrolledStudentIds, setEnrolledStudentIds] = useState<string[]>([])
  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)
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
    const fetchDiscussion = async () => {
      if (!id) return
      setLoading(true)
      try {
        const response = await discussionsService.getById(id)
        if (response.status && response.data) {
          setDiscussion(response.data)
          
          // Fetch enrollments
          const enrollmentsResponse = await discussionsService.getEnrollments(id)
          if (enrollmentsResponse.status && enrollmentsResponse.data) {
            const studentIds = Array.isArray(enrollmentsResponse.data) 
              ? enrollmentsResponse.data.map((e: any) => e.student?.id || e.student_id || e.id)
              : []
            setEnrolledStudentIds(studentIds.map(String))
          }
        }
      } catch (error) {
        console.error('Error fetching discussion:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDiscussion()
  }, [id])

  const handleEnrollStudents = async (studentIds: string[]) => {
    if (!id || !discussion) return

    try {
      const studentIdsNumbers = studentIds.map(id => Number(id))
      const response = await discussionsService.enrollStudents(id, studentIdsNumbers)
      
      if (response.status) {
        toast.success(`Successfully enrolled ${studentIds.length} student${studentIds.length > 1 ? 's' : ''}.`)
        
        // Refresh discussion and enrollments
        const [discussionRes, enrollmentsRes] = await Promise.all([
          discussionsService.getById(id),
          discussionsService.getEnrollments(id),
        ])

        if (discussionRes.status && discussionRes.data) {
          setDiscussion(discussionRes.data)
        }

        if (enrollmentsRes.status && enrollmentsRes.data) {
          const studentIds = Array.isArray(enrollmentsRes.data) 
            ? enrollmentsRes.data.map((e: any) => e.student?.id || e.student_id || e.id)
            : []
          setEnrolledStudentIds(studentIds.map(String))
        }
      } else {
        toast.error(response.message || 'Failed to enroll students')
      }
    } catch (error) {
      console.error('Error enrolling students:', error)
      toast.error('Error enrolling students')
    }
  }

  if (loading) {
    return <Loader fullScreen text="Loading discussion..." />
  }

  if (!discussion) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Users className="mx-auto mb-4 text-gray-400" size={48} />
          <p className="text-gray-500">Discussion not found</p>
          <button
            onClick={() => navigate('/discussions')}
            className="mt-4 text-primary hover:underline"
          >
            Back to Discussions
          </button>
        </div>
      </div>
    )
  }

  const availableSlots = discussion.maxStudents - discussion.enrolledStudents

  const canDelete = (): boolean => {
    if (!discussion) return false
    // Can delete if:
    // 1. Status is draft, OR
    // 2. Status is published but has no enrollments
    if (discussion.status === 'draft') return true
    if (discussion.status === 'published' && discussion.enrolledStudents === 0) return true
    return false
  }

  const handleDeleteClick = () => {
    if (!discussion) return

    if (!canDelete()) {
      toast.warning('Published discussions with enrollments cannot be deleted. Please archive or complete the discussion instead.')
      return
    }

    setConfirmationModal({
      isOpen: true,
      type: 'danger',
      title: 'Delete Discussion',
      message: `Are you sure you want to delete "${discussion.title}"?\n\nThis action cannot be undone.`,
      onConfirm: handleDelete,
    })
  }

  const handleDelete = async () => {
    if (!discussion) {
      setConfirmationModal(null)
      return
    }

    setDeleting(true)
    setConfirmationModal(null)
    
    try {
      const response = await discussionsService.delete(discussion.id)
      if (response.status) {
        toast.success(`"${discussion.title}" has been deleted successfully.`)
        setTimeout(() => navigate('/discussions'), 1000)
      } else {
        toast.error(response.message || 'Failed to delete discussion. Please try again.')
        setDeleting(false)
      }
    } catch (error) {
      console.error('Error deleting discussion:', error)
      toast.error('An error occurred while deleting the discussion. Please try again.')
      setDeleting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/discussions')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900">{discussion.title}</h1>
          <p className="text-gray-600 mt-2">Discussion Details and Information</p>
        </div>
        <div className="flex gap-2">
          {availableSlots > 0 && (
            <button
              onClick={() => setIsEnrollModalOpen(true)}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors inline-flex items-center gap-2"
            >
              <UserPlus size={18} />
              Enroll Students
            </button>
          )}
          <Link
            to={`/discussions/${discussion.id}/edit`}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors inline-flex items-center gap-2"
          >
            <Edit size={18} />
            Edit
          </Link>
          <Link
            to={`/discussions/${discussion.id}/subscriptions`}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
          >
            <Users size={18} />
            View Subscriptions
          </Link>
          {canDelete() && (
            <button
              onClick={handleDeleteClick}
              disabled={deleting}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors inline-flex items-center gap-2 disabled:opacity-50"
            >
              <Trash2 size={18} />
              Delete
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Discussion Information</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Title</label>
                  <p className="text-gray-900 mt-1">{discussion.title}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Professor</label>
                  <p className="text-gray-900 mt-1">{discussion.professor}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Topic</label>
                  <p className="text-gray-900 mt-1">{discussion.topic}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Price</label>
                  <p className="text-gray-900 mt-1">Tsh {discussion.price.toFixed(2)}</p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Description</label>
                <p className="text-gray-900 mt-1 whitespace-pre-wrap">{discussion.description || 'No description provided'}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Schedule</h2>
            {discussion.sessions && discussion.sessions.length > 0 ? (
              <div className="space-y-4">
                {discussion.sessions.map((session, index) => (
                  <div key={index} className="p-4 border border-gray-200 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="flex items-center gap-3">
                        <Calendar className="text-primary" size={20} />
                        <div>
                          <label className="text-sm font-medium text-gray-500">Date</label>
                          <p className="text-gray-900 mt-1">
                            {session.date ? (() => {
                              try {
                                const date = new Date(session.date)
                                if (!isNaN(date.getTime())) {
                                  return date.toLocaleDateString('en-US', { 
                                    weekday: 'long', 
                                    year: 'numeric', 
                                    month: 'long', 
                                    day: 'numeric' 
                                  })
                                }
                              } catch (e) {
                                console.error('Error parsing date:', e)
                              }
                              return '-'
                            })() : '-'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Clock className="text-blue-600" size={20} />
                        <div>
                          <label className="text-sm font-medium text-gray-500">Start Time</label>
                          <p className="text-gray-900 mt-1">
                            {session.start_time ? (() => {
                              try {
                                const timeDate = new Date(session.start_time)
                                if (!isNaN(timeDate.getTime())) {
                                  // Extract time in HH:mm format and convert to 12-hour format
                                  const hours = timeDate.getUTCHours()
                                  const minutes = timeDate.getUTCMinutes()
                                  const period = hours >= 12 ? 'PM' : 'AM'
                                  const displayHours = hours % 12 || 12
                                  return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`
                                }
                              } catch (e) {
                                console.error('Error parsing start_time:', e)
                              }
                              return '-'
                            })() : '-'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Clock className="text-red-600" size={20} />
                        <div>
                          <label className="text-sm font-medium text-gray-500">End Time</label>
                          <p className="text-gray-900 mt-1">
                            {session.end_time ? (() => {
                              try {
                                const timeDate = new Date(session.end_time)
                                if (!isNaN(timeDate.getTime())) {
                                  // Extract time in HH:mm format and convert to 12-hour format
                                  const hours = timeDate.getUTCHours()
                                  const minutes = timeDate.getUTCMinutes()
                                  const period = hours >= 12 ? 'PM' : 'AM'
                                  const displayHours = hours % 12 || 12
                                  return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`
                                }
                              } catch (e) {
                                console.error('Error parsing end_time:', e)
                              }
                              return '-'
                            })() : '-'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Calendar className="text-green-600" size={20} />
                        <div>
                          <label className="text-sm font-medium text-gray-500">Venue</label>
                          <p className="text-gray-900 mt-1">
                            {session.venue?.name || 'No venue assigned'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Calendar className="mx-auto mb-2 text-gray-400" size={32} />
                <p>No sessions scheduled</p>
              </div>
            )}
          </div>
        </div>

        {/* Statistics */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Enrollment Statistics</h2>
            <div className="space-y-4">
              <div className="p-4 bg-primary/10 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <UserCheck size={20} className="text-primary" />
                  <label className="text-sm font-medium text-gray-700">Enrolled Students</label>
                </div>
                <p className="text-3xl font-bold text-primary">{discussion.enrolledStudents}</p>
                <p className="text-sm text-gray-500 mt-1">of {discussion.maxStudents} maximum</p>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign size={20} className="text-blue-600" />
                  <label className="text-sm font-medium text-gray-700">Total Revenue</label>
                </div>
                <p className="text-2xl font-bold text-blue-600">
                  Tsh {(discussion.enrolledStudents * discussion.price).toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-2">
              <Link
                to={`/discussions/${discussion.id}/edit`}
                className="w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors inline-flex items-center justify-center gap-2"
              >
                <Edit size={18} />
                Edit Discussion
              </Link>
              <Link
                to={`/discussions/${discussion.id}/subscriptions`}
                className="w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors inline-flex items-center justify-center gap-2"
              >
                <Users size={18} />
                View Subscriptions
              </Link>
              {canDelete() && (
                <button
                  onClick={handleDeleteClick}
                  disabled={deleting}
                  className="w-full px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors inline-flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Trash2 size={18} />
                  Delete Discussion
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Enroll Student Modal */}
      <EnrollStudentModal
        isOpen={isEnrollModalOpen}
        onClose={() => setIsEnrollModalOpen(false)}
        onEnroll={handleEnrollStudents}
        enrolledStudentIds={enrolledStudentIds}
        maxStudents={discussion.maxStudents}
        currentEnrolled={discussion.enrolledStudents}
      />

      {/* Confirmation Modal */}
      {confirmationModal && (
        <ConfirmationModal
          isOpen={confirmationModal.isOpen}
          onClose={() => setConfirmationModal(null)}
          onConfirm={confirmationModal.onConfirm}
          title={confirmationModal.title}
          message={confirmationModal.message}
          type={confirmationModal.type}
          showCancel={confirmationModal.showCancel}
          isLoading={deleting}
        />
      )}
    </div>
  )
}

export default DiscussionDetail

