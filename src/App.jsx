import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import axios from "axios";

import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/ProfilePage";
import TeachersPage from "./pages/TeachersPage";
import LearningPage from "./pages/LearningPage";
import LoginPage from "./pages/LoginPage";
import NewsPage from "./pages/NewsPage";
import ExtracurricularPage from "./pages/ExtracurricularPage";
import StudentsPage from "./pages/StudentsPage";
import RabuCeria from "./pages/RabuCeria";
import ActivitiesPage from "./pages/ActivitiesPage";

import Footer from "./components/Footer";
import NavBar from "./components/NavBar";

import AdminLogin from "./pages/admin/AdminLogin";
import AdminHeader from "./components/AdminHeader";
import AdminNav from "./components/AdminNav";
import AdminHome from "./pages/admin/AdminHome";
import AdminLearning from "./pages/admin/AdminLearning";
import AdminRabuCeria from "./pages/admin/AdminRabuCeria";
import AdminActivities from "./pages/admin/AdminActivities";
import AdminProfile from "./pages/admin/AdminProfile";
import AdminTeachers from "./pages/admin/AdminTeachers";
import AdminNews from "./pages/admin/AdminNews";
import AdminAnnouncement from "./pages/admin/AdminAnnouncement";
import AdminExtracurricular from "./pages/admin/AdminExtracurricular";
import AdminStudents from "./pages/admin/AdminStudents";
import NewPage from "./pages/NewPage";
import AnnoucementsPage from "./pages/AnnoucementsPage";
import AnnoucementPage from "./pages/AnnoucementPage";
import DimensionsPage from "./pages/DImensionsPage";
import AdminDimensions from "./pages/admin/AdminDimensions";
import GalleryPage from "./pages/GalleryPage";
import AdminGallery from "./pages/admin/AdminGallery";
import AdminSchoolGround from "./pages/admin/AdminSchoolGround";

const MainPage = (page) => {
  return (
    <>
      <NavBar />
      {page}
      <Footer />
    </>
  );
};

const AdminPage = (page, showNav = true, handleLogout) => {
  return (
    <>
      <AdminHeader />
      {showNav ? (
        <div className="grid grid-cols-[1fr_2fr] md:grid-cols-[250px_1fr] xl:grid-cols-[300px_1fr]">
          <AdminNav onLogout={handleLogout} />
          {page}
        </div>
      ) : (
        page
      )}
    </>
  );
};

const PrivateRoute = ({ element, authenticated, ...rest }) => {
  // Periksa apakah pengguna diotentikasi, jika tidak maka arahkan ke halaman /admin
  if (!authenticated) {
    return <Navigate to="/admin" />;
  }
  // Jika pengguna diotentikasi, tampilkan elemen yang dimaksud
  return element;
};

