import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, Users, Mail, Calendar, BookOpen, ShoppingCart, CreditCard, UserPlus } from 'lucide-react'
import { mockDiscussions } from '../../data/mockData'
import type { Order, Payment } from '../../data/mockData'
import { ordersService } from '../../services/ordersService'
import { paymentsService } from '../../services/paymentsService'
import EnrollStudentModal from '../../components/EnrollStudentModal'
import Loader from '../../components/Loader'
import { studentsService } from '../../services/studentsService'

// Student interface for our transformed data
interface StudentData {
  id: string
  name: string
  email: string
  enrolledAt: string
  [key: string]: any
}

// API response interface
interface ApiStudentData {
  id: number
  full_name: string
  email: string
  created_at?: string
  [key: string]: any
}

const StudentDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [student, setStudent] = useState<StudentData | null>(null)
  const [studentOrders, setStudentOrders] = useState<Order[]>([])
  const [studentPayments, setStudentPayments] = useState<Payment[]>([])
  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false)
  const [selectedDiscussionId, setSelectedDiscussionId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStudentData = async () => {
      if (!id) return
      
      setLoading(true)
      try {
        const [studentResponse, ordersResponse, paymentsResponse] = await Promise.all([
          studentsService.getById(parseInt(id)),
          ordersService.getAll(),
          paymentsService.getAll()
        ])
        
        if (studentResponse.status && studentResponse.data) {
          // Handle the API response - it might be wrapped in a 'student' property or directly available
          const responseData = studentResponse.data as any
          const apiStudent: ApiStudentData = responseData.student || responseData
          
          // Transform the API student data to our internal format
          const transformedStudent: StudentData = {
            ...apiStudent,
            id: apiStudent.id.toString(),
            name: apiStudent.full_name,
            email: apiStudent.email,
            enrolledAt: apiStudent.created_at || new Date().toISOString(),
          }
          setStudent(transformedStudent)

          // Filter orders and payments by student email
          if (ordersResponse.status && ordersResponse.data) {
            const orders = Array.isArray(ordersResponse.data) ? ordersResponse.data : []
            setStudentOrders(orders.filter(order => order.studentEmail === transformedStudent.email))
          }
          
          if (paymentsResponse.status && paymentsResponse.data) {
            const payments = Array.isArray(paymentsResponse.data) ? paymentsResponse.data : []
            setStudentPayments(payments.filter(payment => payment.studentEmail === transformedStudent.email))
          }
        }
      } catch (error) {
        console.error('Error fetching student data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStudentData()
  }, [id])

  if (loading) {
    return <Loader fullScreen text="Loading student..." />
  }

  if (!student) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Users className="mx-auto mb-4 text-gray-400" size={48} />
          <p className="text-gray-500">Student not found</p>
          <button
            onClick={() => navigate('/students')}
            className="mt-4 text-primary hover:underline"
          >
            Back to Students
          </button>
        </div>
      </div>
    )
  }

  const totalSpent = studentPayments
    .filter(p => p.status === 'success')
    .reduce((sum, payment) => sum + payment.amount, 0)

  // Get discussions student is enrolled in
  const enrolledDiscussions = mockDiscussions.filter(d => {
    // TODO: Replace with actual enrollment check from API
    return studentOrders.some(o => o.itemType === 'discussion' && o.itemId === d.id)
  })

  // Get available discussions (not enrolled and has slots)
  const availableDiscussions = mockDiscussions.filter(d => {
    const isEnrolled = enrolledDiscussions.some(ed => ed.id === d.id)
    return !isEnrolled && d.enrolledStudents < d.maxStudents
  })

  const handleEnrollInDiscussion = (discussionId: string) => {
    setSelectedDiscussionId(discussionId)
    setIsEnrollModalOpen(true)
  }

  const handleEnroll = (studentIds: string[]) => {
    // TODO: Replace with actual API call
    if (selectedDiscussionId && student && studentIds.includes(student.id)) {
      // Enrollment successful
      console.log(`Enrolled student ${student.id} in discussion ${selectedDiscussionId}`)
    }
    setIsEnrollModalOpen(false)
    setSelectedDiscussionId(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/students')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900">{student.name}</h1>
          <p className="text-gray-600 mt-2">Student Details and Activity</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Student Information</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <Users className="text-primary" size={32} />
                </div>
                <div className="flex-1">
                  <p className="text-lg font-semibold text-gray-900">{student.name}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Email</label>
                  <div className="flex items-center gap-2 mt-1">
                    <Mail size={16} className="text-gray-400" />
                    <p className="text-gray-900">{student.email}</p>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Registration Date</label>
                  <div className="flex items-center gap-2 mt-1">
                    <Calendar size={16} className="text-gray-400" />
                    <p className="text-gray-900">{new Date(student.enrolledAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Orders */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Recent Orders</h2>
              <Link
                to="/orders"
                className="text-sm text-primary hover:underline"
              >
                View All
              </Link>
            </div>
            {studentOrders.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <ShoppingCart className="mx-auto mb-2 opacity-50" size={32} />
                <p>No orders found</p>
              </div>
            ) : (
              <div className="space-y-3">
                {studentOrders.slice(0, 5).map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{order.itemName}</p>
                      <p className="text-sm text-gray-500">{new Date(order.orderDate).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">Tsh {order.amount.toFixed(2)}</p>
                      <span className={`text-xs px-2 py-1 rounded ${
                        order.status === 'completed' ? 'bg-green-100 text-green-800' :
                        order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Enrolled Discussions */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Enrolled Discussions</h2>
              {availableDiscussions.length > 0 && (
                <button
                  onClick={() => {
                    // Show discussion selection or directly enroll
                    if (availableDiscussions.length === 1) {
                      handleEnrollInDiscussion(availableDiscussions[0].id)
                    } else {
                      // Could show a dropdown or modal to select discussion
                      handleEnrollInDiscussion(availableDiscussions[0].id)
                    }
                  }}
                  className="text-sm text-primary hover:underline inline-flex items-center gap-1"
                >
                  <UserPlus size={14} />
                  Enroll in Discussion
                </button>
              )}
            </div>
            {enrolledDiscussions.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Users className="mx-auto mb-2 opacity-50" size={32} />
                <p>Not enrolled in any discussions</p>
                {availableDiscussions.length > 0 && (
                  <button
                    onClick={() => handleEnrollInDiscussion(availableDiscussions[0].id)}
                    className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors inline-flex items-center gap-2"
                  >
                    <UserPlus size={16} />
                    Enroll Now
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {enrolledDiscussions.map((discussion) => (
                  <Link
                    key={discussion.id}
                    to={`/discussions/${discussion.id}`}
                    className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <p className="font-medium text-gray-900">{discussion.title}</p>
                    <p className="text-sm text-gray-500 mt-1">{discussion.professor} • {discussion.topic}</p>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Recent Payments */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Recent Payments</h2>
              <Link
                to="/payments"
                className="text-sm text-primary hover:underline"
              >
                View All
              </Link>
            </div>
            {studentPayments.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <CreditCard className="mx-auto mb-2 opacity-50" size={32} />
                <p>No payments found</p>
              </div>
            ) : (
              <div className="space-y-3">
                {studentPayments.slice(0, 5).map((payment) => (
                  <div key={payment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{payment.itemName}</p>
                      <p className="text-sm text-gray-500">{payment.paymentMethod} • {new Date(payment.paymentDate).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">Tsh {payment.amount.toFixed(2)}</p>
                      <span className={`text-xs px-2 py-1 rounded ${
                        payment.status === 'success' ? 'bg-green-100 text-green-800' :
                        payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {payment.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Statistics */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Statistics</h2>
            <div className="space-y-4">
              <div className="p-4 bg-primary/10 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <ShoppingCart size={20} className="text-primary" />
                  <label className="text-sm font-medium text-gray-700">Total Orders</label>
                </div>
                <p className="text-3xl font-bold text-primary">{studentOrders.length}</p>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <CreditCard size={20} className="text-blue-600" />
                  <label className="text-sm font-medium text-gray-700">Total Payments</label>
                </div>
                <p className="text-2xl font-bold text-blue-600">{studentPayments.length}</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <CreditCard size={20} className="text-green-600" />
                  <label className="text-sm font-medium text-gray-700">Total Spent</label>
                </div>
                <p className="text-2xl font-bold text-green-600">Tsh {totalSpent.toFixed(2)}</p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <BookOpen size={20} className="text-purple-600" />
                  <label className="text-sm font-medium text-gray-700">Books Purchased</label>
                </div>
                <p className="text-2xl font-bold text-purple-600">
                  {studentOrders.filter(o => o.itemType === 'book').length}
                </p>
              </div>
              <div className="p-4 bg-orange-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Users size={20} className="text-orange-600" />
                  <label className="text-sm font-medium text-gray-700">Discussions Enrolled</label>
                </div>
                <p className="text-2xl font-bold text-orange-600">
                  {studentOrders.filter(o => o.itemType === 'discussion').length}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enroll Student Modal */}
      {selectedDiscussionId && student && (
        <EnrollStudentModal
          isOpen={isEnrollModalOpen}
          onClose={() => {
            setIsEnrollModalOpen(false)
            setSelectedDiscussionId(null)
          }}
          onEnroll={handleEnroll}
          enrolledStudentIds={[]} // Will be fetched from API
          maxStudents={mockDiscussions.find(d => d.id === selectedDiscussionId)?.maxStudents || 0}
          currentEnrolled={mockDiscussions.find(d => d.id === selectedDiscussionId)?.enrolledStudents || 0}
        />
      )}
    </div>
  )
}

export default StudentDetail