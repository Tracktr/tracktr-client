import { motion } from "framer-motion";

export interface ISortPillButtons {
  onClick: (value: string) => void;
  currentValue: string;
  data: {
    title: string;
    value: string;
  }[];
}

interface ISortPill {
  buttons: ISortPillButtons;
}

const SortPill = ({ buttons }: ISortPill) => (
  <div className="pt-1 md:ml-auto">
    <div className="flex items-center justify-center text-xs border-2 rounded-full border-primary">
      {buttons.data.map((b) => (
        <motion.div
          initial={false}
          animate={{ scale: b.value === buttons.currentValue ? 1.25 : 1 }}
          key={b.title}
          className={
            b.value === buttons.currentValue
              ? "text-primaryBackground bg-primary py-2 px-4 rounded-full"
              : "text-primary py-2 px-4 rounded-full"
          }
          onClick={() => buttons.onClick(b.value)}
          onKeyDown={() => buttons.onClick(b.value)}
          tabIndex={0}
          role="button"
        >
          {b.title}
        </motion.div>
      ))}
    </div>
  </div>
);

export default SortPill;
