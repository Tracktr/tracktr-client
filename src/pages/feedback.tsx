import Head from "next/head";
import { useRouter } from "next/router";
import { ChangeEvent, useState } from "react";
import { ImSpinner2 } from "react-icons/im";
import { IoIosAdd, IoMdInformation } from "react-icons/io";
import { toast } from "react-toastify";
import { trpc } from "../utils/trpc";

const FeedbackPage = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const router = useRouter();

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.currentTarget.value);
  };
  const handleMessageChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.currentTarget.value);
  };

  const handleSubmit = () => {
    addFeedback.mutate({
      email,
      message,
    });
  };

  const addFeedback = trpc.feedback.add.useMutation({
    onSuccess: () => {
      toast("Feedback Added", {
        icon: <IoIosAdd className="text-3xl text-green-500" />,
      });
      // router.push("/");
    },
    onError: () => {
      toast("Failed to add feedback", {
        icon: <IoMdInformation className="text-3xl text-blue-500" />,
      });
    },
  });

  return (
    <>
      <Head>
        <title>Feedback form - Tracktr.</title>
      </Head>

      <div className="pt-24">
        <div className="py-10 text-white sm:py-16 lg:py-24">
          <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">Feedback form</h2>
              <p className="mx-auto mt-4 text-base leading-relaxed">
                If you see something that isn&apos;t working quite right or you have an awesome idea htmlFor a new
                feature you can leave a message on this page and we&apos;ll take a look at it. If you have a GitHub
                account, you can also create an issue on{" "}
                <a
                  className="underline"
                  href="https://github.com/Tracktr/tracktr-client/issues"
                  target="_blank"
                  rel="noreferrer"
                >
                  our repository here
                </a>
                .
              </p>

              <div className="mt-12 text-left">
                <div className="mb-6">
                  <label htmlFor="email" className="block mb-2 text-sm font-medium text-white">
                    Your email
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="border text-sm rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
                    placeholder="name@tracktr.app"
                    required
                    aria-describedby="helper-text-explanation"
                    onChange={handleEmailChange}
                    disabled={addFeedback.isLoading}
                  />
                  <p id="helper-text-explanation" className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    We&apos;ll only use this to contact you if we need more information.
                  </p>
                </div>

                <label htmlFor="message" className="block mb-2 text-sm font-medium text-white">
                  Your message
                </label>
                <textarea
                  id="message"
                  rows={4}
                  className="block p-2.5 w-full text-sm rounded-lg border bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500 mb-6"
                  placeholder="Leave a comment..."
                  onChange={handleMessageChange}
                  disabled={addFeedback.isLoading}
                ></textarea>

                <button
                  type="submit"
                  className="text-white focus:ring-4 focus:outline-none font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center bg-blue-600 hover:bg-blue-700 focus:ring-blue-800"
                  onClick={handleSubmit}
                  disabled={addFeedback.isLoading}
                >
                  {addFeedback.isLoading ? (
                    <div className="flex items-center gap-2">
                      <ImSpinner2 className="animate-spin" />
                      <div>Saving...</div>
                    </div>
                  ) : (
                    <div>Submit</div>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FeedbackPage;
