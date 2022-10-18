/* eslint-disable jsx-a11y/label-has-associated-control */
import LoadingPageComponents from "@/components/common/loading/LoadingPageComponents";
import ProfileHeader from "@/components/profile/ProfileHeader";
import { getSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";

const fetchProfile = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/users/profile`);

  return res.json();
};

const ProfilePage = () => {
  const queryClient = useQueryClient();
  const { data, status } = useQuery(["User"], fetchProfile);

  const mutation = useMutation(
    (formData: any) =>
      fetch(`${process.env.NEXT_PUBLIC_URL}/api/users/profile`, {
        method: "POST",
        body: JSON.stringify(formData),
      }),
    {
      onSuccess: () => queryClient.invalidateQueries(["User"]),
    }
  );

  const [adult, setAdult] = useState(false);

  const onSubmit = (event: any) => {
    event.preventDefault();

    mutation.mutate({
      adult,
    });
  };

  useEffect(() => {
    if (status === "success") {
      setAdult(data.user.profile.adult);
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

              <button
                className="px-8 py-3 m-auto mt-12 text-base font-semibold text-center rounded-md outline-none text-primaryBackground bg-primary"
                type="submit"
              >
                Save Settings
              </button>
            </form>
          </div>
        </div>
      )}
    </LoadingPageComponents>
  );
};

export async function getServerSideProps(context: any) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {
      session,
    },
  };
}

export default ProfilePage;
