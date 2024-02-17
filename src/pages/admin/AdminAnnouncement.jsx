import Notice from "../../components/Notice";
import { ArrowLeftIcon, PlusIcon } from "@heroicons/react/24/outline";
import { Modal, Spinner } from "flowbite-react";
import { useState, useEffect, useRef } from "react";
import "../../revert.css";
import { Editor } from "@tinymce/tinymce-react";
import { customButtonTheme } from "../../themes/flowbiteThemes";
import { Button, Flowbite } from "flowbite-react";

import axios from "axios";
import { useNavigate } from "react-router-dom";

function stripTags(html) {
  return html.replace(/<\/?[^>]+(>|$)/g, "");
}

const addAnnoucementPage = (
  openModal,
  setOpenModal,
  setAddAnnouncement,
  descNotice,
  setDescNotice,
  document,
  setDocument,
  setMsg,
  navigate,
  judul, setjudul,
  date, setdate, editorRef
) => {
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('descNotice', descNotice);
    formData.append('document', document);
    formData.append('judul', judul);
    formData.append('date', date);

    try {
      const response = await axios.post('http://localhost:8080/admin/pengumuman', formData);

      console.log(response.data);

      if (response.data.Status === 'Success') {
        navigate('/pengumuman');
        setMsg('File Successfully Uploaded');
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
    <main className="h-screen overflow-auto px-24 py-6 font-poppins">
      <div className="focus-visible:border-none">
         <Modal
          dismissible
          show={openModal}
          onClose={() => setOpenModal(false)}
          size="md"
        >
          <Modal.Body>
            <div className="px-8 py-2 font-poppins">
              <p className="mb-6 text-center text-xl">
                Apakah anda yakin mengisi dengan benar?
              </p>
              <div className="flex items-center justify-center gap-8">
                <button className="bg-semi-green h-full w-full rounded-lg px-8 py-4 text-white"
                  type="submit"
                  onClick={(e)=>
                    {
                      setOpenModal(false)
                      handleSubmit(e)
                    }}>
                  Simpan
                </button>
                <button
                  className="h-full w-full rounded-lg border border-solid border-black px-8 py-4"
                  onClick={(e)=>
                    {
                      setOpenModal(false)
                    }}
                >
                  Batal
                </button>
              </div>
            </div>
          </Modal.Body>
        </Modal>
      </div>

      <div className="flex flex-col gap-8">
        <div className="text-gray-blue">
          <button
            className="flex items-center gap-2 text-gray-600 hover:cursor-pointer"
            onClick={() => setAddAnnouncement(false)}
          >
            <ArrowLeftIcon className="h-6 w-6" /> Kembali
          </button>
        </div>

        <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-4">
              <label htmlFor="judulBerita" className="text-2xl font-medium">
                Judul Pengumuman
              </label>
              <input
                type="text"
                name="judul"
                onChange={(e) => setjudul(e.target.value)}
                id="news title"
                className="rounded-lg border border-solid border-gray-500"
              />
          </div>
          <div className="flex flex-col gap-4">
              <label htmlFor="date" className="text-2xl font-medium">
                Waktu Berita
              </label>
              <input
                type="date"
                name="date"
                onChange={(e) => setdate(e.target.value)}
                id="date"
                className="rounded-lg border border-solid border-gray-500"
              />
            </div>
          <div className="flex flex-col gap-4">
            <label
              className="text-2xl font-medium"
              htmlFor="announcement content"
            >
              Isi Pengumuman
            </label>
            <Editor
              name="descNotice"
              onInit={(evt, editor) => (editorRef.current = editor)}
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
              value={descNotice}
              onEditorChange={setDescNotice}
            />
          </div>

          <div className="flex flex-col gap-4">
            <p className="text-2xl font-medium">Unggah Dokumen</p>
            <label className="mb-8 flex h-16 w-64 items-center justify-center gap-2 rounded bg-[#d9d9d9] text-lg text-[#7f7f7f] hover:cursor-pointer">
              <input
                type="file"
                className="hidden"
                onChange={(e) => setDocument(e.target.files[0])} />
              <PlusIcon className="h-8 w-8" /> Pilih Dokumen
            </label>

            <Flowbite theme={{ theme: customButtonTheme }}>
              <Button
                color="border-semi-green"
                size="lg"
                onClick={(e) => {
                  e.preventDefault();
                  setOpenModal(true);
                }}
              >
                Simpan
              </Button>
            </Flowbite>
          </div>
        </form>
      </div>
    </main>
  );
};

const AdminAnnouncement = () => {
  const [addAnnoucement, setAddAnnouncement] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [descNotice, setDescNotice] = useState('');
  const [document, setDocument] = useState('');
  const [judul, setjudul] = useState('');
  const [date, setdate] = useState('');
  const [msg, setMsg] = useState('');
  const editorRef = useRef(null);

  const navigate = useNavigate();

  const [notice, setNotice] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const noticeResponse = await axios.get("http://localhost:8080/pengumuman/:id");
        setNotice(noticeResponse.data);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    fetchData();
  }, []);

  if (notice.isLoading)
    return (
      <main className="flex h-screen items-center justify-center">
        <div>
          <Spinner size="xl" />
        </div>
      </main>
    );

  if (addAnnoucement) {
    return addAnnoucementPage(
      openModal,
      setOpenModal,
      setAddAnnouncement,
      descNotice,
      setDescNotice,
      document,
      setDocument,
      setMsg,
      navigate,
      judul, setjudul,
      date, setdate, editorRef
    );
  }

  return (
    <main className="h-screen overflow-auto px-24 py-6 font-poppins">
      <p className="mb-8 block text-4xl font-semibold">Halaman Pengumuman</p>

      <div
        className="flex h-40 w-full items-center justify-center gap-4 rounded-xl border border-solid border-gray-500 text-3xl text-blue-800 hover:cursor-pointer"
        onClick={() => setAddAnnouncement(true)}
      >
        <PlusIcon className="h-16 w-16" /> Tambahkan Pengumuman
      </div>

      <div className="divide-y divide-solid divide-gray-400">
        {notice.map((a, id) => (
          <div key={id}>
            <Notice
              title={a.judul}
              date={a.date}
              subtitle={stripTags(a.descNotice)}
            />
          </div>
        ))}
      </div>
    </main>
  );
};

export default AdminAnnouncement;
