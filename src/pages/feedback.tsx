import Head from "next/head";
import { useRouter } from "next/router";
import { ChangeEvent, useState } from "react";
import { ImSpinner2 } from "react-icons/im";
import { IoIosAdd, IoMdInformation } from "react-icons/io";
import { toast } from "react-toastify";
import { trpc } from "../utils/trpc";

const FeedbackPage = () => {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [message, setMessage] = useState("");
  const [messageSize, setMessageSize] = useState(0);
  const [messageError, setMessageError] = useState("");

  const router = useRouter();
  const MAX_MESSAGE_SIZE = 512;

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(e.currentTarget.value)) {
      setEmailError("");
    } else {
      setEmailError("Incorrect email");
    }

    setEmail(e.currentTarget.value);
  };
  const handleMessageChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    if (e.currentTarget.value.length > MAX_MESSAGE_SIZE) {
      setMessageError("Message is too long");
    } else {
      setMessageError("");
    }

    setMessage(e.currentTarget.value);
    setMessageSize(e.currentTarget.value.length);
  };

  const handleSubmit = () => {
    if (!emailError && !messageError)
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
      router.push("/");
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
                    className={`border text-sm rounded-lg block w-full p-2.5 disabled:cursor-not-allowed ${
                      emailError
                        ? "text-red-900 placeholder-red-700 focus:ring-red-500 focus:border-red-500 bg-red-100 border-red-400"
                        : "text-white placeholder-gray-400 bg-gray-700 focus:ring-blue-500 focus:border-blue-500 border-gray-600"
                    }`}
                    placeholder="name@tracktr.app"
                    required
                    aria-describedby="email-helper"
                    onChange={handleEmailChange}
                    disabled={addFeedback.isLoading}
                  />
                  <p id="email-helper" className="mt-2 text-sm text-gray-400">
                    We&apos;ll only use this to contact you if we need more information.
                  </p>
                </div>

                <label htmlFor="message" className="block mb-2 text-sm font-medium text-white">
                  Your message
                </label>
                <textarea
                  id="message"
                  rows={4}
                  className={`block p-2.5 w-full text-sm rounded-lg border disabled:cursor-not-allowed ${
                    messageError
                      ? "text-red-900 placeholder-red-700 focus:ring-red-500 focus:border-red-500 bg-red-100 border-red-400"
                      : "text-white placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500 bg-gray-700 border-gray-600"
                  }`}
                  placeholder="Leave a comment..."
                  onChange={handleMessageChange}
                  disabled={addFeedback.isLoading}
                  aria-describedby="message-helper"
                ></textarea>
                <p
                  id="message-helper"
                  className={`mt-2 mb-6 text-sm ${messageError ? "text-red-400" : "text-gray-400"}`}
                >
                  {messageSize}/{MAX_MESSAGE_SIZE} characters used.
                </p>

                <button
                  type="submit"
                  className="text-white focus:ring-4 focus:outline-none font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center bg-blue-600 hover:bg-blue-700 focus:ring-blue-800 disabled:cursor-not-allowed disabled:bg-gray-700"
                  onClick={handleSubmit}
                  disabled={addFeedback.isLoading || Boolean(messageError) || Boolean(emailError)}
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
