import logo from "../images/cropped-bakdhatlogo.svg";
import { PhoneIcon, EnvelopeIcon, MapIcon } from "@heroicons/react/24/outline";
import { Element } from "react-scroll";

import Tiktok from "../images/icons/Tiktok";
import XTwitter from "../images/icons/XTwitter";
import Instagram from "../images/icons/Instagram";
import Facebook from "../images/icons/Facebook";
import { Link } from "react-router-dom";

const pageLinks = [
  {
    linkName: "Profil Sekolah",
    linkTo: "/profil",
  },
  {
    linkName: "Berita",
    linkTo: "/berita",
  },
  {
    linkName: "Pengumuman",
    linkTo: "/pengumuman",
  },
  {
    linkName: "Staff Pengajar",
    linkTo: "/guru",
  },
  {
    linkName: "PPDB Online",
    linkTo: "#",
  },
  {
    linkName: "Rabu Ceria",
    linkTo: "/rabuceria",
  },
];

const footerContent = [
  {
    heading: "Description",
    content:
      "SMP Bakti Idhata berada dibawah naungan Yayasan Bakti Idhata, Dharma Wanita Persatuan Kementerian Pendidikan, Kebudayaan, Riset dan Teknologi Republik Indonesia (Kemdikbudristek).",
  },
  {
    heading: "Halaman",
    content: pageLinks,
  },
  {
    heading: "Hubungi Kami",
    content:
      "Jl. Melati No.25 13, RT.13/RW.10, Cilandak Bar., Kec. Cilandak, Kota Jakarta Selatan, Daerah Khusus Ibukota Jakarta",
  },
  {
    heading: "Social Media",
    content: {
      tiktok: "officialsmpbaktiidhata",
      xTwitter: "SBaktiidh250631",
      instagram: "officialsmpbaktiidhata250631",
      facebook: "Simp Baktiidhata",
    },
  },
];

const [description, links, contact, social] = [...footerContent];

const Footer = () => {
  return (
    <footer className="whitespace-normal bg-light-green font-poppins">
      <Element name="footer">
        <div className="mx-auto max-w-7xl lg:px-6">
          <div className="grid grid-cols-1 gap-8 py-6 text-justify md:scale-90 md:grid-cols-2 md:py-6 md:text-left lg:max-w-7xl lg:grid-cols-4 lg:py-12">
            <div className="flex flex-col items-center justify-between gap-4 sm:gap-2 md:items-start">
              <img
                className="w-32"
                src={logo}
                alt="Logo Sekolah Bakti Idhata"
              />
              <h1 className="mb-4 flex flex-col gap-1 font-antonio text-3xl font-semibold uppercase">
                smp bakti idhata
                <span className="text-base font-light">
                  cerdas terampil luhur
                </span>
              </h1>
              <p className="px-4 text-justify text-lg leading-7 md:px-0">
                {description.content}
              </p>
            </div>

            <div className="flex w-full flex-col items-center justify-self-center md:items-start lg:items-center">
              <p className="mb-8 text-4xl font-extrabold md:mb-12">
                {links.heading}
              </p>
              <ul className="flex list-disc flex-col gap-4 pl-6 leading-6">
                {links.content.map((link, i) => {
                  return (
                    <li key={i} className="text-lg">
                      <Link
                        to={link.linkTo}
                        className="fill-black hover:cursor-pointer"
                      >
                        {link.linkName}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="flex flex-col items-start px-4 md:px-0">
              <p className="mb-8 self-center text-4xl font-extrabold md:mb-12 md:self-start">
                {contact.heading}
              </p>
              <div className="flex flex-col gap-4 text-lg">
                <p className="text-justify leading-7">{contact.content}</p>
                <p className="flex items-center gap-4">
                  <MapIcon className="h-7 w-7 fill-black stroke-light-green" />
                  <a
                    href="https://maps.app.goo.gl/k52QLnhq5A1bwjgK6"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="whitespace-pre-wrap break-all fill-black"
                  >
                    Bakti Idhata
                  </a>
                </p>
                <p className="flex items-center gap-4">
                  <EnvelopeIcon className="h-7 w-7 flex-none fill-black stroke-light-green" />{" "}
                  <a
                    href="mailto:smpbaktiidhata20106935@gmail.com"
                    className="whitespace-pre-wrap break-all fill-black"
                  >
                    smpbaktiidhata20106935@gmail.com
                  </a>
                </p>
                <p className="flex items-center gap-4">
                  <PhoneIcon className="h-7 w-7 fill-black" />
                  <a
                    href="https://wa.me/628118252530"
                    className="whitespace-pre-wrap break-all fill-black"
                  >
                    https://wa.me/628118252530
                  </a>
                </p>
              </div>
            </div>

            <div className="flex flex-col px-4 md:px-0">
              <p className="mb-8 self-center text-4xl font-extrabold md:mb-12 md:self-start">
                {social.heading}
              </p>

              <div className="flex flex-col items-start gap-6 text-lg">
                <div className="flex items-center gap-4">
                  <Tiktok className="h-7 w-7" />
                  <a href="https://www.tiktok.com/@officialsmpbaktiidhata?is_from_webapp=1&sender_device=pc">{social.content.tiktok}</a>
                </div>
                <div className="flex items-center gap-4">
                  <XTwitter className="h-7 w-7" />
                  <a href="https://x.com/SBaktiidh250631?s=20">{social.content.xTwitter}</a>
                </div>
                <div className="flex items-center gap-4">
                  <Instagram className="h-7 w-7" />
                  <a href="https://www.instagram.com/officialsmpbaktiidhata250631?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==">{social.content.instagram}</a>
                </div>
                <div className="flex items-center gap-4">
                  <Facebook className="h-7 w-7" />
                  <a href="https://www.facebook.com/profile.php?id=61553711876355">{social.content.facebook}</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Element>
    </footer>
  );
};

export default Footer;
