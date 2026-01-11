import './App.css';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  signInWithPopup,
} from "firebase/auth";

import {auth, googleProvider} from './firebaseConfig';
import { useState } from 'react';

function App() {
  // This will hold the user information
  const [user, setUser] = useState(null);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");

  // This will hold the uploaded image URL
  const [uploadedImageURL, setUploadedImageURL] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        loginEmail,
        loginPassword
      );
      setUser(userCredential.user);
      console.log(userCredential.user);
    } catch (error) {
      console.error("Error logging in:", error);
    }
  }

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        signUpEmail,
        signUpPassword
      );
      setUser(userCredential.user);
      console.log(userCredential.user);
    } catch (error) {
      console.error("Error signing up:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const handleGoogleSignIn = async () => {
    // Implement Google Sign-In logic here
    try {
      const userCredential = await signInWithPopup(auth, googleProvider);
      setUser(userCredential.user);
      console.log(userCredential.user);
    } catch (error) {
      console.log("Error with Google Sign-In:", error);
    }
  }

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    // create a local preview URL
    setUploadedImageURL(URL.createObjectURL(file));
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert('Please choose a file first');
      return;
    }
    // Placeholder: in a real app upload to Firebase Storage and set the download URL
    alert(`Pretending to upload "${selectedFile.name}" — preview shown below.`);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Firebase Authentication & File Upload Demo</h1>
        {/* Check if the user exists (is logged in) to show the login or welcome screen */}
        {!user ? (
          <>
            <form onSubmit={handleLogin}>
              <h3>Login</h3>
              <input
                type="email"
                placeholder="Email"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
              />
              <input
                type="password"
                placeholder="Password"
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
              />
              <button type="submit">Login</button>
            </form>

            <form onSubmit={handleSignup}>
              <h3>Sign Up</h3>
              <input
                type="email"
                placeholder="Email"
                required
                value={signUpEmail}
                onChange={(e) => setSignUpEmail(e.target.value)}
              />
              <input
                type="password"
                placeholder="Password"
                required
                value={signUpPassword}
                onChange={(e) => setSignUpPassword(e.target.value)}
              />
              <button type="submit">Sign Up</button>
            </form>

            <button onClick={handleGoogleSignIn}>Sign Up with Google</button>
          </>
        ) : (
          <div>
            <p>Welcome, {user?.displayName || user?.email}</p>
            <button onClick={handleLogout}>Sign Out</button>

            {/* Image upload section */}
            <h3>Upload an Image</h3>
            <input type="file" accept="image/*" onChange={handleFileChange} />
            <button onClick={handleUpload}>Upload</button>

            {/* Display uploaded image if there is one*/}
            {uploadedImageURL && (
              <div>
                <h4>Uploaded Image:</h4>
                <img
                  src={uploadedImageURL}
                  alt="Uploaded"
                  style={{ width: "300px", height: "auto" }}
                />
              </div>
            )}
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
