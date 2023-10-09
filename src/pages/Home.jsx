import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Context } from "../context/Context";

function Home() {
  const { user, isFetching, error, dispatch } = useContext(Context);
  const [uploads, setUploads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [btnLoading, setBtnLoading] = useState(false);
  const handleFileChange = (e) => {
    setFile(e.target.files);
  };

  const handleUpload = async () => {
    setBtnLoading(true);
    if (!file) {
      setBtnLoading(false);
      return;
    }
    try {
      const res = await axios.post(
        "https://attractive-worm-hosiery.cyclic.app/api/upload/upload",
        { image: file[0] },
        {
          headers: {
            authorization: `Bearer ${authToken}`,
            "Content-Type": `multipart/form-data`,
          },
        }
      );

      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchUploads();
  }, []); // Trigger fetchUploads when the page changes

  const storedUserData = localStorage.getItem("user");
  const parsedUserData = JSON.parse(storedUserData);
  const authToken = parsedUserData?.accessToken;
  const headers = {
    authorization: `Bearer ${authToken}`,
    "Content-Type": "application/json",
  };
  const fetchUploads = async () => {
    setLoading(true);

    try {
      const response = await axios.get(
        `https://attractive-worm-hosiery.cyclic.app/api/upload/uploads`,
        {
          headers: headers,
        }
      );

      console.log(response.data.uploads);
      setUploads(response.data.uploads);
    } catch (error) {
      console.error("Error fetching uploads:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (secretUrl) => {
    // Implement download logic using axios or any other method
    const imageUrl = secretUrl;

    fetch(imageUrl)
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "image.jpg"; // You can set the filename here
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      })
      .catch((error) => console.error("Error downloading image:", error));
  };

  const handleDelete = async (uploadId) => {
    try {
      const res = await axios.delete(
        `https://attractive-worm-hosiery.cyclic.app/api/upload/remove/${uploadId}`,
        { headers: headers }
      );
      if (res.status == 204) {
        window.location.reload();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogout = async (e) => {
    try {
      const res = await axios.post(
        "https://attractive-worm-hosiery.cyclic.app/api/auth/logout",
        {},
        {
          headers: headers,
        }
      );

      localStorage.removeItem("user");
      console.log(res);
      dispatch({ type: "LOGOUT" });
    } catch (error) {
      console.log(error);
    }
    window.location.href = "/login";
  };

  return (
    <div
      className="main"
      style={{
        display: "flex",
        justifyContent: "space-around",
        marginTop: "20px",
      }}
    >
      <div>
        <h1>My Uploads</h1>
        <ol>
          {uploads.map((upload) => (
            <li
              key={upload.id}
              style={{ textDecoration: "none", marginTop: "20px" }}
            >
              <a href={`${upload.secretUrl}`} target="_n">
                {upload.secretUrl}
              </a>
              <button
                onClick={() => handleDownload(upload.secretUrl)}
                className="btn btn-primary"
                style={{ marginLeft: "20px" }}
              >
                Download
              </button>
              <button
                onClick={() => handleDelete(upload._id)}
                className="btn btn-danger"
                style={{ marginLeft: "20px" }}
              >
                Delete
              </button>
            </li>
          ))}
        </ol>
        {loading && <p>Loading...</p>}
      </div>
      <div className="rightCorner">
        <button onClick={handleLogout} className="btn btn-danger">
          Logout
        </button>

        <button
          type="button"
          data-bs-toggle="modal"
          data-bs-target="#exampleModal"
          className="btn btn-primary"
          style={{ marginLeft: "20px" }}
        >
          New Upload
        </button>

        <div
          className="modal fade"
          id="exampleModal"
          tabIndex="-1"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">
                  New Upload
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>

              <div
                className="content"
                style={{
                  marginLeft: "20px",
                  padding: "30px",
                  marginBottom: "30px",
                }}
              >
                <input type="file" onChange={handleFileChange} />
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-danger"
                  data-bs-dismiss="modal"
                >
                  Close
                </button>
                <button
                  type="button"
                  className="btn btn-success"
                  onClick={handleUpload}
                >
                  {btnLoading ? (
                    <div class="spinner-border" role="status">
                      <span class="sr-only"></span>
                    </div>
                  ) : (
                    "Save changes"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
