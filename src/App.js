import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [file, setFile] = useState(null);
  const [allFile, setAllFile] = useState(null);
  const [currentRoute, setCurrentRoute] = useState("get-file");
  const [uploadSuccess, setUploadSuccess] = useState(false);

  useEffect(() => {
    if (currentRoute === "get-file") {
      getFile();
    }
  }, [currentRoute]);


  const submitFile = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    //const upload = multer({ storage: storage });
    //app.post("/upload-file", upload.single("file"), async (req, res) => {
    ////@devnotes:: The string value in ------> formData.append("key",value) should be same as in ----> upload.single("key") in multer file
    formData.append("file", file);

    try {
      await axios.post("http://localhost:5000/upload-file", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Set the upload success message
      setUploadSuccess(true);

      // Reset the file input
      setFile(null);
    } catch (error) {
      // Handle any error that occurs during the upload process
      console.error("File upload failed:", error);
    }
  };


  const onInputChange = (e) => {
    setFile(e.target.files[0]);
  };


  const getFile = async () => {
    const result = await axios.get("http://localhost:5000/get-file");
    setAllFile(result.data.data);
  };


  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>File Management</h1>
      <div>
        <button onClick={() => setCurrentRoute("get-file")}>Show Files</button>
        <button onClick={() => setCurrentRoute("upload-file")}>Upload File</button>
      </div>
      {currentRoute === "get-file" && (
        <div>
          {allFile == null
            ? ""
            : allFile.map((data) => {
                return data.file ? (
                  <div key={data.file} style={{ margin: "10px" }}>
                    <a
                      href={`./files/${data.file}`}          //@devnotes:: Refered to files inside  src/files folder
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ textDecoration: "none", color: "#007bff" }}
                    >
                      {data.file}
                    </a>
                  </div>
                ) : null;
              })}
        </div>
      )}
      {currentRoute === "upload-file" && (
        <div>
          <form onSubmit={submitFile} style={{ marginBottom: "20px" }}>
            <input type="file" onChange={onInputChange} style={{ marginBottom: "10px" }} />
            <br />
            <button
              type="submit"
              style={{
                backgroundColor: "#007bff",
                color: "#fff",
                padding: "10px 20px",
                border: "none",
                borderRadius: "5px",
              }}
            >
              Upload File
            </button>
          </form>
          {uploadSuccess && <p>File uploaded successfully!</p>}
        </div>
      )}
    </div>
  );
}

export default App;
