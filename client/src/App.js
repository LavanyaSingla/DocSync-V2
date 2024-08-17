import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TextEditor from "./TextEditor";
import Login from './Components/Login';
import Signup from './Components/Signup';
import Home from './Pages/Home';
import ChangePassword from './Components/ChangePassword';
import ProtectedRoutes from './Services/ProtectedRoutes.js';
import NotFound from './Pages/404.js';
import AuthRoute from './Services/AuthRoute.js';
import SaveDocument from './Components/SaveDocument.js';
import ShareDocument from './Components/ShareDocument.js';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<AuthRoute> <Login /> </AuthRoute>} />
        <Route path="/signup" element={<AuthRoute> <Signup /></AuthRoute>} />

        {/* Protected routes*/}
        <Route path="/" element={<ProtectedRoutes />}>
          <Route path="/" element={<Home />} />
          <Route path="/changePassword" element={<ChangePassword />} />
          <Route path="/document/:id" element={<TextEditor />} />
          <Route path="/saveDoc/document/:id" element={<SaveDocument />} />
          <Route path="/share/document/:id" element={<ShareDocument />} />

        </Route>

        <Route path="*" element={<NotFound />} />
        <Route path="404" element={<NotFound />} />

      </Routes>
    </Router>
  );
}

export default App;
