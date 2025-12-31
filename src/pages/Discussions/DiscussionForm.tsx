import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Plus, Trash2 } from 'lucide-react'
import { discussionsService, type CreateDiscussionData } from '../../services/discussionsService'
import { masterDataService, type Faculty, type Department, type Subject, type Topic, type Subtopic } from '../../services/masterDataService'
import { tutorsService, type Tutor } from '../../services/tutorsService'
import { venuesService, type Venue } from '../../services/venuesService'
import Loader from '../../components/Loader'
import { useToast } from '../../contexts/ToastContext'

const DiscussionForm = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = !!id

  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(false)
  const toast = useToast()

  // Form data
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    tutor_id: '',
    max_students: '',
    price: '',
    status: 'draft' as 'draft' | 'published' | 'archived' | 'completed',
  })

  // Master data selections
  const [facultyId, setFacultyId] = useState<string>('')
  const [departmentId, setDepartmentId] = useState<string>('')
  const [subjectId, setSubjectId] = useState<string>('')
  const [topicId, setTopicId] = useState<string>('')
  const [createNewTopic, setCreateNewTopic] = useState(false)
  const [newTopicName, setNewTopicName] = useState('')

  // Master data lists
  const [faculties, setFaculties] = useState<Faculty[]>([])
  const [departments, setDepartments] = useState<Department[]>([])
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [topics, setTopics] = useState<Topic[]>([])
  const [tutors, setTutors] = useState<Tutor[]>([])
  const [venues, setVenues] = useState<Venue[]>([])

  // Subtopics
  const [subtopics, setSubtopics] = useState<Array<{ id?: number; name?: string; description?: string }>>([])
  const [availableSubtopics, setAvailableSubtopics] = useState<Subtopic[]>([])
  const [loadingSubtopics, setLoadingSubtopics] = useState(false)

  // Sessions
  const [sessions, setSessions] = useState<Array<{
    id?: number
    date: string
    start_time: string
    end_time: string
    venue_id?: string
  }>>([{ date: '', start_time: '', end_time: '', venue_id: '' }])

  // Fetch master data
  useEffect(() => {
    const fetchMasterData = async () => {
      try {
        const [facultiesRes, tutorsRes, venuesRes] = await Promise.all([
          masterDataService.getFaculties(),
          tutorsService.getAll(),
          venuesService.getAll(),
        ])

        if (facultiesRes.status && facultiesRes.data) {
          setFaculties(Array.isArray(facultiesRes.data) ? facultiesRes.data : [])
        }
        if (tutorsRes.status && tutorsRes.data) {
          setTutors(Array.isArray(tutorsRes.data) ? tutorsRes.data : [])
        }
        if (venuesRes.status && venuesRes.data) {
          setVenues(Array.isArray(venuesRes.data) ? venuesRes.data : [])
        }
      } catch (error) {
        console.error('Error fetching master data:', error)
      }
    }

    fetchMasterData()
  }, [])

  // Fetch departments when faculty changes
  useEffect(() => {
    if (facultyId) {
      masterDataService.getDepartments(Number(facultyId)).then(res => {
        if (res.status && res.data) {
          setDepartments(Array.isArray(res.data) ? res.data : [])
        }
      })
      setDepartmentId('')
      setSubjectId('')
      setTopicId('')
    } else {
      setDepartments([])
    }
  }, [facultyId])

  // Fetch subjects when department changes
  useEffect(() => {
    if (departmentId) {
      masterDataService.getSubjects(Number(departmentId)).then(res => {
        if (res.status && res.data) {
          setSubjects(Array.isArray(res.data) ? res.data : [])
        }
      })
      setSubjectId('')
      setTopicId('')
    } else {
      setSubjects([])
    }
  }, [departmentId])

  // Fetch topics when subject changes
  useEffect(() => {
    if (subjectId && !createNewTopic) {
      masterDataService.getTopics(Number(subjectId)).then(res => {
        if (res.status && res.data) {
          setTopics(Array.isArray(res.data) ? res.data : [])
        }
      })
      setTopicId('')
    } else {
      setTopics([])
    }
  }, [subjectId, createNewTopic])

  // Fetch subtopics when topic changes
  useEffect(() => {
    if (topicId && !createNewTopic) {
      setLoadingSubtopics(true)
      setAvailableSubtopics([]) // Clear previous subtopics while loading
      masterDataService.getSubtopics(Number(topicId)).then(res => {
        if (res.status && res.data) {
          const subtopicsList = Array.isArray(res.data) ? res.data : []
          setAvailableSubtopics(subtopicsList)
        } else {
          setAvailableSubtopics([])
        }
        setLoadingSubtopics(false)
      }).catch(err => {
        console.error('Error fetching subtopics:', err)
        setAvailableSubtopics([])
        setLoadingSubtopics(false)
      })
    } else {
      setAvailableSubtopics([])
      setLoadingSubtopics(false)
    }
  }, [topicId, createNewTopic])

  // Fetch discussion data for edit
  useEffect(() => {
    if (isEdit && id) {
      setFetching(true)
      Promise.all([
        discussionsService.getById(id),
        tutorsService.getAll(),
        masterDataService.getFaculties(),
      ]).then(([discussionRes, tutorsRes, facultiesRes]) => {
        if (discussionRes.status && discussionRes.data) {
          const discussion = discussionRes.data
          
          // Find tutor by matching professor name
          let foundTutorId = ''
          if (tutorsRes.status && tutorsRes.data && discussion.professor) {
            const tutor = Array.isArray(tutorsRes.data) 
              ? tutorsRes.data.find(t => t.name === discussion.professor)
              : null
            if (tutor) {
              foundTutorId = String(tutor.id)
            }
          }

          setFormData({
            title: discussion.title,
            description: discussion.description || '',
            tutor_id: foundTutorId,
            max_students: String(discussion.maxStudents),
            price: String(discussion.price),
            status: discussion.status,
          })

          // Set hierarchy - find by name
          if (facultiesRes.status && facultiesRes.data && discussion.faculty) {
            const faculty = Array.isArray(facultiesRes.data)
              ? facultiesRes.data.find(f => f.name === discussion.faculty)
              : null
            if (faculty) {
              setFacultyId(String(faculty.id))
              
              // Fetch departments for this faculty
              masterDataService.getDepartments(faculty.id).then(deptRes => {
                if (deptRes.status && deptRes.data && discussion.department) {
                  const department = Array.isArray(deptRes.data)
                    ? deptRes.data.find(d => d.name === discussion.department)
                    : null
                  if (department) {
                    setDepartmentId(String(department.id))
                    
                    // Fetch subjects for this department
                    masterDataService.getSubjects(department.id).then(subjRes => {
                      if (subjRes.status && subjRes.data && discussion.subject) {
                        const subject = Array.isArray(subjRes.data)
                          ? subjRes.data.find(s => s.name === discussion.subject)
                          : null
                        if (subject) {
                          setSubjectId(String(subject.id))
                          
                          // Fetch topics for this subject
                          masterDataService.getTopics(subject.id).then(topicRes => {
                            if (topicRes.status && topicRes.data && discussion.topic) {
                              const topic = Array.isArray(topicRes.data)
                                ? topicRes.data.find(t => t.name === discussion.topic)
                                : null
                              if (topic) {
                                setTopicId(String(topic.id))
                                // Fetch subtopics for this topic
                                masterDataService.getSubtopics(topic.id).then(subtopicsRes => {
                                  if (subtopicsRes.status && subtopicsRes.data) {
                                    setAvailableSubtopics(Array.isArray(subtopicsRes.data) ? subtopicsRes.data : [])
                                  }
                                })
                              }
                            }
                          })
                        }
                      }
                    })
                  }
                }
              })
            }
          }

          // Set subtopics
          if (discussion.subtopics) {
            setSubtopics(discussion.subtopics.map(st => ({ 
              id: st.id, 
              name: st.name, 
              description: st.description || undefined 
            })))
          }

          // Set sessions - parse dates and times
          if (discussion.sessions && discussion.sessions.length > 0) {
            setSessions(discussion.sessions.map(s => {
              // Parse date from ISO string to YYYY-MM-DD
              let dateStr = ''
              if (s.date) {
                try {
                  const date = new Date(s.date)
                  if (!isNaN(date.getTime())) {
                    // Use UTC date to avoid timezone issues
                    const year = date.getUTCFullYear()
                    const month = String(date.getUTCMonth() + 1).padStart(2, '0')
                    const day = String(date.getUTCDate()).padStart(2, '0')
                    dateStr = `${year}-${month}-${day}`
                  }
                } catch (e) {
                  console.error('Error parsing date:', e)
                }
              }
              
              // Parse time from ISO string to HH:mm (extract UTC time)
              let startTimeStr = ''
              if (s.start_time) {
                try {
                  const startDate = new Date(s.start_time)
                  if (!isNaN(startDate.getTime())) {
                    // Extract UTC hours and minutes
                    const hours = String(startDate.getUTCHours()).padStart(2, '0')
                    const minutes = String(startDate.getUTCMinutes()).padStart(2, '0')
                    startTimeStr = `${hours}:${minutes}`
                  }
                } catch (e) {
                  console.error('Error parsing start_time:', e)
                }
              }
              
              let endTimeStr = ''
              if (s.end_time) {
                try {
                  const endDate = new Date(s.end_time)
                  if (!isNaN(endDate.getTime())) {
                    // Extract UTC hours and minutes
                    const hours = String(endDate.getUTCHours()).padStart(2, '0')
                    const minutes = String(endDate.getUTCMinutes()).padStart(2, '0')
                    endTimeStr = `${hours}:${minutes}`
                  }
                } catch (e) {
                  console.error('Error parsing end_time:', e)
                }
              }

              return {
                id: s.id,
                date: dateStr,
                start_time: startTimeStr,
                end_time: endTimeStr,
                venue_id: s.venue_id ? String(s.venue_id) : '',
              }
            }))
          } else {
            // If no sessions, keep the initial empty session
            setSessions([{ date: '', start_time: '', end_time: '', venue_id: '' }])
          }
        }
        setFetching(false)
      }).catch(err => {
        console.error('Error fetching discussion:', err)
        setFetching(false)
      })
    }
  }, [id, isEdit])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const submitData: CreateDiscussionData = {
        title: formData.title,
        description: formData.description || undefined,
        tutor_id: Number(formData.tutor_id),
        max_students: Number(formData.max_students),
        price: Number(formData.price),
        status: formData.status,
      }

      // Handle topic
      if (createNewTopic && newTopicName && subjectId) {
        submitData.new_topic = {
          name: newTopicName,
          subject_id: Number(subjectId),
        }
      } else if (topicId) {
        submitData.topic_id = Number(topicId)
      }

      // Handle subtopics
      if (subtopics.length > 0) {
        submitData.subtopics = subtopics.map(st => ({
          ...(st.id ? { id: st.id } : {}),
          ...(st.name ? { name: st.name, description: st.description } : {}),
        }))
      }

      // Handle sessions - include id for updates
      submitData.sessions = sessions
        .filter(s => s.date && s.start_time && s.end_time)
        .map(s => ({
          ...(s.id ? { id: s.id } : {}),
          date: s.date,
          start_time: s.start_time,
          end_time: s.end_time,
          venue_id: s.venue_id ? Number(s.venue_id) : null,
        }))

      let response
      if (isEdit) {
        response = await discussionsService.update(id!, submitData)

        console.log('submitData-dicussion-update',submitData)

        console.log('response-dicussion-update',response)
      } else {
        response = await discussionsService.create(submitData)

        console.log('response-dicussion',response)
      }

      if (response.status) {
        toast.success(
          isEdit 
            ? `"${formData.title}" has been updated successfully.`
            : `"${formData.title}" has been created successfully.`
        )
        setTimeout(() => navigate('/discussions'), 1000)
      } else {
        toast.error(response.message || 'Failed to save discussion. Please try again.')
        setLoading(false)
      }
    } catch (error) {
      console.error('Error saving discussion:', error)
      toast.error('An error occurred while saving the discussion. Please try again.')
      setLoading(false)
    }
  }

  const addSession = () => {
    setSessions([...sessions, { date: '', start_time: '', end_time: '', venue_id: '' }])
  }

  const removeSession = (index: number) => {
    setSessions(sessions.filter((_, i) => i !== index))
  }

  const updateSession = (index: number, field: string, value: any) => {
    const updated = [...sessions]
    updated[index] = { ...updated[index], [field]: value }
    setSessions(updated)
  }

  const addSubtopic = () => {
    setSubtopics([...subtopics, { name: '', description: '' }])
  }

  const removeSubtopic = (index: number) => {
    setSubtopics(subtopics.filter((_, i) => i !== index))
  }

  const updateSubtopic = (index: number, field: string, value: any) => {
    const updated = [...subtopics]
    updated[index] = { ...updated[index], [field]: value }
    setSubtopics(updated)
  }

  const selectExistingSubtopic = (index: number, subtopicId: number) => {
    const subtopic = availableSubtopics.find(st => st.id === subtopicId)
    if (subtopic) {
      const updated = [...subtopics]
      updated[index] = { id: subtopic.id, name: subtopic.name, description: subtopic.description }
      setSubtopics(updated)
    }
  }

  if (fetching) {
    return <Loader fullScreen text="Loading discussion..." />
  }

  return (
    <>
      {loading && <Loader fullScreen text="Saving discussion..." />}
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/discussions')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {isEdit ? 'Edit Discussion' : 'Create Discussion'}
            </h1>
            <p className="text-gray-600 mt-2">
              {isEdit ? 'Update discussion information' : 'Create a new class discussion'}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Title *
              </label>
              <input
                type="text"
                id="title"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="tutor_id" className="block text-sm font-medium text-gray-700 mb-1">
                Tutor/Professor *
              </label>
              <select
                id="tutor_id"
                required
                value={formData.tutor_id}
                onChange={(e) => setFormData({ ...formData, tutor_id: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">Select a tutor</option>
                {tutors.map(tutor => (
                  <option key={tutor.id} value={tutor.id}>{tutor.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="max_students" className="block text-sm font-medium text-gray-700 mb-1">
                Max Students *
              </label>
              <input
                type="number"
                id="max_students"
                required
                min="1"
                value={formData.max_students}
                onChange={(e) => setFormData({ ...formData, max_students: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                Price *
              </label>
              <input
                type="number"
                id="price"
                required
                min="0"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                Status *
              </label>
              <select
                id="status"
                required
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          {/* Hierarchy Selection */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Topic Selection</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Faculty *
                </label>
                <select
                  value={facultyId}
                  onChange={(e) => setFacultyId(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="">Select Faculty</option>
                  {faculties.map(faculty => (
                    <option key={faculty.id} value={faculty.id}>{faculty.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Department *
                </label>
                <select
                  value={departmentId}
                  onChange={(e) => setDepartmentId(e.target.value)}
                  required
                  disabled={!facultyId}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-100"
                >
                  <option value="">Select Department</option>
                  {departments.map(dept => (
                    <option key={dept.id} value={dept.id}>{dept.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subject *
                </label>
                <select
                  value={subjectId}
                  onChange={(e) => setSubjectId(e.target.value)}
                  required
                  disabled={!departmentId}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-100"
                >
                  <option value="">Select Subject</option>
                  {subjects.map(subject => (
                    <option key={subject.id} value={subject.id}>{subject.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Topic *
                </label>
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() => setCreateNewTopic(!createNewTopic)}
                    className="text-xs text-primary hover:underline"
                  >
                    {createNewTopic ? 'Select Existing' : 'Create New'}
                  </button>
                  {createNewTopic ? (
                    <input
                      type="text"
                      value={newTopicName}
                      onChange={(e) => setNewTopicName(e.target.value)}
                      placeholder="Topic name"
                      required={createNewTopic}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  ) : (
                    <select
                      value={topicId}
                      onChange={(e) => setTopicId(e.target.value)}
                      required={!createNewTopic}
                      disabled={!subjectId}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-100"
                    >
                      <option value="">Select Topic</option>
                      {topics.map(topic => (
                        <option key={topic.id} value={topic.id}>{topic.name}</option>
                      ))}
                    </select>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Subtopics */}
          <div className="border-t pt-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Subtopics</h3>
                <p className="text-sm text-gray-600 mt-1">
                  {topicId 
                    ? 'Select existing subtopics from the topic or create new ones'
                    : 'Select a topic first to see available subtopics'}
                </p>
              </div>
              <button
                type="button"
                onClick={addSubtopic}
                disabled={!topicId && !createNewTopic}
                className="px-3 py-1 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors inline-flex items-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus size={16} />
                Add Subtopic
              </button>
            </div>
            
            {topicId && (
              <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                {loadingSubtopics ? (
                  <div className="text-center py-2">
                    <p className="text-sm text-blue-700">Loading subtopics...</p>
                  </div>
                ) : availableSubtopics.length > 0 ? (
                  <>
                    <p className="text-sm font-medium text-blue-900 mb-2">
                      Available Subtopics from Selected Topic ({availableSubtopics.length})
                    </p>
                    <p className="text-xs text-blue-700 mb-3">
                      Click on a subtopic below to add it to this discussion, or create new ones
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {availableSubtopics
                        .filter(st => !subtopics.some(s => s.id === st.id))
                        .map(st => (
                          <button
                            key={st.id}
                            type="button"
                            onClick={() => {
                              const newSubtopic = { 
                                id: st.id, 
                                name: st.name, 
                                description: st.description || undefined 
                              }
                              setSubtopics([...subtopics, newSubtopic])
                            }}
                            className="px-3 py-1 text-sm bg-white border border-blue-300 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors flex items-center gap-1"
                          >
                            <Plus size={14} />
                            {st.name}
                            {st.description && (
                              <span className="text-xs text-gray-500">({st.description})</span>
                            )}
                          </button>
                        ))}
                    </div>
                    {availableSubtopics.filter(st => !subtopics.some(s => s.id === st.id)).length === 0 && (
                      <p className="text-xs text-blue-600 mt-2">
                        All available subtopics have been added. You can create new ones below.
                      </p>
                    )}
                  </>
                ) : (
                  <div className="text-center py-2">
                    <p className="text-sm text-blue-700">
                      No subtopics found for this topic. You can create new subtopics below.
                    </p>
                  </div>
                )}
              </div>
            )}

            <div className="space-y-4">
              {subtopics.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                  <p className="text-gray-600">No subtopics added yet</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {topicId 
                      ? 'Click "Add Subtopic" to select existing or create new subtopics'
                      : 'Select a topic first to add subtopics'}
                  </p>
                </div>
              ) : (
                subtopics.map((subtopic, index) => (
                  <div key={index} className="flex gap-4 items-start p-4 border border-gray-200 rounded-lg bg-white">
                    <div className="flex-1 space-y-4">
                      {!createNewTopic && topicId && availableSubtopics.length > 0 && !subtopic.id && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Select Existing Subtopic (Optional)
                          </label>
                          <select
                            value=""
                            onChange={(e) => {
                              if (e.target.value) {
                                selectExistingSubtopic(index, Number(e.target.value))
                              }
                            }}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                          >
                            <option value="">Choose from existing subtopics...</option>
                            {availableSubtopics
                              .filter(st => !subtopics.some((s, i) => s.id === st.id && i !== index))
                              .map(st => (
                                <option key={st.id} value={st.id}>{st.name}</option>
                              ))}
                          </select>
                          <p className="text-xs text-gray-500 mt-1">
                            Or create a new subtopic below
                          </p>
                        </div>
                      )}

                      {subtopic.id ? (
                        <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                                  Existing Subtopic
                                </span>
                                <p className="font-medium text-gray-900">{subtopic.name}</p>
                              </div>
                              {subtopic.description && (
                                <p className="text-sm text-gray-600 mt-1">{subtopic.description}</p>
                              )}
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                const updated = [...subtopics]
                                updated[index] = { name: '', description: '' }
                                setSubtopics(updated)
                              }}
                              className="text-xs text-gray-500 hover:text-gray-700 underline ml-2"
                            >
                              Change
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Subtopic Name *
                            </label>
                            <input
                              type="text"
                              value={subtopic.name || ''}
                              onChange={(e) => updateSubtopic(index, 'name', e.target.value)}
                              required
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                              placeholder="Enter subtopic name"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Description
                            </label>
                            <input
                              type="text"
                              value={subtopic.description || ''}
                              onChange={(e) => updateSubtopic(index, 'description', e.target.value)}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                              placeholder="Enter description (optional)"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => removeSubtopic(index)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Remove subtopic"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Sessions */}
          <div className="border-t pt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Sessions</h3>
              <button
                type="button"
                onClick={addSession}
                className="px-3 py-1 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors inline-flex items-center gap-2 text-sm"
              >
                <Plus size={16} />
                Add Session
              </button>
            </div>
            <div className="space-y-4">
              {sessions.map((session, index) => (
                <div key={index} className="flex gap-4 items-start p-4 border border-gray-200 rounded-lg">
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Date *
                      </label>
                      <input
                        type="date"
                        value={session.date}
                        onChange={(e) => updateSession(index, 'date', e.target.value)}
                        required
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Start Time *
                      </label>
                      <input
                        type="time"
                        value={session.start_time}
                        onChange={(e) => updateSession(index, 'start_time', e.target.value)}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        End Time *
                      </label>
                      <input
                        type="time"
                        value={session.end_time}
                        onChange={(e) => updateSession(index, 'end_time', e.target.value)}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Venue
                      </label>
                      <select
                        value={session.venue_id || ''}
                        onChange={(e) => updateSession(index, 'venue_id', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      >
                        <option value="">Select Venue</option>
                        {venues.map(venue => (
                          <option key={venue.id} value={venue.id}>{venue.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  {sessions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeSession(index)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-4 border-t">
            <button
              type="button"
              onClick={() => navigate('/discussions')}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {loading ? 'Saving...' : isEdit ? 'Update Discussion' : 'Create Discussion'}
            </button>
          </div>
        </form>
      </div>
    </>
  )
}

export default DiscussionForm
