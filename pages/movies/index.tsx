import ContentRow from "../../modules/ContentRow";

const TrendingMoviesPage = () => (
  <div className="mx-auto max-w-6xl pt-20">
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
    />
  </div>
);

export default TrendingMoviesPage;
