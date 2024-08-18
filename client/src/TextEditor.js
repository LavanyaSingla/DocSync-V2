import React, { useCallback, useEffect, useState } from 'react'
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import './styles.css';
import { io } from 'socket.io-client';
import { useParams, useNavigate } from 'react-router-dom';
import axios from './Services/axiosInterceptor';

const SAVE_INTERVAL_MS = 2000;
const TOOLBAR_OPTIONS = [
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  [{ font: [] }],
  [{ list: "ordered" }, { list: "bullet" }],
  ["bold", "italic", "underline"],
  [{ color: [] }, { background: [] }],
  [{ script: "sub" }, { script: "super" }],
  [{ align: [] }],
  ["iamge", "blockquote", "code-block"],
  ["clean"]
]

export default function TextEditor() {
  const [socket, setSocket] = useState(null);
  const [quill, setQuill] = useState(null);
  const { docName: docName } = useParams();
  const { id: documentId } = useParams();
  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");
  const navigate = useNavigate();
  const handleSaveDoc = () => {
    navigate(`/saveDoc/document/${docName}/${documentId}`);
  };
  const handleShare = () => {
    navigate(`/share/document/${docName}/${documentId}`);
  }
  const fetchDocument = async () => {
    try {
      const response = await axios.post(`api/document/${documentId}`, {}, {
        headers: {
          "authorization": `Bearer ${token}`
        }
      });
      if (response.status === 200) {
        quill.setContents(response.data.content || '');
        quill.enable();
      }
      else {
        console.log("error in fetching the doc");
      }
    }
    catch (err) {
      console.log("error in fetching the socket doc", err);
    }

  };
  useEffect(() => {
    const s = io("http://localhost:3001");
    setSocket(s);
    return () => {
      s.disconnect();
    }
  }, []);

  useEffect(() => {
    if (!quill || !socket) return;
    fetchDocument();
    socket.emit('get-document', documentId);
    socket.on('error', (message) => {
      navigate("/404");
    });
    socket.once('load-document', (document) => {
      quill.setContents(document);
      quill.enable();
    });

    return () => {
      socket.off('load-document');
    }
  }, [socket, quill, documentId]);

  useEffect(() => {
    if (!socket || !quill) return;
    const interval = setInterval(() => {
      socket.emit('save-document', quill.getContents());
    }, SAVE_INTERVAL_MS);
    return () => {
      clearInterval(interval);
    }
  }, [socket, quill]);


  // Handle local text changes and broadcast them->> quill to socket
  useEffect(() => {
    if (socket == null || quill == null) return;

    const handleTextChange = (delta, oldDelta, source) => {
      if (source !== 'user') return;
      socket.emit('send-changes', delta);
    };

    quill.on('text-change', handleTextChange);

    return () => {
      quill.off('text-change', handleTextChange);
    };
  }, [socket, quill]);

  // Handle receiving remote text changes ->> socket to quill
  useEffect(() => {
    if (socket == null || quill == null) return;

    const handleReceiveChange = (delta) => {
      quill.updateContents(delta);
    };

    socket.on('receive-changes', handleReceiveChange);

    return () => {
      socket.off('receive-changes', handleReceiveChange);
    };
  }, [socket, quill]);

  const wrapperRef = useCallback((wrapper) => {
    if (wrapper == null) return;
    wrapper.innerHTML = '';
    const editor = document.createElement('div');
    wrapper.append(editor);
    const q = new Quill(editor, { theme: 'snow', modules: { toolbar: TOOLBAR_OPTIONS } });
    q.disable();
    q.setText('Loading...');
    setQuill(q);
  }, []);

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          <button className="btn btn-secondary me-2" onClick={() => navigate("/")}>{username}</button>
          <div className="d-flex justify-content-center flex-grow-1">
            <span className="fw-bold">{docName}</span>
          </div>
          <div className="d-flex align-items-center ms-auto">
            <button className="btn btn-secondary me-2" onClick={handleSaveDoc}>Save</button>
            <button className="btn btn-secondary" onClick={handleShare}>Share</button>
          </div>
        </div>
      </nav>
      <div className="container mt-3" ref={wrapperRef}></div>
    </div>
  );
};