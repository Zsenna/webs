import { Button, Flowbite } from "flowbite-react";
import { customButtonTheme } from "../../themes/flowbiteThemes";
import { Editor } from "@tinymce/tinymce-react";
import { useState } from "react";

import axios from "axios";
import { useNavigate } from "react-router-dom";

const AdminActivities = () => {
  const [kegiatan, setKegiatan] = useState('');
  const [msg, setMsg] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('kegiatan', kegiatan);

    try {
      const response = await axios.post('http://localhost:8080/admin/kegiatan', formData);

      console.log(response.data);

      if (response.data.Status === 'Success') {
        navigate('/organisasi');
        setMsg('File Successfully Uploaded');
      } else {
        setMsg('Error');
      }
    } catch (error) {
      console.error('Error submitting data:', error);
      setMsg('Error' + error.message);
    }
  };
  return (
    <main className="h-screen p-12 font-poppins">
      <form onSubmit={handleSubmit}>
        <div className="h-full">
          <h1 className="mb-8 block text-4xl font-semibold">Halaman Kegiatan</h1>
          <div className="mb-6">
            <Editor
              textareaName="kegiatan"
              apiKey="o0pzftir0e6adwmb92z8ig9705xxtb5i7kurqh1a3j7q41qe"
              init={{
                plugins:
                  "anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount",
                toolbar:
                  "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat",
                resize: false,
                height: "500",
              }}
              onEditorChange={setKegiatan}
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

export default AdminActivities;
