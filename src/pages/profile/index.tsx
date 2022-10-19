/* eslint-disable jsx-a11y/label-has-associated-control */
import LoadingPageComponents from "src/components/common/loading/LoadingPageComponents";
import ProfileHeader from "src/components/profile/ProfileHeader";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "pages/api/auth/[...nextauth]";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";

const fetchProfile = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/users/profile`);

  return res.json();
};

const ProfilePage = (props: { languages: any }) => {
  const { languages } = props;
  const queryClient = useQueryClient();
  const { data, status } = useQuery(["User"], fetchProfile);

  const [adult, setAdult] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("");

  const mutation = useMutation(
    (formData: any) =>
      fetch(`${process.env.NEXT_PUBLIC_URL}/api/users/profile`, {
        method: "POST",
        body: JSON.stringify({ adult, language: selectedLanguage }),
      }),
    {
      onSuccess: () => queryClient.invalidateQueries(["User"]),
    }
  );

  const onSubmit = (event: any) => {
    event.preventDefault();

    mutation.mutate({
      adult,
      language: selectedLanguage,
    });
  };

  useEffect(() => {
    if (status === "success") {
      setAdult(data.user.profile.adult);

      setSelectedLanguage(data.user.profile.language);
    }
  }, [data, status]);

  return (
    <LoadingPageComponents status={status}>
      {() => (
        <div className="max-w-6xl m-auto">
          <ProfileHeader image={data.user.image} name={data.user.name} />
          <div className="p-4 mx-4 mt-16 text-white rounded-md md:max-w-md bg-zinc-900">
            <form onSubmit={onSubmit}>
              <p className="pb-6 text-2xl font-bold">Settings</p>
              <label className="flex items-center w-full">
                <span className="">Show adult 18+ content</span>
                <input
                  type="checkbox"
                  className="ml-auto outline-none text-primary"
                  onChange={() => setAdult(!adult)}
                  checked={adult}
                />
              </label>

              <label className="flex items-center w-full">
                <span>Language</span>
                <select
                  className="ml-auto text-primaryBackground"
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  value={selectedLanguage}
                >
                  {languages.map((language: { iso_639_1: any; englishName: any }) => (
                    <option key={language.iso_639_1} value={language.iso_639_1}>
                      {language.englishName}
                    </option>
                  ))}
                </select>
              </label>

              <div className="flex items-center mt-12">
                <button
                  className="px-8 py-3 text-base font-semibold text-center rounded-md outline-none text-primaryBackground bg-primary"
                  type="submit"
                >
                  Save Settings
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </LoadingPageComponents>
  );
};

export async function getServerSideProps(context: any) {
  const languagesReq = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/languages`);
  const languagesRes = await languagesReq.json();

  return {
    props: {
      session: await unstable_getServerSession(context.req, context.res, authOptions),
      languages: languagesRes.languages,
    },
  };
}

export default ProfilePage;
