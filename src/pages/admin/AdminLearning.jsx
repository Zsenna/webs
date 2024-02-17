import { Button, Flowbite } from "flowbite-react";
import { customButtonTheme } from "../../themes/flowbiteThemes";
import { Editor } from "@tinymce/tinymce-react";
import { useState, useEffect
 } from "react";

import axios from "axios";
import { useNavigate } from "react-router-dom";

function stripTags(html) {
  return html.replace(/<\/?[^>]+(>|$)/g, "");
}

const AdminLearning = () => {
  const [intrakrikuler, setintrakrikuler] = useState('');
  const [kokurikuler, setkokurikuler] = useState('');
  const [ekstrakurikuler, setekstrakurikuler] = useState('');
  const [msg, setMsg] = useState('');
  const [selectedProkerId, setselectedProkerId] = useState(null); 

  const navigate = useNavigate();

  const [proker, setproker] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const prokerResponse = await axios.get("http://localhost:8080/organisasi");
        setproker(prokerResponse.data);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    fetchData();
  }, []);

  const handleEditProker = (selectedProker) => {
    setselectedProkerId(selectedProker.ID);
    setintrakrikuler(selectedProker.intrakrikuler);
    setkokurikuler(selectedProker.kokurikuler);
    setekstrakurikuler(selectedProker.ekstrakurikuler);
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('intrakrikuler', intrakrikuler);
    formData.append('kokurikuler', kokurikuler);
    formData.append('ekstrakurikuler', ekstrakurikuler);

    try {
      let response;

      if (selectedProkerId) {
        response = await axios.put(`http://localhost:8080/admin/organisasi/${selectedProkerId}`, formData);
      } else {
        response = await axios.post('http://localhost:8080/admin/organisasi', formData);
      }

      if (response.data.Status === 'Success') {
        setMsg('File Successfully Uploaded');
        setintrakrikuler('');
        setkokurikuler('');
        setekstrakurikuler('');
        setselectedProkerId(null);
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
          <p className="mb-6 block text-4xl font-semibold">
            Halaman Program Kerja
          </p>
          <p className="mb-4 block font-semibold" htmlFor="rabuceria">
            Perorganisasian Pembelajaran
          </p>
          <article className="leading-6 mb-5">
            {
              proker.map(prokerItem => (
                <div
                  key={prokerItem.ID}
                  onClick={() => handleEditProker(prokerItem)}>
                    {stripTags(prokerItem.intrakrikuler)}
                </div>
                )
              )
            }
          </article>
          <div className="mb-6">
            <Editor
              textareaName="organisasi"
              apiKey="o0pzftir0e6adwmb92z8ig9705xxtb5i7kurqh1a3j7q41qe"
              init={{
                plugins:
                  "anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount",
                toolbar:
                  "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat",
                resize: false,
                height: "500",
              }}
              value={intrakrikuler}
              onEditorChange={setintrakrikuler}
            />
          </div>

          <article className="leading-6 mb-5">
            {
              proker.map(prokerItem => (
                <div
                  key={prokerItem.ID}
                  onClick={() => handleEditProker(prokerItem)}>
                    {stripTags(prokerItem.kokurikuler)}
                </div>
                )
              )
            }
          </article>
          <div className="mb-6">
            <Editor
              textareaName="organisasi"
              apiKey="o0pzftir0e6adwmb92z8ig9705xxtb5i7kurqh1a3j7q41qe"
              init={{
                plugins:
                  "anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount",
                toolbar:
                  "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat",
                resize: false,
                height: "500",
              }}
              value={kokurikuler}
              onEditorChange={setkokurikuler}
            />
          </div>

          <article className="leading-6 mb-5">
            {
              proker.map(prokerItem => (
                <div
                  key={prokerItem.ID}
                  onClick={() => handleEditProker(prokerItem)}>
                    {stripTags(prokerItem.ekstrakurikuler)}
                </div>
                )
              )
            }
          </article>
          <div className="mb-6">
            <Editor
              textareaName="organisasi"
              apiKey="o0pzftir0e6adwmb92z8ig9705xxtb5i7kurqh1a3j7q41qe"
              init={{
                plugins:
                  "anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount",
                toolbar:
                  "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat",
                resize: false,
                height: "500",
              }}
              value={ekstrakurikuler}
              onEditorChange={setekstrakurikuler}
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

export default AdminLearning;


