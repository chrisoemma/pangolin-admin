import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import DashboardLayout from './layouts/DashboardLayout'
import Dashboard from './pages/Dashboard'
import Books from './pages/Books/Books'
import BookDetail from './pages/Books/BookDetail'
import BookForm from './pages/Books/BookForm'
import BookAnswers from './pages/Books/BookAnswers'
import Discussions from './pages/Discussions/Discussions'
import DiscussionDetail from './pages/Discussions/DiscussionDetail'
import DiscussionForm from './pages/Discussions/DiscussionForm'
import DiscussionSubscriptions from './pages/Discussions/DiscussionSubscriptions'
import Orders from './pages/Orders/Orders'
import OrderDetail from './pages/Orders/OrderDetail'
import Payments from './pages/Payments/Payments'
import PaymentDetail from './pages/Payments/PaymentDetail'
import Students from './pages/Students/Students'
import StudentDetail from './pages/Students/StudentDetail'
import ProtectedRoute from './components/ProtectedRoute'
// Master Data
import Faculties from './pages/MasterData/Faculties/Faculties'
import FacultyForm from './pages/MasterData/Faculties/FacultyForm'
import FacultyDetail from './pages/MasterData/Faculties/FacultyDetail'
import Departments from './pages/MasterData/Departments/Departments'
import DepartmentForm from './pages/MasterData/Departments/DepartmentForm'
import DepartmentDetail from './pages/MasterData/Departments/DepartmentDetail'
import Semesters from './pages/MasterData/Semesters/Semesters'
import SemesterForm from './pages/MasterData/Semesters/SemesterForm'
import SemesterDetail from './pages/MasterData/Semesters/SemesterDetail'
import YearOfStudyList from './pages/MasterData/YearOfStudy/YearOfStudy'
import YearOfStudyForm from './pages/MasterData/YearOfStudy/YearOfStudyForm'
import YearOfStudyDetail from './pages/MasterData/YearOfStudy/YearOfStudyDetail'
import Subjects from './pages/MasterData/Subjects/Subjects'
import SubjectForm from './pages/MasterData/Subjects/SubjectForm'
import SubjectDetail from './pages/MasterData/Subjects/SubjectDetail'
import Topics from './pages/MasterData/Topics/Topics'
import TopicForm from './pages/MasterData/Topics/TopicForm'
import TopicDetail from './pages/MasterData/Topics/TopicDetail'
import Authors from './pages/MasterData/Authors/Authors'
import AuthorForm from './pages/MasterData/Authors/AuthorForm'
import AuthorDetail from './pages/MasterData/Authors/AuthorDetail'
import Tutors from './pages/MasterData/Tutors/Tutors'
import TutorForm from './pages/MasterData/Tutors/TutorForm'
import TutorDetail from './pages/MasterData/Tutors/TutorDetail'
import Categories from './pages/MasterData/Categories/Categories'
import CategoryForm from './pages/MasterData/Categories/CategoryForm'
import CategoryDetail from './pages/MasterData/Categories/CategoryDetail'
import Venues from './pages/MasterData/Venues/Venues'
import VenueForm from './pages/MasterData/Venues/VenueForm'
import VenueDetail from './pages/MasterData/Venues/VenueDetail'
// Settings
import General from './pages/Settings/General'
import Notifications from './pages/Settings/Notifications'
import SystemConfiguration from './pages/Settings/SystemConfiguration'
import PaymentMethods from './pages/Settings/PaymentMethods/PaymentMethods'
import PaymentMethodForm from './pages/Settings/PaymentMethods/PaymentMethodForm'
import PaymentMethodDetail from './pages/Settings/PaymentMethods/PaymentMethodDetail'
import Users from './pages/Settings/Users/Users'
import UserForm from './pages/Settings/Users/UserForm'
import UserDetail from './pages/Settings/Users/UserDetail'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="books" element={<Books />} />
          <Route path="books/:id" element={<BookDetail />} />
          <Route path="books/new" element={<BookForm />} />
          <Route path="books/:id/edit" element={<BookForm />} />
          <Route path="books/:id/answers" element={<BookAnswers />} />
          <Route path="discussions" element={<Discussions />} />
          <Route path="discussions/:id" element={<DiscussionDetail />} />
          <Route path="discussions/new" element={<DiscussionForm />} />
          <Route path="discussions/:id/edit" element={<DiscussionForm />} />
          <Route path="discussions/:id/subscriptions" element={<DiscussionSubscriptions />} />
          <Route path="orders" element={<Orders />} />
          <Route path="orders/:id" element={<OrderDetail />} />
          <Route path="payments" element={<Payments />} />
          <Route path="payments/:id" element={<PaymentDetail />} />
          <Route path="students" element={<Students />} />
          <Route path="students/:id" element={<StudentDetail />} />
          {/* Master Data Routes */}
          <Route path="master-data/faculties" element={<Faculties />} />
          <Route path="master-data/faculties/new" element={<FacultyForm />} />
          <Route path="master-data/faculties/:id" element={<FacultyDetail />} />
          <Route path="master-data/faculties/:id/edit" element={<FacultyForm />} />
          <Route path="master-data/departments" element={<Departments />} />
          <Route path="master-data/departments/new" element={<DepartmentForm />} />
          <Route path="master-data/departments/:id" element={<DepartmentDetail />} />
          <Route path="master-data/departments/:id/edit" element={<DepartmentForm />} />
          <Route path="master-data/semesters" element={<Semesters />} />
          <Route path="master-data/semesters/new" element={<SemesterForm />} />
          <Route path="master-data/semesters/:id" element={<SemesterDetail />} />
          <Route path="master-data/semesters/:id/edit" element={<SemesterForm />} />
          <Route path="master-data/year-of-study" element={<YearOfStudyList />} />
          <Route path="master-data/year-of-study/new" element={<YearOfStudyForm />} />
          <Route path="master-data/year-of-study/:id" element={<YearOfStudyDetail />} />
          <Route path="master-data/year-of-study/:id/edit" element={<YearOfStudyForm />} />
          <Route path="master-data/subjects" element={<Subjects />} />
          <Route path="master-data/subjects/new" element={<SubjectForm />} />
          <Route path="master-data/subjects/:id" element={<SubjectDetail />} />
          <Route path="master-data/subjects/:id/edit" element={<SubjectForm />} />
          <Route path="master-data/topics" element={<Topics />} />
          <Route path="master-data/topics/new" element={<TopicForm />} />
          <Route path="master-data/topics/:id" element={<TopicDetail />} />
          <Route path="master-data/topics/:id/edit" element={<TopicForm />} />
          <Route path="master-data/authors" element={<Authors />} />
          <Route path="master-data/authors/new" element={<AuthorForm />} />
          <Route path="master-data/authors/:id" element={<AuthorDetail />} />
          <Route path="master-data/authors/:id/edit" element={<AuthorForm />} />
          <Route path="master-data/tutors" element={<Tutors />} />
          <Route path="master-data/tutors/new" element={<TutorForm />} />
          <Route path="master-data/tutors/:id" element={<TutorDetail />} />
          <Route path="master-data/tutors/:id/edit" element={<TutorForm />} />
          <Route path="master-data/categories" element={<Categories />} />
          <Route path="master-data/categories/new" element={<CategoryForm />} />
          <Route path="master-data/categories/:id" element={<CategoryDetail />} />
          <Route path="master-data/categories/:id/edit" element={<CategoryForm />} />
          <Route path="master-data/venues" element={<Venues />} />
          <Route path="master-data/venues/new" element={<VenueForm />} />
          <Route path="master-data/venues/:id" element={<VenueDetail />} />
          <Route path="master-data/venues/:id/edit" element={<VenueForm />} />
          {/* Settings Routes */}
          <Route path="settings/general" element={<General />} />
          <Route path="settings/notifications" element={<Notifications />} />
          <Route path="settings/system" element={<SystemConfiguration />} />
          <Route path="settings/payments" element={<PaymentMethods />} />
          <Route path="settings/payments/new" element={<PaymentMethodForm />} />
          <Route path="settings/payments/:id" element={<PaymentMethodDetail />} />
          <Route path="settings/payments/:id/edit" element={<PaymentMethodForm />} />
          <Route path="settings/users" element={<Users />} />
          <Route path="settings/users/new" element={<UserForm />} />
          <Route path="settings/users/:id" element={<UserDetail />} />
          <Route path="settings/users/:id/edit" element={<UserForm />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
