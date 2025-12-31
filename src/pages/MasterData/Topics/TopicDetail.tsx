import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, Edit, Database, CheckCircle, XCircle, List } from 'lucide-react'
import { topicsService, type Topic } from '../../../services/topicsService'
import Loader from '../../../components/Loader'
import { useToast } from '../../../contexts/ToastContext'

interface Subtopic {
  id: number
  topic_id: number
  name: string
  description?: string
  order: number
  is_active: boolean
  created_by?: number
  created_at?: string
  updated_at?: string
}

interface TopicWithDetails extends Topic {
  subject?: {
    id: number
    name: string
    code?: string
    year_of_study_id?: number
    semester_id?: number
    department_id?: number
  }
  subtopics?: Subtopic[]
}

const TopicDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const toast = useToast()
  const [topic, setTopic] = useState<TopicWithDetails | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (id) {
      setLoading(true)
      topicsService.getById(id).then(res => {
        if (res.status && res.data) {
          setTopic(res.data)
        } else {
          toast.error('Failed to fetch topic')
        }
        setLoading(false)
      }).catch(err => {
        console.error('Error fetching topic:', err)
        toast.error('Error fetching topic')
        setLoading(false)
      })
    }
  }, [id, toast])

  if (loading) {
    return <Loader fullScreen text="Loading topic..." />
  }

  if (!topic) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Database className="mx-auto mb-4 text-gray-400" size={48} />
          <p className="text-gray-500">Topic not found</p>
          <button
            onClick={() => navigate('/master-data/topics')}
            className="mt-4 text-primary hover:underline"
          >
            Back to Topics
          </button>
        </div>
      </div>
    )
  }

  const subtopics = topic.subtopics || []
  const activeSubtopics = subtopics.filter(st => st.is_active)
  const inactiveSubtopics = subtopics.filter(st => !st.is_active)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/master-data/topics')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900">{topic.name}</h1>
          <p className="text-gray-600 mt-2">Topic Details</p>
        </div>
        <Link
          to={`/master-data/topics/${topic.id}/edit`}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors inline-flex items-center gap-2"
        >
          <Edit size={18} />
          Edit Topic
        </Link>
      </div>

      {/* Topic Information */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Topic Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-sm font-medium text-gray-500">Topic Name</label>
            <p className="text-gray-900 mt-1 font-medium">{topic.name}</p>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-500">Subject</label>
            <div className="mt-1">
              {topic.subject ? (
                <div>
                  <p className="text-gray-900 font-medium">{topic.subject.name}</p>
                  {topic.subject.code && (
                    <p className="text-sm text-gray-600">Code: {topic.subject.code}</p>
                  )}
                </div>
              ) : (
                <p className="text-gray-500 italic">No subject information</p>
              )}
            </div>
          </div>

          {topic.description && (
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-gray-500">Description</label>
              <p className="text-gray-900 mt-1">{topic.description}</p>
            </div>
          )}

          <div>
            <label className="text-sm font-medium text-gray-500">Created Date</label>
            <p className="text-gray-900 mt-1">
              {topic.created_at ? new Date(topic.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              }) : '-'}
            </p>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-500">Last Updated</label>
            <p className="text-gray-900 mt-1">
              {topic.updated_at ? new Date(topic.updated_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              }) : '-'}
            </p>
          </div>
        </div>
      </div>

      {/* Subtopics Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <List size={24} className="text-gray-700" />
            <h2 className="text-xl font-semibold text-gray-900">Subtopics</h2>
            <span className="px-2 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full">
              {subtopics.length}
            </span>
          </div>
          <div className="text-sm text-gray-600">
            {activeSubtopics.length} active, {inactiveSubtopics.length} inactive
          </div>
        </div>

        {subtopics.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <List className="mx-auto mb-3 text-gray-400" size={48} />
            <p className="text-gray-600 font-medium">No subtopics yet</p>
            <p className="text-sm text-gray-500 mt-1">
              Add subtopics by editing this topic
            </p>
            <Link
              to={`/master-data/topics/${topic.id}/edit`}
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              <Edit size={16} />
              Add Subtopics
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {/* Active Subtopics */}
            {activeSubtopics.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-3 uppercase tracking-wide">
                  Active Subtopics
                </h3>
                <div className="space-y-2">
                  {activeSubtopics
                    .sort((a, b) => a.order - b.order)
                    .map((subtopic, index) => (
                      <div
                        key={subtopic.id}
                        className="flex items-start gap-3 p-4 border border-gray-200 rounded-lg hover:border-primary/30 hover:bg-gray-50 transition-all"
                      >
                        {/* Order Number */}
                        <div className="flex-shrink-0 w-8 h-8 bg-primary/10 text-primary rounded-full flex items-center justify-center font-semibold text-sm">
                          {subtopic.order ?? index + 1}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="font-medium text-gray-900">{subtopic.name}</h4>
                            <CheckCircle size={18} className="text-green-500 flex-shrink-0" />
                          </div>
                          {subtopic.description && (
                            <p className="text-sm text-gray-600 mt-1">{subtopic.description}</p>
                          )}
                          <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                            <span>Order: {subtopic.order ?? index + 1}</span>
                            {subtopic.created_at && (
                              <span>
                                Added: {new Date(subtopic.created_at).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Inactive Subtopics */}
            {inactiveSubtopics.length > 0 && (
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-500 mb-3 uppercase tracking-wide">
                  Inactive Subtopics
                </h3>
                <div className="space-y-2">
                  {inactiveSubtopics
                    .sort((a, b) => a.order - b.order)
                    .map((subtopic, index) => (
                      <div
                        key={subtopic.id}
                        className="flex items-start gap-3 p-4 border border-gray-200 rounded-lg bg-gray-50 opacity-60"
                      >
                        {/* Order Number */}
                        <div className="flex-shrink-0 w-8 h-8 bg-gray-200 text-gray-500 rounded-full flex items-center justify-center font-semibold text-sm">
                          {subtopic.order ?? index + 1}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="font-medium text-gray-700">{subtopic.name}</h4>
                            <XCircle size={18} className="text-gray-400 flex-shrink-0" />
                          </div>
                          {subtopic.description && (
                            <p className="text-sm text-gray-500 mt-1">{subtopic.description}</p>
                          )}
                          <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                            <span>Order: {subtopic.order ?? index + 1}</span>
                            <span className="px-2 py-0.5 bg-gray-200 text-gray-600 rounded-full">
                              Inactive
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary/10 rounded-lg">
              <List className="text-primary" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Subtopics</p>
              <p className="text-2xl font-bold text-gray-900">{subtopics.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle className="text-green-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Active Subtopics</p>
              <p className="text-2xl font-bold text-gray-900">{activeSubtopics.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gray-100 rounded-lg">
              <XCircle className="text-gray-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Inactive Subtopics</p>
              <p className="text-2xl font-bold text-gray-900">{inactiveSubtopics.length}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TopicDetail