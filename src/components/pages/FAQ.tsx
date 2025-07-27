import React, { useState } from 'react';
import { ChevronDown, Users, Calendar, Shield, CreditCard, MessageCircle, Star } from 'lucide-react';

const FAQSection = () => {
    const [openIndex, setOpenIndex] = useState<any>(null);

    const faqs = [
        {
            id: 1,
            icon: <Users className="w-5 h-5 text-orange-500" />,
            question: "How do I find the right trainer for my fitness goals?",
            answer: "Finding your perfect trainer is easy! Use our advanced search filters to browse trainers by specialty (weight loss, strength training, yoga, etc.), location, experience level, and client ratings. You can also read trainer profiles, view their certifications, and check client reviews. Once you find someone who matches your goals, you can message them directly to discuss your specific needs before booking your first session."
        },
        {
            id: 2,
            icon: <Calendar className="w-5 h-5 text-orange-500" />,
            question: "How does the booking and scheduling system work?",
            answer: "Our booking system is designed for maximum flexibility. After connecting with a trainer, you can view their real-time availability calendar and book sessions that fit your schedule. Choose from in-person, virtual, or hybrid training options. You'll receive instant confirmation, calendar invites, and automated reminders. Need to reschedule? No problem - both you and your trainer can propose new times through our platform."
        },
        {
            id: 3,
            icon: <CreditCard className="w-5 h-5 text-orange-500" />,
            question: "What are the payment options and pricing structure?",
            answer: "TrainLink offers flexible payment options including credit/debit cards, PayPal, and digital wallets. Trainers set their own rates, which typically range from $30-150 per session depending on experience and specialization. You can purchase single sessions, packages, or monthly plans. All payments are processed securely through our platform, and you're only charged after your session is completed."
        },
        {
            id: 4,
            icon: <Shield className="w-5 h-5 text-orange-500" />,
            question: "What is your refund and cancellation policy?",
            answer: "We offer a flexible cancellation policy to protect both clients and trainers. You can cancel or reschedule sessions up to 24 hours before the scheduled time for a full refund. Cancellations made less than 24 hours in advance may be subject to a 50% cancellation fee (at the trainer's discretion). If a trainer cancels on you, you'll receive a full refund immediately. For unused session packages, refunds are available within 30 days of purchase."
        },
        {
            id: 5,
            icon: <MessageCircle className="w-5 h-5 text-orange-500" />,
            question: "How does communication with trainers work?",
            answer: "TrainLink provides a built-in messaging system that keeps all communication secure and organized. You can chat with trainers before booking to discuss your goals, ask questions, and ensure they're the right fit. During your training journey, use the platform to share progress updates, ask for nutrition advice, or schedule additional sessions. All conversations are saved in your account for easy reference."
        },
        {
            id: 6,
            icon: <Star className="w-5 h-5 text-orange-500" />,
            question: "How do you ensure trainer quality and safety?",
            answer: "All trainers on TrainLink undergo a thorough verification process. We verify their certifications, insurance, and professional credentials before they can offer services. Trainers must maintain current CPR/First Aid certifications and liability insurance. Our rating and review system ensures accountability, and we continuously monitor trainer performance. If you ever have concerns about a trainer, our support team investigates immediately to maintain platform quality."
        }
    ];

    const toggleFAQ = (index: any) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section className="bg-orange-500 py-20 px-4 relative overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute inset-0 opacity-20">
                <div className="absolute top-10 left-10 w-72 h-72 bg-gradient-to-br from-white to-orange-200 rounded-full blur-3xl"></div>
                <div className="absolute bottom-10 right-10 w-96 h-96 bg-gradient-to-tl from-orange-300 to-white rounded-full blur-3xl"></div>
            </div>

            <div className="max-w-4xl mx-auto relative z-10">
                {/* Header */}
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                        Frequently Asked <span className="bg-gradient-to-r from-white to-orange-100 bg-clip-text text-transparent">Questions</span>
                    </h2>
                    <p className="text-white/90 text-lg max-w-2xl mx-auto leading-relaxed">
                        Everything you need to know about TrainLink. Can't find the answer you're looking for?
                        <span className="text-white font-semibold hover:text-white/80 cursor-pointer ml-1">Contact our support team</span>.
                    </p>
                </div>

                {/* FAQ Accordion */}
                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <div
                            key={faq.id}
                            className={`border rounded-2xl cursor-pointer transition-all duration-300 overflow-hidden ${openIndex === index
                                    ? 'border-white bg-gradient-to-br from-white to-white/90'
                                    : 'border-white/30 bg-gradient-to-br from-white to-white/90 hover:border-white'
                                }`}
                        >
                            {/* Question Header */}
                            <button
                                onClick={() => toggleFAQ(index)}
                                className="w-full px-6 py-6 text-left cursor-pointer flex items-center justify-between hover:bg-white/5 transition-colors duration-200"
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`p-2 rounded-lg transition-colors duration-300`}>
                                        {faq.icon}
                                    </div>
                                    <h3 className="text-orange-500 font-semibold text-lg pr-4">
                                        {faq.question}
                                    </h3>
                                </div>
                                <ChevronDown
                                    className={`w-5 h-5 transition-all duration-300 flex-shrink-0 ${openIndex === index
                                            ? 'text-orange-500 rotate-180'
                                            : 'text-orange-500/80'
                                        }`}
                                />
                            </button>

                            {/* Answer Content */}
                            <div className={`overflow-hidden transition-all duration-300 ${openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                                }`}>
                                <div className="px-6 pb-6">
                                    <div className="pl-14">
                                        <div className="w-full h-px bg-gradient-to-r from-orange-500/50 to-transparent mb-4"></div>
                                        <p className="text-orange-600/90 leading-relaxed">
                                            {faq.answer}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Bottom CTA */}
                <div className="mt-16 text-center">
                    <div className="bg-gradient-to-br from-white to-white/90 border border-white rounded-2xl p-8">
                        <h3 className="text-orange-500 text-2xl font-bold mb-4">Still have questions?</h3>
                        <p className="text-orange-600/90 mb-6 max-w-md mx-auto">
                            Our support team is here to help you get the most out of your TrainLink experience.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button className="bg-gradient-to-r from-orange-500 to-orange-400 hover:from-orange-600 hover:to-orange-500 text-white font-semibold py-3 px-6 rounded-full transition-all duration-300 hover:transform hover:scale-105">
                                Contact Support
                            </button>
                            <button className="border border-orange-500 text-orange-500 hover:bg-orange-500/10 font-semibold py-3 px-6 rounded-full transition-all duration-300">
                                View Help Center
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FAQSection;