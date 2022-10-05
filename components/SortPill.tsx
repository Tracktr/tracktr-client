export interface ISortPillButton {
  title: string;
  selected?: boolean;
}

interface ISortPill {
  buttons: ISortPillButton[];
}

const SortPill = ({ buttons }: ISortPill) => (
  <div className="z-40">
    <div className="flex items-center justify-center text-xs border-2 rounded-full border-primary">
      {buttons.map((b) => (
        <div
          key={b.title}
          className={
            b.selected
              ? "text-primaryBackground bg-primary py-2 px-4 rounded-full"
              : "text-primary py-2 px-4 rounded-full"
          }
        >
          {b.title}
        </div>
      ))}
    </div>
  </div>
);

export default SortPill;
