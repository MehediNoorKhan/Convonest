import React from "react";

const FAQ = () => {
    return (
        <div className="max-w-3xl mx-auto py-20 px-4">
            <h2 className="text-3xl font-bold text-center text-primary mb-10">
                Frequently Asked Questions
            </h2>

            <div className="space-y-4">
                {faqData.map((item, index) => (
                    <div
                        key={index}
                        className="collapse collapse-arrow 
                                   bg-white 
                                   border border-blue-300 
                                   rounded-xl transition-all duration-300
                                   hover:shadow-[0_4px_15px_0_rgba(59,130,246,0.4)]"
                    >
                        <input type="radio" name="faq-accordion" defaultChecked={index === 0} />
                        <div className="collapse-title font-semibold text-base text-gray-800">
                            {item.question}
                        </div>
                        <div className="collapse-content text-sm text-gray-600">
                            {item.answer}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const faqData = [
    {
        question: "What is ConvoNest?",
        answer:
            "ConvoNest is an online discussion forum where users can share posts, engage in conversations, explore trending topics, and connect with like-minded people.",
    },
    {
        question: "How do I create an account?",
        answer:
            'Click the “Sign Up” button at the top right corner, fill in your details, and verify your email to start posting on ConvoNest.',
    },
    {
        question: "How can I create or reply to a post?",
        answer:
            'Once logged in, go to the “Discussions” page. You can create a new post or open an existing one to reply or upvote comments.',
    },
    {
        question: "Can I edit or delete my posts?",
        answer:
            'Yes. Go to your post, click on the “...” menu, and choose Edit or Delete as needed.',
    },
    {
        question: "How do I report inappropriate content?",
        answer:
            'Click the “Report” button under the post or comment you find inappropriate. Our moderators will review it shortly.',
    },
    {
        question: "I forgot my password. What should I do?",
        answer:
            'Click on “Forgot Password” on the login page and follow the reset instructions sent to your email.',
    },
    {
        question: "How do I update my profile information?",
        answer:
            'Go to “My Profile” and click on “Edit Profile” to update your details, avatar, or bio.',
    },
];

export default FAQ;
