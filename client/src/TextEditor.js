import React, { useCallback, useEffect, useState } from 'react'
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import './styles.css';
import { io } from 'socket.io-client';
import { useParams } from 'react-router-dom';
import { useAuth } from './authContext';

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

  const [socket, setSocket] = useState()
  const [quill, setQuill] = useState();
  const { id: documentId } = useParams();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;
    const s = io("http://localhost:3001", {
      auth: {
        token: user.token
      }
    });
    setSocket(s);

    return () => {
      s.disconnect();
    }
  }, [user]);

  useEffect(() => {
    if (socket == null || quill == null) return;

    socket.once('load-document', document => {
      quill.setContents(document)
      quill.enable()
    });
    socket.emit('get-document', documentId);

  }, [socket, quill, documentId]);

  useEffect(() => {
    if (socket == null || quill == null) return;
    const interval = setInterval(() => {
      socket.emit('save-document', quill.getContents())
    }, SAVE_INTERVAL_MS)

    return () => {
      clearInterval(interval);
    }
  }, [socket, quill]);

  useEffect(() => {
    if (socket == null || quill == null) return;
    const textChangeHandler = (delta, oldDelta, source) => {
      if (source !== 'user') return;
      socket.emit("send-changes", delta);
    };

    quill.on('text-change', textChangeHandler);

    return () => {
      quill.off('text-change', textChangeHandler);
    }
  }, [socket, quill]);

  useEffect(() => {
    if (socket == null || quill == null) return;
    const receiveChangeHandler = (changes) => {
      quill.updateContents(changes);
    }

    socket.on('receive-changes', receiveChangeHandler);

    return () => {
      socket.off("receive-changes", receiveChangeHandler);
    }
  }, [socket, quill]);

  const wrapperRef = useCallback((wrapper) => {
    if (wrapper == null) return;
    wrapper.innerHTML = '';
    const editor = document.createElement('div');
    wrapper.append(editor);
    const q = new Quill(editor, { theme: "snow", modules: { toolbar: TOOLBAR_OPTIONS } });

    q.disable()
    q.setText('Loading...');
    setQuill(q);
  }, []);
  return (
    <div className="container" ref={wrapperRef}></div>
  )
};