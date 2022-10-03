import ContentRow from "../../modules/ContentRow";
import PosterHeader from "../../modules/PosterHeader";

const TrendingSeriesPage = () => (
  <div className="pb-5">
    <PosterHeader
      type="series"
      backgroundImage="https://www.themoviedb.org/t/p/original/Aa9TLpNpBMyRkD8sPJ7ACKLjt0l.jpg"
      recommendations={[
        {
          imageSrc: "https://image.tmdb.org/t/p/original/z2yahl2uefxDCl0nogcRBstwruJ.jpg",
          name: "House of the Dragon",
        },
        {
          imageSrc: "https://image.tmdb.org/t/p/original/1rO4xoCo4Z5WubK0OwdVll3DPYo.jpg",
          name: "The Lord of the Rings: The Rings of Power",
        },
      ]}
    />

    <div className="mx-auto max-w-6xl -mt-24 pb-6">
      <ContentRow
        type="Trending"
        data={[
          {
            imageSrc: "https://image.tmdb.org/t/p/original//sUfJxQarDfBMgmJgsgJqmVP16UU.jpg",
            name: "Mayday",
          },
          {
            imageSrc: "https://image.tmdb.org/t/p/original/EpDuYIK81YtCUT3gH2JDpyj8Qk.jpg",
            name: "Marvel Studios Legends",
          },
          {
            imageSrc: "https://image.tmdb.org/t/p/original/giUBXYnDAaJgNqA6iE3BMVE2EHp.jpg",
            name: "NOVA",
          },
          {
            imageSrc: "https://image.tmdb.org/t/p/original/aqM6QnuhSXzjHlKbXyKUqxaGiWu.jpg",
            name: "Top Gear",
          },
          {
            imageSrc: "https://image.tmdb.org/t/p/original/6X2hftdC8y78SKMSgfzeUItqaVq.jpg",
            name: "Ancient Aliens",
          },
          {
            imageSrc: "https://image.tmdb.org/t/p/original/jpnSY1g34DivfZPOuggM0LVBNtQ.jpg",
            name: "Document 72 Hours",
          },
        ]}
        buttons={[{ title: "Today", selected: true }, { title: "This Week" }]}
      />
      <ContentRow
        type="Popular"
        data={[
          {
            imageSrc: "https://image.tmdb.org/t/p/original/1rO4xoCo4Z5WubK0OwdVll3DPYo.jpg",
            name: "The Lord of the Rings: The Rings of Power",
          },
          {
            imageSrc: "https://image.tmdb.org/t/p/original/z2yahl2uefxDCl0nogcRBstwruJ.jpg",
            name: "House of the Dragon",
          },
          {
            imageSrc: "https://image.tmdb.org/t/p/original/hJfI6AGrmr4uSHRccfJuSsapvOb.jpg",
            name: "She-Hulk: Attorney at Law",
          },
          {
            imageSrc: "https://image.tmdb.org/t/p/original/f2PVrphK0u81ES256lw3oAZuF3x.jpg",
            name: "Dahmer - Monster: The Jeffrey Dahmer Story",
          },
          {
            imageSrc: "https://image.tmdb.org/t/p/original/cvhNj9eoRBe5SxjCbQTkh05UP5K.jpg",
            name: "Rick and Morty",
          },
          {
            imageSrc: "https://image.tmdb.org/t/p/original/yThmbQkxSzW4HHdAaoj8RYHFH3i.jpg",
            name: "War of the Worlds",
          },
        ]}
        buttons={[{ title: "Streaming", selected: true }]}
      />
    </div>

    <div className="mx-auto max-w-6xl pt-2 border-t-2 border-[#343434]">
      <ContentRow
        type="Series"
        data={[
          {
            imageSrc: "https://image.tmdb.org/t/p/original//sUfJxQarDfBMgmJgsgJqmVP16UU.jpg",
            name: "Mayday",
          },
          {
            imageSrc: "https://image.tmdb.org/t/p/original/EpDuYIK81YtCUT3gH2JDpyj8Qk.jpg",
            name: "Marvel Studios Legends",
          },
          {
            imageSrc: "https://image.tmdb.org/t/p/original/giUBXYnDAaJgNqA6iE3BMVE2EHp.jpg",
            name: "NOVA",
          },
          {
            imageSrc: "https://image.tmdb.org/t/p/original/aqM6QnuhSXzjHlKbXyKUqxaGiWu.jpg",
            name: "Top Gear",
          },
          {
            imageSrc: "https://image.tmdb.org/t/p/original/6X2hftdC8y78SKMSgfzeUItqaVq.jpg",
            name: "Ancient Aliens",
          },
          {
            imageSrc: "https://image.tmdb.org/t/p/original/jpnSY1g34DivfZPOuggM0LVBNtQ.jpg",
            name: "Document 72 Hours",
          },
          {
            imageSrc: "https://image.tmdb.org/t/p/original/ecAOX4esywAXLF5I4X2gaTmhmAG.jpg",
            name: "This Old House",
          },
          {
            imageSrc: "https://image.tmdb.org/t/p/original/uYPpqCgnKxd7ngdcm0wwJsYGt4B.jpg",
            name: "Abandoned Engineering",
          },
          {
            imageSrc: "https://image.tmdb.org/t/p/original/zzqQ3JSfRUaUJFL0OC6Sn7gF6hE.jpg",
            name: "América vs América",
          },
          {
            imageSrc: "https://image.tmdb.org/t/p/original/beBB1ZnPOxG64dlTYKsEO8BwEGf.jpg",
            name: "24 Hours in A&E",
          },
          {
            imageSrc: "https://image.tmdb.org/t/p/original/cF8uwpySVzP89ND5RWfUTObs2he.jpg",
            name: "Another Way of Living: Atlético de Madrid",
          },
          {
            imageSrc: "https://image.tmdb.org/t/p/original/paRFRd11WlFOxVbGnzjjCBym7FW.jpg",
            name: "Match of the Day",
          },
          {
            imageSrc: "https://image.tmdb.org/t/p/original/bTvsFzYK4ZdbcAIPSEJ3i8uLHSh.jpg",
            name: "Formula 1: Drive to Survive",
          },
          {
            imageSrc: "https://image.tmdb.org/t/p/original/2RFVTbJI4spbnOYxE0YYbcD8WNT.jpg",
            name: "Match of the Day 2",
          },
          {
            imageSrc: "https://image.tmdb.org/t/p/original/gr4hFhqfuGUQPyQ2a2dOTM1ewnm.jpg",
            name: "Roman Empire",
          },
          {
            imageSrc: "https://image.tmdb.org/t/p/original/kJUZ4rzO3pJMFkSHjBPXkVsgRDq.jpg",
            name: "Grand Designs",
          },
          {
            imageSrc: "https://image.tmdb.org/t/p/original/mPXzwheCTrTWZJtUeueOkv00pL1.jpg",
            name: "Wunderschön!",
          },
          {
            imageSrc: "https://image.tmdb.org/t/p/original/jhzvg24BSP4qDKRdHUDqUsOduJ1.jpg",
            name: "Frank & Kastaniegaarden",
          },
        ]}
        buttons={[{ title: "Trending", selected: true }, { title: "Popular" }, { title: "Recommended" }]}
      />
      <div className="flex justify-center items-center">
        <div className="select-none cursor-pointer rounded-full border-primary border-2 py-2 text-primary px-10">
          Load more...
        </div>
      </div>
    </div>
  </div>
);

export default TrendingSeriesPage;
