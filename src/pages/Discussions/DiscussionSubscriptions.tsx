import { useState, useEffect, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Users, Search, Mail, Calendar, UserPlus } from 'lucide-react'
import { discussionsService, type Discussion } from '../../services/discussionsService'
import EnrollStudentModal from '../../components/EnrollStudentModal'
import Loader from '../../components/Loader'
import { useToast } from '../../contexts/ToastContext'

interface Enrollment {
  id: number
  student?: {
    id: number
    full_name?: string
    name?: string
    email?: string
    user?: {
      email?: string
    }
  }
  enrolled_at?: string
  created_at?: string
}

const DiscussionSubscriptions = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const toast = useToast()
  const [searchTerm, setSearchTerm] = useState('')
  const [enrollments, setEnrollments] = useState<Enrollment[]>([])
  const [discussion, setDiscussion] = useState<Discussion | null>(null)
  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return
      setLoading(true)
      try {
        const [discussionRes, enrollmentsRes] = await Promise.all([
          discussionsService.getById(id),
          discussionsService.getEnrollments(id),
        ])

        if (discussionRes.status && discussionRes.data) {
          setDiscussion(discussionRes.data)
        }

        if (enrollmentsRes.status && enrollmentsRes.data) {
          setEnrollments(Array.isArray(enrollmentsRes.data) ? enrollmentsRes.data : [])
        }
      } catch (error) {
        console.error('Error fetching subscriptions:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [id])

  const handleEnrollStudents = async (studentIds: string[]) => {
    if (!id) return

    try {
      const studentIdsNumbers = studentIds.map(id => Number(id))
      const response = await discussionsService.enrollStudents(id, studentIdsNumbers)
      
      if (response.status) {
        toast.success(`Successfully enrolled ${studentIds.length} student${studentIds.length > 1 ? 's' : ''}.`)
        
        // Refresh the data
        const [discussionRes, enrollmentsRes] = await Promise.all([
          discussionsService.getById(id),
          discussionsService.getEnrollments(id),
        ])

        if (discussionRes.status && discussionRes.data) {
          setDiscussion(discussionRes.data)
        }

        if (enrollmentsRes.status && enrollmentsRes.data) {
          setEnrollments(Array.isArray(enrollmentsRes.data) ? enrollmentsRes.data : [])
        }
      } else {
        toast.error(response.message || 'Failed to enroll students')
      }
    } catch (error) {
      console.error('Error enrolling students:', error)
      toast.error('Error enrolling students')
    }
  }

  const enrolledStudentIds = enrollments.map(e => String(e.student?.id || e.id))
  const availableSlots = discussion ? discussion.maxStudents - discussion.enrolledStudents : 0

  const filteredEnrollments = useMemo(() => {
    return enrollments.filter((enrollment) => {
      const studentName = enrollment.student?.full_name || enrollment.student?.name || ''
      const studentEmail = enrollment.student?.email || enrollment.student?.user?.email || ''
      const search = searchTerm.toLowerCase()
      return studentName.toLowerCase().includes(search) || studentEmail.toLowerCase().includes(search)
    })
  }, [enrollments, searchTerm])

  if (loading) {
    return <Loader fullScreen text="Loading subscriptions..." />
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/discussions')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Discussion Subscriptions</h1>
            <p className="text-gray-600 mt-2">
              View students enrolled in: {discussion?.title || 'Discussion'}
            </p>
          </div>
        </div>
        {availableSlots > 0 && (
          <button
            onClick={() => setIsEnrollModalOpen(true)}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors inline-flex items-center gap-2"
          >
            <UserPlus size={18} />
            Enroll Students
          </button>
        )}
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search students by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Users className="text-primary" size={20} />
            <span className="font-medium text-gray-900">
              {filteredEnrollments.length} {filteredEnrollments.length === 1 ? 'Student' : 'Students'} Enrolled
            </span>
          </div>
        </div>
        {filteredEnrollments.length === 0 ? (
          <div className="text-center py-12">
            <Users className="mx-auto mb-4 text-gray-400" size={48} />
            <p className="text-gray-500">No students enrolled yet</p>
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
                  Enrolled Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredEnrollments.map((enrollment) => {
                const studentName = enrollment.student?.full_name || enrollment.student?.name || 'Unknown'
                const studentEmail = enrollment.student?.email || enrollment.student?.user?.email || ''
                const enrolledDate = enrollment.enrolled_at || enrollment.created_at || ''
                return (
                  <tr key={enrollment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{studentName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500 flex items-center gap-2">
                        <Mail size={14} />
                        {studentEmail}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500 flex items-center gap-2">
                        <Calendar size={14} />
                        {enrolledDate ? new Date(enrolledDate).toLocaleDateString() : 'N/A'}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Enroll Student Modal */}
      {discussion && (
        <EnrollStudentModal
          isOpen={isEnrollModalOpen}
          onClose={() => setIsEnrollModalOpen(false)}
          onEnroll={handleEnrollStudents}
          enrolledStudentIds={enrolledStudentIds}
          maxStudents={discussion.maxStudents}
          currentEnrolled={discussion.enrolledStudents}
        />
      )}
    </div>
  )
}

export default DiscussionSubscriptions

