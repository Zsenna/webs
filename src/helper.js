import lantai1 from "./images/lantai-1.png";
import lantai2 from "./images/lantai-2.png";
import lantai3 from "./images/lantai-3.png";
import lantai1NonLabel from "./images/lantai1-nonlabel.png";
import lantai2NonLabel from "./images/lantai2-nonlabel.png";
import lantai3NonLabel from "./images/lantai3-nonlabel.png";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

function getFloorImages() {
  return {
    lantai1,
    lantai2,
    lantai3,
    lantai1NonLabel,
    lantai2NonLabel,
    lantai3NonLabel,
  };
}

export { classNames, getFloorImages };
