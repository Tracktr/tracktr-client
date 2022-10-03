interface ILargeSort {
  type: string;
}

const LargeSort = ({ type }: ILargeSort) => (
  <div className="text-5xl font-bold">
    Find amazing {type}
    <span className="text-primary">.</span>
  </div>
);

export default LargeSort;