const App = () => {
  const [authenticated, setAuthenticated] = useState(
    localStorage.getItem("authenticated") === "true" // Convert to boolean
  );

   useEffect(() => {
    // Simpan status autentikasi ke localStorage setiap kali berubah
    localStorage.setItem("authenticated", authenticated);
  }, [authenticated]);

  const handleLogin = (token) => {
    setAuthenticated(true);
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  };

  const handleLogout = () => {
    localStorage.removeItem("authenticated");
    setAuthenticated(false);
    delete axios.defaults.headers.common["Authorization"];// Hapus token dari header axios atau lakukan aksi logout lainnya yang diperlukan
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={MainPage(<HomePage />)} />
        <Route path="/login" element={MainPage(<LoginPage />)} />
        <Route path="/profil" element={MainPage(<ProfilePage />)} />
        <Route path="/guru" element={MainPage(<TeachersPage />)} />
        <Route path="/organisasi" element={MainPage(<LearningPage />)} />
        <Route path="/berita" element={MainPage(<NewsPage />)} />
        <Route path="/berita/:id" element={MainPage(<NewPage />)} />
        <Route path="/pengumuman" element={MainPage(<AnnoucementsPage />)} />
        <Route path="/pengumuman/:id" element={MainPage(<AnnoucementPage />)} />
        <Route
          path="/ekstrakurikuler"
          element={MainPage(<ExtracurricularPage />)}
        />
        <Route path="/siswa" element={MainPage(<StudentsPage />)} />
        <Route path="/rabuceria" element={MainPage(<RabuCeria />)} />
        <Route path="/kegiatan" element={MainPage(<ActivitiesPage />)} />
        <Route path="/dikmensi" element={MainPage(<DimensionsPage />)} />
        <Route path="/galeri" element={MainPage(<GalleryPage />)} />

        <Route path="/admin" element={<AdminLogin onLogin={handleLogin} />} />
        
        <Route path="/admin/beranda/*" element={<PrivateRoute element={AdminPage(<AdminHome />, true, handleLogout)} authenticated={authenticated} />} />
        <Route path="/admin/beranda/:id" element={<PrivateRoute element={AdminPage(<AdminHome />, true, handleLogout)} authenticated={authenticated} />} />
        <Route path="/admin/profil/*" element={<PrivateRoute element={AdminPage(<AdminProfile />, true, handleLogout)} authenticated={authenticated} />} />
        <Route path="/admin/profil/:id" element={<PrivateRoute element={AdminPage(<AdminProfile />, true, handleLogout)} authenticated={authenticated} />} />
        <Route path="/admin/guru/*" element={<PrivateRoute element={AdminPage(<AdminTeachers />, true, handleLogout)} authenticated={authenticated} />} />
        <Route
          path="/admin/organisasi/*"
          element={<PrivateRoute element={AdminPage(<AdminLearning />, true, handleLogout)} authenticated={authenticated} />}
        />
        <Route
          path="/admin/organisasi/:id"
          element={<PrivateRoute element={AdminPage(<AdminLearning />, true, handleLogout)} authenticated={authenticated} />}
        />
        <Route path="/admin/berita/*" element={<PrivateRoute element={AdminPage(<AdminNews />, true, handleLogout)} authenticated={authenticated} />} />
        <Route path="/admin/berita/:id" element={<PrivateRoute element={AdminPage(<AdminNews />, true, handleLogout)} authenticated={authenticated}/>} />
        <Route
          path="/admin/pengumuman/*"
          element={<PrivateRoute element={AdminPage(<AdminAnnouncement />, true, handleLogout)} authenticated={authenticated} />}
        />
        <Route
          path="/pengumuman/:id/:fileName"
          element={<PrivateRoute element={AdminPage(<AdminAnnouncement />, true, handleLogout)} authenticated={authenticated} />}
        />
        <Route
          path="/admin/ekstrakurikuler/*"
          element={<PrivateRoute element={AdminPage(<AdminExtracurricular />, true, handleLogout)} authenticated={authenticated} />}
        />
        <Route
          path="/admin/ekstrakurikuler/favorite/:id"
          element={<PrivateRoute element={AdminPage(<AdminExtracurricular />, true, handleLogout)} authenticated={authenticated} />}
        />
        <Route
          path="/admin/ekstrakurikuler/pilihan/:id"
          element={<PrivateRoute element={AdminPage(<AdminExtracurricular />, true, handleLogout)} authenticated={authenticated} />}
        />
        <Route path="/admin/siswa/*" element={<PrivateRoute element={AdminPage(<AdminStudents />, true, handleLogout)} authenticated={authenticated} />} />
        <Route path="/admin/siswa/:id" element={<PrivateRoute element={AdminPage(<AdminStudents />, true, handleLogout)} authenticated={authenticated} />} />
        <Route
          path="/admin/rabuceria/*"
          element={<PrivateRoute element={AdminPage(<AdminRabuCeria />, true, handleLogout)} authenticated={authenticated} />}
        />
        <Route
          path="/admin/rabuceria/:id"
          element={<PrivateRoute element={AdminPage(<AdminRabuCeria />, true, handleLogout)} authenticated={authenticated} />}
        />
        <Route
          path="/admin/kegiatan/*"
          element={<PrivateRoute element={AdminPage(<AdminActivities />, true, handleLogout)} authenticated={authenticated} />}
        />
        <Route
          path="/admin/dikmensi/*"
          element={<PrivateRoute element={AdminPage(<AdminDimensions />)} authenticated={authenticated} />}
        />
        <Route
          path="/admin/dikmensi/:id"
          element={<PrivateRoute element={AdminPage(<AdminDimensions />, true, handleLogout)} authenticated={authenticated} />}
        />
        <Route path="/admin/galeri/*" element={<PrivateRoute element={AdminPage(<AdminGallery />, true, handleLogout)} authenticated={authenticated} />} />
        <Route path="/admin/galeri/:id" element={<PrivateRoute element={AdminPage(<AdminGallery />, true, handleLogout)} authenticated={authenticated} />} />
        <Route path="/admin/denah/*" element={<PrivateRoute element={AdminPage(<AdminSchoolGround />, true, handleLogout)} authenticated={authenticated} />} />
        <Route path="/admin/denahruang/*" element={<PrivateRoute element={AdminPage(<AdminSchoolGround />, true, handleLogout)} authenticated={authenticated} />} />
        <Route path="/admin/denahdetail/*" element={<PrivateRoute element={AdminPage(<AdminSchoolGround />, true, handleLogout)} authenticated={authenticated} />} />
        <Route path="/admin/denahruang/:id" element={<PrivateRoute element={AdminPage(<AdminSchoolGround />, true, handleLogout)} authenticated={authenticated} />} />
        <Route path="/admin/denahdetail/:id" element={<PrivateRoute element={AdminPage(<AdminSchoolGround />, true, handleLogout)} authenticated={authenticated} />} />
      </Routes>
    
    </Router>
  );
};

export default App;
