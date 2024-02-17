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

const addNewsPage = (
  openModal,
  setOpenModal,
  setAddNews,
  sampul, setSampul,
  judulBerita, setJudulBerita,
  isiBerita, setIsiBerita,
  date, setDate,
  msg, setMsg,
  navigate,
  editorRef
) => {
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('sampul', sampul);
    formData.append('judulBerita', judulBerita);
    formData.append('isiBerita', isiBerita);
    formData.append('date', date);

    try {
      const response = await axios.post('http://localhost:8080/admin/berita', formData);

      console.log(response.data);

      if (response.data.Status === 'Success') {
        navigate('/berita');
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
            onClick={() => setAddNews(false)}
          >
            <ArrowLeftIcon className="h-6 w-6" /> Kembali
          </button>
        </div>

        <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-4">
            <p className="text-2xl font-medium">Gambar Sampul</p>
            <label className="flex h-40 w-full items-center justify-center gap-4 rounded-xl border border-solid border-gray-500 text-3xl text-blue-800 hover:cursor-pointer">
              <input
                type="file"
                name="sampul"
                onChange={(e) => setSampul(e.target.files[0])}
                accept="image/png, image/jpeg"
                className="hidden"
              />
              <PlusIcon className="h-16 w-16" /> Tambahkan Gambar Sampul
            </label>
          </div>
          <div className="flex flex-col gap-4">
            <label htmlFor="judulBerita" className="text-2xl font-medium">
              Judul Berita
            </label>
            <input
              type="text"
              name="judulBerita"
              value={judulBerita}
              onChange={(e) => setJudulBerita(e.target.value)}
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
              value={date}
              onChange={(e) => setDate(e.target.value)}
              id="date"
              className="rounded-lg border border-solid border-gray-500"
            />
            </div>
          <div className="flex flex-col gap-4">
            <label
              className="text-2xl font-medium"
              htmlFor="announcement content"
            >
              Isi Berita
            </label>
            <Editor
              value={isiBerita}
              onInit={(evt, editor) => (editorRef.current = editor)}
              name="isiBerita"
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
              onEditorChange={setIsiBerita}
            />
          </div>

          <div className="flex flex-col gap-4">
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
  const [openModal, setOpenModal] = useState(false);
  const [sampul, setSampul] = useState('');
  const [judulBerita, setJudulBerita] = useState('');
  const [isiBerita, setIsiBerita] = useState('');
  const [date, setDate] = useState('');
  const [msg, setMsg] = useState('');
  const [addNews, setAddNews] = useState(false); 
  const navigate = useNavigate();
  const editorRef = useRef(null);

  const [news, setNews] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const newsResponse = await axios.get("http://localhost:8080/berita/:id");
        setNews(newsResponse.data);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    fetchData();
  }, []);

  if (news.isLoading)
    return (
      <main className="flex h-screen items-center justify-center">
        <div>
          <Spinner size="xl" />
        </div>
      </main>
    );

  if (addNews) {
    return addNewsPage(
      openModal,
      setOpenModal,
      setAddNews,
      sampul, setSampul,
      judulBerita, setJudulBerita,
      isiBerita, setIsiBerita,
      date, setDate,
      msg, setMsg,
      navigate,
      editorRef
    );
  }

  return (
    <main className="h-screen overflow-auto px-24 py-6 font-poppins">
      <p className="mb-8 block text-4xl font-semibold">Halaman Berita</p>

      <div
        className="flex h-40 w-full items-center justify-center gap-4 rounded-xl border border-solid border-gray-500 text-3xl text-blue-800 hover:cursor-pointer"
        onClick={() => setAddNews(true)}
      >
        <PlusIcon className="h-16 w-16" /> Tambahkan Berita
      </div>

      <div className="divide-y divide-solid divide-gray-400">
        {news.map((n) => (
          <div
            key={n.ID}
            className="relative h-48 w-full overflow-hidden rounded-xl mt-5"
          >
            <img
              className="h-full w-full object-cover"
              src={`http://localhost:8080/${n.sampul}`}
              alt=""
            />
            <p className="absolute bottom-5 left-5 text-3xl font-bold text-white">
              {n.judulBerita}
            </p>
          </div>
        ))}
      </div>
    </main>
  );
};

export default AdminAnnouncement;
