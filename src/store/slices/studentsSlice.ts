import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { studentsService, type Student } from "../../services/studentsService"

interface StudentsState {
  students: Student[]
  selectedStudent: Student | null
  isLoading: boolean
  isLoadingStudent: boolean
  error: string | null
  studentError: string | null
}

const initialState: StudentsState = {
  students: [],
  selectedStudent: null,
  isLoading: false,
  isLoadingStudent: false,
  error: null,
  studentError: null,
}

// Async thunks
export const fetchStudents = createAsyncThunk(
  "students/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await studentsService.getAll()
      if (response.status && response.data) {
        // Handle API response format: { data: { students: [...], pagination: {...} } }
        let students: Student[] = []
        if (Array.isArray(response.data)) {
          students = response.data
        } else if (response.data && typeof response.data === 'object' && 'students' in response.data) {
          students = (response.data as { students?: Student[] }).students || []
        }
        return students
      }
      return rejectWithValue(response.message || "Failed to fetch students")
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to fetch students"
      )
    }
  }
)

export const fetchStudentById = createAsyncThunk(
  "students/fetchById",
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await studentsService.getById(id)
      console.log('response122333', response)
      if (response.status && response.data) {
        return response.data
      }
      return rejectWithValue(response.message || "Failed to fetch student")
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to fetch student"
      )
    }
  }
)

const studentsSlice = createSlice({
  name: "students",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    clearStudentError: (state) => {
      state.studentError = null
    },
    clearSelectedStudent: (state) => {
      state.selectedStudent = null
      state.studentError = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all students
      .addCase(fetchStudents.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchStudents.fulfilled, (state, action) => {
        state.isLoading = false
        state.students = action.payload
        state.error = null
      })
      .addCase(fetchStudents.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // Fetch student by ID
      .addCase(fetchStudentById.pending, (state) => {
        state.isLoadingStudent = true
        state.studentError = null
      })
      .addCase(fetchStudentById.fulfilled, (state, action) => {
        state.isLoadingStudent = false
        state.selectedStudent = action.payload
        state.studentError = null
      })
      .addCase(fetchStudentById.rejected, (state, action) => {
        state.isLoadingStudent = false
        state.studentError = action.payload as string
      })
  },
})

export const { clearError, clearStudentError, clearSelectedStudent } = studentsSlice.actions
export default studentsSlice.reducer