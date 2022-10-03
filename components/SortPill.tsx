export interface ISortPillButton {
  title: string;
  selected?: boolean;
}

interface ISortPill {
  buttons: ISortPillButton[];
}

const SortPill = ({ buttons }: ISortPill) => (
  <div className="z-40 my-auto ml-4">
    <div className="flex justify-center rounded-full text-xs border-primary border-2">
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
