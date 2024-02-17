import Box from "./PhotoBox";
import { CalendarDaysIcon, MegaphoneIcon } from "@heroicons/react/24/outline";

const Notice = (props) => {
  return (
    <div className="flex h-full items-center gap-4 rounded-lg py-4 hover:cursor-pointer md:gap-12">
      <Box styles="sm:w-36 h-36 sm:flex items-center justify-center grow-0 shrink-0 basis-36 hidden !bg-main-yellow">
        <MegaphoneIcon className="h-20 w-20" />
      </Box>

      <div className="flex flex-col gap-2">
        <h3 className="text-xl sm:text-2xl">{props.title}</h3>
        <p className="flex items-center gap-4 sm:text-xl">
          <CalendarDaysIcon className="h-5 w-5 sm:h-6 sm:w-6" />
          {props.date}
        </p>
        <p className="text-justify leading-6 text-gray-500 sm:text-left">
          {props.subtitle}
        </p>
      </div>
    </div>
  );
};

export default Notice;
