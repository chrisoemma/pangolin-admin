import { useState, useEffect } from 'react'
import { X, Search, Users, Mail, Check } from 'lucide-react'
import { studentsService, type Student } from '../services/studentsService'
import Loader from './Loader'
import { useToast } from '../contexts/ToastContext'

interface EnrollStudentModalProps {
  isOpen: boolean
  onClose: () => void
  onEnroll: (studentIds: string[]) => void
  enrolledStudentIds: string[]
  maxStudents: number
  currentEnrolled: number
}

const EnrollStudentModal = ({
  isOpen,
  onClose,
  onEnroll,
  enrolledStudentIds,
  maxStudents,
  currentEnrolled,
}: EnrollStudentModalProps) => {
  const toast = useToast()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStudents, setSelectedStudents] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(false)
  const [students, setStudents] = useState<Student[]>([])

  useEffect(() => {
    if (isOpen) {
      setSearchTerm('')
      setSelectedStudents([])
      fetchActiveStudents()
    }
  }, [isOpen])

  const fetchActiveStudents = async () => {
    setFetching(true)
    try {
      const response = await studentsService.getAll()
      if (response.status && response.data) {
        let studentsList: Student[] = []
        if (Array.isArray(response.data)) {
          studentsList = response.data
        } else if (response.data && typeof response.data === 'object' && 'students' in response.data) {
          studentsList = (response.data as { students?: Student[] }).students || []
        }
        // Filter for active students only
        const activeStudents = studentsList.filter(
          (student) => student.status === 'Active' || student.user?.status === 'Active'
        )
        setStudents(activeStudents)
      } else {
        toast.error('Failed to fetch students')
      }
    } catch (error) {
      console.error('Error fetching students:', error)
      toast.error('Error fetching students')
    } finally {
      setFetching(false)
    }
  }

  if (!isOpen) return null

  const availableSlots = maxStudents - currentEnrolled
  const availableStudents = students.filter(
    (student) =>
      !enrolledStudentIds.includes(String(student.id)) &&
      (student.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email?.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const handleToggleStudent = (studentId: string) => {
    if (selectedStudents.includes(studentId)) {
      setSelectedStudents(selectedStudents.filter(id => id !== studentId))
    } else {
      if (selectedStudents.length < availableSlots) {
        setSelectedStudents([...selectedStudents, studentId])
      }
    }
  }

  const handleEnroll = async () => {
    if (selectedStudents.length === 0) return

    setLoading(true)
    try {
      // The actual enrollment API call should be handled by the parent component
      // This component just passes the selected student IDs
      onEnroll(selectedStudents)
      setSelectedStudents([])
      setSearchTerm('')
      onClose()
    } catch (error) {
      console.error('Error enrolling students:', error)
      toast.error('Error enrolling students')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {loading && <Loader fullScreen text="Enrolling students..." />}
      <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          onClick={onClose}
        />

        {/* Modal panel */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Enroll Students</h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500"
              >
                <X size={24} />
              </button>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-600">
                Available slots: <span className="font-semibold">{availableSlots}</span> of {maxStudents} maximum
              </p>
              {selectedStudents.length > 0 && (
                <p className="text-sm text-primary mt-1">
                  {selectedStudents.length} student{selectedStudents.length > 1 ? 's' : ''} selected
                </p>
              )}
            </div>

            {/* Search */}
            <div className="mb-4">
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

            {/* Students List */}
            <div className="border border-gray-200 rounded-lg max-h-96 overflow-y-auto">
              {fetching ? (
                <div className="text-center py-8">
                  <Loader size="sm" />
                  <p className="text-gray-500 mt-2">Loading students...</p>
                </div>
              ) : availableStudents.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Users className="mx-auto mb-2 opacity-50" size={32} />
                  <p>No available students found</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {availableStudents.map((student) => {
                    const studentId = String(student.id)
                    const isSelected = selectedStudents.includes(studentId)
                    const isDisabled = !isSelected && selectedStudents.length >= availableSlots
                    const studentName = student.full_name || student.name || 'Unknown'
                    const studentEmail = student.email || ''

                    return (
                      <div
                        key={student.id}
                        onClick={() => !isDisabled && handleToggleStudent(studentId)}
                        className={`p-4 cursor-pointer transition-colors ${
                          isSelected
                            ? 'bg-primary/10 border-l-4 border-primary'
                            : isDisabled
                            ? 'bg-gray-50 opacity-50 cursor-not-allowed'
                            : 'hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 flex-1">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              isSelected ? 'bg-primary text-white' : 'bg-gray-200 text-gray-600'
                            }`}>
                              {isSelected ? (
                                <Check size={20} />
                              ) : (
                                <Users size={20} />
                              )}
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-gray-900">{studentName}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <Mail size={14} className="text-gray-400" />
                                <p className="text-sm text-gray-500">{studentEmail}</p>
                              </div>
                            </div>
                          </div>
                          {isSelected && (
                            <span className="text-sm text-primary font-medium">Selected</span>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              onClick={handleEnroll}
              disabled={selectedStudents.length === 0 || loading}
              className="w-full inline-flex justify-center rounded-lg border border-transparent shadow-sm px-4 py-2 bg-primary text-base font-medium text-white hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary sm:ml-3 sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Enrolling...' : `Enroll ${selectedStudents.length} Student${selectedStudents.length !== 1 ? 's' : ''}`}
            </button>
            <button
              onClick={onClose}
              className="mt-3 w-full inline-flex justify-center rounded-lg border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary sm:mt-0 sm:ml-3 sm:w-auto"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
    </>
  )
}

export default EnrollStudentModal


