// src/pages/feedback/FeedbackHomePage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/common/Header";
import "../../styles/feedbackhome.css";

const FeedbackHomePage = () => {
    const navigate = useNavigate();

    const cards = [
        {
            title: "🕒 Schedule Instant Feedback",
            description: "Plan one-time feedback deliveries for any team.",
            route: "/admin/feedback"
        },
        {
            title: "📆 Schedule Periodic Feedback",
            description: "Set up daily, weekly, or monthly feedback schedules.",
            route: "/admin/feedback/schedule-periodic"
        },
        {
            title: "✍️ Give Feedback",
            description: "Manually send feedback to users in your team.",
            route: "/feedback-give"
        },
        {
            title: "📥 See Feedback",
            description: "View all feedback you've received.",
            route: "/feedback-see"
        },
        {
            title: "Check all feedbacks",
            description: "View all feedback received.",
            route: "/feedback-super"
        }
    ];

    return (
        <>
            <Header />
            <div className="feedback-home-main">
                <div className="feedback-home-grid">
                    {cards.map((card, index) => (
                        <div
                            key={index}
                            className="feedback-home-card"
                            onClick={() => navigate(card.route)}
                        >
                            <h3>{card.title}</h3>
                            <p>{card.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default FeedbackHomePage;
