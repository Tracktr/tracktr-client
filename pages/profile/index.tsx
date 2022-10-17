/* eslint-disable jsx-a11y/label-has-associated-control */
import LoadingPageComponents from "@/components/common/loading/LoadingPageComponents";
import ProfileHeader from "@/components/profile/ProfileHeader";
import { getSession } from "next-auth/react";
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
        body: new URLSearchParams(formData),
      }),
    {
      onSuccess: () => queryClient.invalidateQueries(["User"]),
    }
  );

  const onSubmit = (event: any) => {
    event.preventDefault();

    mutation.mutate(new FormData(event.target));
  };

  return (
    <LoadingPageComponents status={status}>
      {() => (
        <div>
          <ProfileHeader image={data.user.image} name={data.user.name} />
          <div className="max-w-6xl pt-16 m-auto">
            <form className="flex flex-col" onSubmit={onSubmit}>
              <div>
                <label htmlFor="adult">Adult:</label>
                <select name="adult" className="text-black">
                  <option value="true">Show adult 18+ content</option>
                  <option value="false">Hide adult 18+ content</option>
                </select>
              </div>

              <input type="submit" />
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
