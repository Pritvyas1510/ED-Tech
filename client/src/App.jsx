import Footer from "./Componets/Footer";
import Navbar from "./Componets/Navbar";
import Home from "./Pages/Student/Home/Home";
import Mycourses from "./Pages/Student/My Cources/Mycourses";
import About from "./Pages/Student/Aboute us/About";
import Teacherhome from "./Pages/Teacher/TeacherHome/Teacherhome";
import Login from "./Pages/Authentication/Login/Login";
import Register from "./Pages/Authentication/Registration/Register";
import { Route, Routes } from "react-router-dom";
import { AuthProvider } from "./AuthContex/AuthContex";
import Adminhome from "./Pages/Admin/AdminHome/Adminhome";
import Profile from "./Pages/Profile/Profile";
import ProtectedRoute from "./Routes/Protected_Routes/ProtectesRoutes";
import NotFound from "./Routes/NotFound/Notfound";
import { Toaster } from "react-hot-toast";
import AllCourse from "./Pages/Student/All Cources/AllCourse.jsx";
import AllUsers from "./Pages/Admin/All user/Alluser.jsx";
import AddSection from "./Pages/Teacher/Section/AddSection.jsx";
import SectionManager from "./Pages/Teacher/Section/SectionManager.jsx";
import CourseDetails from "./Pages/Teacher/CourseDetails/CourseDetails.jsx";
import CourseManager from "./Pages/Teacher/CourseManager/CourseManager.jsx";
import CreateCourse from "./Pages/Teacher/CreateCourse/CreateCourse.jsx";
import StudentCourseDetails from "./Pages/Student/All Cources/StudentCourseDetails.jsx";
import CourseLectures from "./Pages/Student/All Cources/CourseLectures.jsx";
import MyCourses from "./Pages/Student/My Cources/Mycourses";
import Category from "./Pages/Admin/Catogary/Catagory.jsx"
import StudentCourse from "./Pages/Student/StudentCourse.jsx";
import UpdateCourse from "./Pages/Teacher/UpdateCources/UpdateCourse.jsx";
// import StudentCourse from "./Pages/Student/StudentCourse.jsx";

function App() {
  return (
    <AuthProvider>
      <div className="bg-white">
        <Navbar />
        <Toaster position="top-right" reverseOrder={false} />

        <Routes>
          {/* Student page */}
          <Route path="/" element={<Home />} />
          <Route path="/mycourses" element={<MyCourses />} />
          <Route path="/mycourses/:courseId" element={<CourseLectures />} />
          <Route path="/allcourses" element={<AllCourse />} />
          <Route path="/about" element={<About />} />
          <Route
            path="/student/courses/:id"
            element={<StudentCourseDetails />}
          />
          <Route
            path="/mycourses/:id"
            element={<StudentCourse />}
          />

          {/* Teacher page */}
          <Route element={<ProtectedRoute allowedRoles={["instructor"]} />}>
            <Route path="/teacherhome" element={<Teacherhome />} />
            <Route path="/createcourses" element={<CreateCourse />} />
            <Route path="/section-manager" element={<SectionManager />} />
            <Route path="/courses/:id" element={<CourseDetails />} />
            <Route path="/add-section/:courseId" element={<AddSection />} />
            <Route path="/course-manager" element={<CourseManager />} />
            <Route path="/updatecources/:id" element={<UpdateCourse/>}/>
          </Route>

          {/* Admin page */}
          <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
            <Route path="/category" element={<Category />} />
            <Route path="/adminhome" element={<Adminhome />} />
            <Route path="/alluser" element={<AllUsers />} />
          </Route>

          {/* Authentication page */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Profile page */}
          <Route path="/profile" element={<Profile />} />

          {/* Not Found */}
          <Route path="*" element={<NotFound />} />
        </Routes>

        <Footer />
      </div>
    </AuthProvider>
  );
}

export default App;
