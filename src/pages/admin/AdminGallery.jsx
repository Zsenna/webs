import { Button, Flowbite, Spinner } from "flowbite-react";
import { customButtonTheme } from "../../themes/flowbiteThemes";
import { PlusIcon } from "@heroicons/react/24/outline";
import { useState, useEffect } from "react";
import Box from "../../components/PhotoBox";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AdminGallery = () => {
  const [judulGal, setJudulGal] = useState('');
  const [docGal, setDocGal] = useState('');
  const [selectedGalerisId, setSelectedGalerisId] = useState(null);
  const [msg, setMsg] = useState('');

  const navigate = useNavigate();

  const [galeri, setGaleri] = useState([]);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const ekskulResponse = await axios.get("http://localhost:8080/galeri");
        setGaleri(ekskulResponse.data);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    fetchData();
  }, []);

  const handleEditGaleri = (selectedGaleri) => {
    setSelectedGalerisId(selectedGaleri.ID);
    setDocGal(selectedGaleri.docGal);
    setJudulGal(selectedGaleri.judulGal);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('judulGal', judulGal);
    formData.append('docGal', docGal);

    try {
      let response;

      if (selectedGalerisId) {
        response = await axios.put(`http://localhost:8080/admin/galeri/${selectedGalerisId}`, formData);
      } else {
        response = await axios.post('http://localhost:8080/admin/galeri', formData);
      }

      if (response.data.Status === 'Success') {
        navigate('/admin/galeri');
        setMsg('File Successfully Uploaded');
        setDocGal('');
        setJudulGal('');
        setSelectedGalerisId(null);
      } else {
        setMsg('Error');
      }
      window.location.reload();
    } catch (error) {
      console.error('Error submitting data:', error);
      setMsg('Error' + error.message);
    }
  };

  if (galeri.isLoading)
    return (
      <main className="flex h-screen items-center justify-center">
        <div>
          <Spinner size="xl" />
        </div>
      </main>
    );
  
  return (
    <main className="h-screen p-12 font-poppins">
      <div className="h-full">
        <h1 className="mb-8 block text-4xl font-semibold">Halaman Galeri</h1>

        <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-2">
            <label
              htmlFor="gallery title" 
              className="text-2xl font-medium">
              Judul Berita
            </label>
            <input
              type="text"
              name="judulGal"
              value={judulGal}
              onChange={(e) => setJudulGal(e.target.value)}
              id="gallery title"
              className="rounded-lg border border-solid border-gray-500"
            />
          </div>

           <div className="mx my-12 max-w-7xl px-4 lg:px-6">
            <div className="grid grid-cols-1 content-between gap-y-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {galeri.map((g, id) => (
                <div
                  onClick={() => handleEditGaleri(g)}
                  key={id}
                  className="flex flex-col items-center gap-4"
                >
                  <Box styles="h-64 w-64 overflow-hidden">
                    <img src={`http://localhost:8080/${g.docGal}`}
                      alt="" />
                  </Box>
                  <p className="text-xl font-medium">{g.judulGal}</p>
                </div>
              ))}
            </div>
          </div>

          <label className="mb-8 flex h-16 w-64 items-center justify-center gap-2 rounded bg-[#d9d9d9] text-lg text-[#7f7f7f] hover:cursor-pointer">
            <input
              type="file"
              name="docGal"
              className="hidden"
              onChange={(e) => setDocGal(e.target.files[0])}/>
            <PlusIcon className="h-8 w-8" /> Pilih Dokumen
          </label>

          <div className="ml-auto">
            <Flowbite theme={{ theme: customButtonTheme }}>
              <Button
                color="border-semi-green-fixedWidth"
                size="lg"
                type="submit"
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

export default AdminGallery;
