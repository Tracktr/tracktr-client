import ContentRow from "../../modules/ContentRow";
import PosterHeader from "../../modules/PosterHeader";

const TrendingMoviesPage = () => (
  <>
    <PosterHeader
      type="Movies"
      backgroundImage="https://www.themoviedb.org/t/p/original/wQxPlS65wgy6Ik7N80bsMpAkjyf.jpg"
      recommendations={[
        {
          imageSrc: "https://image.tmdb.org/t/p/original/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
          name: "Interstellar",
        },
        {
          imageSrc: "https://image.tmdb.org/t/p/original/tVxDe01Zy3kZqaZRNiXFGDICdZk.jpg",
          name: "Bullet Train",
        },
      ]}
    />

    <div className="mx-auto max-w-6xl pb-1 -mt-32">
      <ContentRow
        type="Trending"
        data={[
          {
            imageSrc: "https://image.tmdb.org/t/p/original/wSqAXL1EHVJ3MOnJzMhUngc8gFs.jpg",
            name: "Orphan: First Kill",
          },
          { imageSrc: "https://image.tmdb.org/t/p/original/spCAxD99U1A6jsiePFoqdEcY0dG.jpg", name: "Fall" },
          { imageSrc: "https://image.tmdb.org/t/p/original/g8sclIV4gj1TZqUpnL82hKOTK3B.jpg", name: "Pinocchio" },
          { imageSrc: "https://image.tmdb.org/t/p/original/iRV0IB5xQeOymuGGUBarTecQVAl.jpg", name: "Beast" },
          { imageSrc: "https://image.tmdb.org/t/p/original/vwq5iboxYoaSpOmEQrhq9tHicq7.jpg", name: "Samaritan" },
          {
            imageSrc: "https://image.tmdb.org/t/p/original/pIkRyD18kl4FhoCNQuWxWu5cBLM.jpg",
            name: "Thor: Love and Thunder",
          },
        ]}
        buttons={[{ title: "Today", selected: true }, { title: "This Week" }]}
      />
      <ContentRow
        type="Popular"
        data={[
          {
            imageSrc: "https://image.tmdb.org/t/p/original/tVxDe01Zy3kZqaZRNiXFGDICdZk.jpg",
            name: "Bullet Train",
          },
          {
            imageSrc: "https://image.tmdb.org/t/p/original/wSqAXL1EHVJ3MOnJzMhUngc8gFs.jpg",
            name: "Orphan: First Kill",
          },
          { imageSrc: "https://image.tmdb.org/t/p/original/spCAxD99U1A6jsiePFoqdEcY0dG.jpg", name: "Fall" },
          {
            imageSrc: "https://image.tmdb.org/t/p/original/6b7swg6DLqXCO3XUsMnv6RwDMW2.jpg",
            name: "After ever happy",
          },
          { imageSrc: "https://image.tmdb.org/t/p/original/g8sclIV4gj1TZqUpnL82hKOTK3B.jpg", name: "Pinocchio" },
          { imageSrc: "https://image.tmdb.org/t/p/original/iRV0IB5xQeOymuGGUBarTecQVAl.jpg", name: "Beast" },
        ]}
        buttons={[{ title: "Streaming", selected: true }, { title: "In Theaters" }]}
      />
      <ContentRow
        type="Upcoming"
        data={[
          {
            imageSrc: "https://image.tmdb.org/t/p/original/wSqAXL1EHVJ3MOnJzMhUngc8gFs.jpg",
            name: "Orphan: First Kill",
          },
          {
            imageSrc: "https://image.tmdb.org/t/p/original/rugyJdeoJm7cSJL1q4jBpTNbxyU.jpg",
            name: "Dragon Ball Super: Super Hero",
          },
          {
            imageSrc: "https://image.tmdb.org/t/p/original/uJYYizSuA9Y3DCs0qS4qWvHfZg4.jpg",
            name: "Spider-Man: No Way Home",
          },
          { imageSrc: "https://image.tmdb.org/t/p/original/hiaeZKzwsk4y4atFhmncO5KRxeT.jpg", name: "Smile" },
          { imageSrc: "https://image.tmdb.org/t/p/original/bPyBqGBYjGzyLVHJEIsCwlZejk.jpg", name: "Into the Deep" },
          {
            imageSrc: "https://image.tmdb.org/t/p/original/7qop80YfuO0BwJa1uXk1DXUUEwv.jpg",
            name: "The Bad Guys",
          },
        ]}
        buttons={[{ title: "Streaming", selected: true }, { title: "In Theaters" }]}
      />
    </div>
  </>
);

export default TrendingMoviesPage;
