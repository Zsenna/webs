import PhotoBox from "../../components/PhotoBox";
import NewsCard from "../../components/NewsCard";
import Notice from "../../components/Notice";

import { Button, Flowbite, Spinner } from "flowbite-react";
import { customButtonTheme } from "../../themes/flowbiteThemes";
import { Carousel, IconButton } from "@material-tailwind/react";
import { PlusIcon, ChevronLeftIcon, ChevronRightIcon} from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import { useState, useEffect} from "react";

import axios from "axios";
import { useNavigate } from "react-router-dom";

function stripTags(html) {
  return html.replace(/<\/?[^>]+(>|$)/g, "");
}

const AdminHome = () => {
  const [bHeadImg, setbHeadImg] = useState('');
  const [kImg, setKimg] = useState('');
  const [description, setDescription] = useState('');
  const [previewKImg, setPreviewKImg] = useState('');
  const [msg, setMsg] = useState('');

  const navigate = useNavigate();

  const [home, setHome] = useState([])
  const [news, setNews] = useState([])
  const [notice, setNotice] = useState([])
  const [guru, setGuru] = useState([])

  const [selectedHomeId, setSelectedHomeId] = useState(null); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const homeResponse = await axios.get("http://localhost:8080");
        setHome(homeResponse.data);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    fetchData();
    
    
    axios.get('http://localhost:8080/berita/:id')
      .then(res => setNews(res.data))
      .catch(err => console.log(err));
    
    axios.get('http://localhost:8080/pengumuman/:id')
      .then(res => setNotice(res.data))
      .catch(err => console.log(err));
    
    axios.get('http://localhost:8080/guru/')
      .then(res => setGuru(res.data))
      .catch(err => console.log(err));
  }, []);

  const handleEditHome = (selectedHomeItem) => {
    setSelectedHomeId(selectedHomeItem.ID);
    setKimg(selectedHomeItem.kImg);
    setDescription(selectedHomeItem.description);
    setbHeadImg(selectedHomeItem.bHeadImg);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('bHeadImg', bHeadImg);
    formData.append('kImg', kImg);
    formData.append('description', description);

    try {
      let response;

      if (selectedHomeId) {
        response = await axios.put(`http://localhost:8080/admin/beranda/${selectedHomeId}`, formData);
      } else {
        response = await axios.post('http://localhost:8080/admin/beranda', formData);
      }

      if (response.data.Status === 'Success') {
        navigate('/admin/beranda');
        setMsg('File Successfully Uploaded');
        setKimg('');
        setDescription('');
        setbHeadImg('');
        setSelectedHomeId(null);
      } else {
        setMsg('Error');
      }
      window.location.reload();
    } catch (error) {
      console.error('Error submitting data:', error);
      setMsg('Error' + error.message);
    }
  };

  const handlePreviewKImg = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      setPreviewKImg(reader.result);
      setKimg(file);
    };

    if (file) {
      reader.readAsDataURL(file);
    } else {
      setPreviewKImg('');
    }
  };

  if (notice.isLoading || news.isLoading || home.isLoading)
    return (
      <main className="flex h-screen items-center justify-center">
        <div>
          <Spinner size="xl" />
        </div>
      </main>
    );
  
  return (
    <main className="p-6 font-poppins">
      <form onSubmit={handleSubmit}>
         <div>
          <h1 className="mb-8 block text-4xl font-semibold">Halaman Beranda</h1>
          <Carousel
            className="h-[153px] overflow-hidden md:h-[306px] lg:h-[408px] xl:h-[612px]"
            prevArrow={({ handlePrev }) => (
              <IconButton
                variant="text"
                color="white"
                size="lg"
                onClick={handlePrev}
                className="!absolute left-4 top-2/4 -translate-y-2/4 rounded-full border-2 border-solid border-white bg-gray-100/5"
              >
                <ChevronLeftIcon className="h-8 w-8" />
              </IconButton>
            )}
            nextArrow={({ handleNext }) => (
              <IconButton
                variant="text"
                color="white"
                size="lg"
                onClick={handleNext}
                className="!absolute !right-4 top-2/4 -translate-y-2/4 rounded-full border-2 border-solid border-white bg-gray-100/5"
              >
                <ChevronRightIcon className="h-8 w-8" />
              </IconButton>
            )}
          >
            {home.map((homeItem, id) => (
              <img
                onClick={() => handleEditHome(homeItem)}
                key={id}
                src={`http://localhost:8080/${homeItem.bHeadImg}`}
                alt="Carousel image"
                className="h-[153px] w-full object-cover md:h-[306px] lg:h-[408px] xl:h-[612px]"
              />
            ))}
          </Carousel>

          <p className="mt-4 flex items-center gap-4 font-medium text-blue-800 hover:cursor-pointer">
            <label className="flex items-center gap-2 3xl text-xl">
              <PlusIcon className="h-6 w-6" /> Tambahkan Gambar
              <input
                className="hidden"
                type="file"
                name="bHeadImg"
                onChange={(e) => setbHeadImg(e.target.files[0])}/>
            </label>
          </p>
        </div>

        <div className="space-y-32">
          <div className="max-w-7xl space-y-32 px-12 pt-12 lg:mx-auto">
            {home.slice(0, 1).map((homeItem) => (
              <div
              key={homeItem.ID}>
                <div className="grid h-full mb-5 grid-cols-1 justify-center gap-8 sm:grid-rows-[384px] md:grid-cols-[384px_1fr]">
                  <div
                    className="relative"
                    onClick={() => handleEditHome(homeItem)}
                    key={homeItem.ID}>
                      <img
                        src={`http://localhost:8080/${home[0]?.kImg}`}
                        alt="Kepala Sekolah"
                        className="h-full w-full rounded-b-xl"
                      />
                    <div className="bg-main-seagreen absolute bottom-0 z-10 flex w-full flex-col items-center gap-2 rounded-b-xl p-4">
                      <p className="text-xl font-semibold">{guru[0]?.name}</p>
                      <p>{guru[0]?.position}</p>
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <div className="z-10 flex w-full drop-shadow sm:w-1/2">
                      <div className="bg-main-seagreen w-full whitespace-nowrap rounded-t-xl px-8 py-4 text-xl font-semibold sm:rounded-t-none sm:rounded-tl-xl">
                        SMP Bakti Idhata
                      </div>
                      <div className="bg-main-seagreen hidden w-full px-8 py-4 sm:block sm:rounded-tr-full"></div>
                    </div>
                    <div
                      className="bg-light-green h-96 overflow-auto rounded-b-xl px-8 py-4 text-justify leading-6 sm:h-full sm:rounded-tr-xl whitespace-pre-wrap break-all"
                      onClick={() => handleEditHome(homeItem)}
                      key={homeItem.ID}>
                      { home[0]?.description }
                    </div>
                  </div>
                </div>
                <div className="mb-4 grid grid-cols-[250px_1fr] grid-rows-[250px] gap-8 xl:grid-cols-[1fr_2fr]">
                  <label className="text-black xl:text-sm text-sm flex items-center justify-center w-full h-full">
                    <PhotoBox
                      styles="text-white xl:text-3xl text-xl flex items-center justify-center w-full h-full overflow-hidden">
                      {previewKImg ? (
                        <img src={previewKImg} alt="Preview" />
                      ) : (
                        <div>
                          <input
                            className="hidden"
                            type="file"
                            placeholder="Foto Kepala Sekolah"
                            onChange={handlePreviewKImg}
                            name="kImg"
                          />
                          {kImg && <img src={`http://localhost:8080/${home[0]?.kImg}`} alt="" />}
                        </div>
                      )}
                    </PhotoBox>
                  </label>
                  <div
                    className="h-full w-full">
                    <textarea
                      className="h-full w-full resize-none rounded-xl focus:border-main-blue"
                      placeholder="Sambutan Selamat Datang"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      name="description"
                    ></textarea>
                  </div>
                </div>

                <div className="flex">
                  <div className="ml-auto">
                    <Flowbite theme={{ theme: customButtonTheme }}>
                      <Button color="dark-green" size="lg" type="submit">
                        Simpan
                      </Button>
                    </Flowbite>
                  </div>
                </div>
              </div>
            ))}
            
            <div>
              <div className="mb-24 flex h-14 flex-col justify-between gap-4 sm:mb-10 sm:flex-row">
                <h2 className="flex flex-col justify-between text-3xl font-bold">
                  Berita
                  <span className="hid text-sm font-normal text-gray-500 sm:text-base">
                    Berita dan informasi terbaru
                  </span>
                </h2>
                <Link to="/berita">
                  <Flowbite theme={{ theme: customButtonTheme }}>
                    <Button color="dark-green" size="lg">
                      Lihat Semua
                    </Button>
                  </Flowbite>
                </Link>
              </div>

              <div className="mx-auto flex flex-col items-center gap-6 md:grid md:grid-cols-2 xl:grid-cols-4">
                {news.slice(-4, news.length).reverse().map((n, id) => (
                  <NewsCard
                    id={n.ID}
                    key={id}
                    title={n.judulBerita}
                    subtitle={stripTags(n.isiBerita)}
                    imgSrc={`http://localhost:8080/${n.sampul}`}
                    imgAlt=""
                  />
                ))}
              </div>
            </div>

            <div className="!mb-40">
              <div className="mb-24 flex h-14 flex-col justify-between gap-4 sm:mb-10 sm:flex-row">
                <h2 className="flex flex-col justify-between text-3xl font-bold">
                  Pengumuman
                  <span className="hid text-sm font-normal text-gray-500 sm:text-base">
                    Pengumuman dan informasi terbaru
                  </span>
                </h2>
                <Link to="/pengumuman">
                  <Flowbite theme={{ theme: customButtonTheme }}>
                    <Button color="dark-green" size="lg">
                      Lihat Semua
                    </Button>
                  </Flowbite>
                </Link>
              </div>

              <div className="divide-y divide-solid divide-gray-400">
                {notice.slice(-3, notice.length).reverse().map((a, id) => (
                  <div key={id}>
                    <Link to={`/pengumuman/${a.id}`}>
                      <Notice
                        title={a.judul}
                        date={a.date}
                        subtitle={stripTags(a.descNotice)}
                      />
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div> 
      </form>     
    </main>
  );
};

export default AdminHome;
