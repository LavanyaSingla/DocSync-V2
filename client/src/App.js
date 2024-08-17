import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import TextEditor from "./TextEditor";
import Login from './Components/Login';
import Signup from './Components/Signup';
import Home from './Pages/Home';
import ChangePassword from './Components/ChangePassword';
import ProtectedRoutes from './Services/ProtectedRoutes.js';
import NotFound from './Pages/404.js';
import AuthRoute from './Services/AuthRoute.js';

function PrivateRoute({ children }) {
  return <Navigate to="/login" />;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<AuthRoute> <Login /> </AuthRoute>} />
        <Route path="/signup" element={<AuthRoute> <Signup /></AuthRoute>} />
        <Route path="/" element={<ProtectedRoutes />}>
          <Route path="/" element={<Home />} />
          <Route path="/changePassword" element={<ChangePassword />} />
        </Route>
        <Route path="*" element={<NotFound />} />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Navigate to={`/documents/${uuidv4()}`} />
            </PrivateRoute>
          }
        />
        <Route
          path="/documents/:id"
          element={
            <PrivateRoute>
              <TextEditor />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
