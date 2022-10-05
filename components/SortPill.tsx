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
  <div className="z-40">
    <div className="flex items-center justify-center text-xs border-2 rounded-full border-primary">
      {buttons.data.map((b) => (
        <div
          key={b.title}
          className={
            b.value === buttons.currentValue
              ? "text-primaryBackground bg-primary py-2 px-4 rounded-full cursor-default select-none"
              : "text-primary py-2 px-4 rounded-full cursor-pointer select-none"
          }
          onClick={() => buttons.onClick(b.value)}
          onKeyDown={() => buttons.onClick(b.value)}
          tabIndex={0}
          role="button"
        >
          {b.title}
        </div>
      ))}
    </div>
  </div>
);

export default SortPill;
