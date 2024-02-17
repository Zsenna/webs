import { Button, Flowbite } from "flowbite-react";
import { customButtonTheme } from "../../themes/flowbiteThemes";
import { Editor } from "@tinymce/tinymce-react";
import { useState, useEffect, useRef } from "react";
import "../../revert.css";


import axios from "axios";
import { useNavigate } from "react-router-dom";

const AdminDimensions = () => {
  const [isiDikmensi, setIsiDikmensi] = useState('');
  const [msg, setMsg] = useState('');
  const [selectedDikmensiId, setSelectedDikmensiId] = useState(null);
  const editorRef = useRef(null);

  const navigate = useNavigate();

  const [dikmensi, setDikmensi] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const dikmensiResponse = await axios.get("http://localhost:8080/dikmensi");
        setDikmensi(dikmensiResponse.data);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    fetchData();
  }, []);

  const handleEditDikmensi = (selectedDikmesi) => {
    setSelectedDikmensiId(selectedDikmesi.ID);
    setIsiDikmensi(selectedDikmesi.isiDikmensi);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('isiDikmensi', isiDikmensi);

    try {
      let response;

      if (selectedDikmensiId) {
        response = await axios.put(`http://localhost:8080/admin/dikmensi/${selectedDikmensiId}`, formData);
      } else {
        response = await axios.post('http://localhost:8080/admin/dikmensi', formData);
      }

      if (response.data.Status === 'Success') {
        navigate('/admin/dikmensi');
        setMsg('File Successfully Uploaded');
        setIsiDikmensi('');
        setSelectedDikmensiId(null);
      } else {
        setMsg('Error');
      }
      window.location.reload();
    } catch (error) {
      console.error('Error submitting data:', error);
      setMsg('Error' + error.message);
    }
  };
  return (
    <main className="h-screen p-12 font-poppins">
      <form onSubmit={handleSubmit}>
        <div className="h-full">
          <h1 className="mb-8 block text-4xl font-semibold" htmlFor="rabuceria">
            Halaman Dikmensi
          </h1>
          <article className="leading-6 mb-5">
            {
              dikmensi.map(dikmensiItem => (
                <div style={{ width: '100%', overflowX: 'auto' }}
                    key={dikmensiItem.ID}
                    onClick={() => handleEditDikmensi(dikmensiItem)}>
                    <div
                      className="our-app-wrapper block break-all !font-poppins"
                      dangerouslySetInnerHTML={{ __html: dikmensiItem.isiDikmensi }}
                    ></div>
                  </div>
                )
              )
            }
          </article>
          <div className="mb-6">
            <Editor
              value={isiDikmensi}
              onInit={(evt, editor) => (editorRef.current = editor)}
              textareaName="isiDikmensi"
              apiKey="o0pzftir0e6adwmb92z8ig9705xxtb5i7kurqh1a3j7q41qe"
              init={{
              height: 500,
              plugins:
                "anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount",
              toolbar:
                "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat",
              content_style:
                "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
              }}
              onEditorChange={setIsiDikmensi}
            />
          </div>

          <div className="flex">
            <div className="ml-auto">
              <Flowbite theme={{ theme: customButtonTheme }}>
                <Button color="border-semi-green-fixedWidth" size="lg" type="submit">
                  Simpan
                </Button>
              </Flowbite>
            </div>
          </div>
        </div>
      </form>
      
    </main>
  );
};

export default AdminDimensions;
