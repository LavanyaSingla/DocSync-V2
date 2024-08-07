import TextEditor from "./TextEditor";
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import Login from './login';
import { AuthProvider, useAuth } from './authContext';

function PrivateRoute({ children }) {
  const user = useAuth();
  if (user) return children;
  return <Navigate to="/login" />;
}
function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element=
            {
              <PrivateRoute>
                <Navigate to={`/documents/${uuidv4()}`
                } />
              </PrivateRoute>
            }
          />
          <Route
            path="/documents/:id"
            element=
            {
              <PrivateRoute>
                <TextEditor />
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
