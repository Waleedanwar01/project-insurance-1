// components/ArticleLayout.js - Collapsible TOC (Accordion Style)
"use client"
import React, { useEffect, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import Image from 'next/image';
import { getCarInsuranceQuotesPage } from '@/lib/api/pages';
// State pulled from API
const defaultTitle = 'Car Insurance Quotes';
const defaultLastUpdated = 'May 29, 2023';

// 1. Use State to manage which FAQ item is open (We use the index)
// --- END TABLE DATA ---
const ArticleLayout = () => {
    const [openIndex, setOpenIndex] = useState(null);
    const [loading, setLoading] = useState(true);
    const [title, setTitle] = useState(defaultTitle);
    const [lastUpdated, setLastUpdated] = useState(defaultLastUpdated);
    const [introParagraphs, setIntroParagraphs] = useState([]);
    const [takeaways, setTakeaways] = useState([]);
    const [stateInsuranceData, setStateInsuranceData] = useState([]);
    const [faqsData, setFaqsData] = useState([]);
    const [authorName, setAuthorName] = useState('');
    const [authorBio, setAuthorBio] = useState('');
    const [authorImageUrl, setAuthorImageUrl] = useState('/images/james-shaffer.png');

    useEffect(() => {
        let ignore = false;
        async function load() {
            try {
                const data = await getCarInsuranceQuotesPage();
                if (ignore) return;
                setTitle(data?.title || defaultTitle);
                setLastUpdated(
                    data?.last_updated ? new Date(data.last_updated).toLocaleDateString() : defaultLastUpdated
                );
                setIntroParagraphs(Array.isArray(data?.intro_paragraphs) ? data.intro_paragraphs : []);
                setTakeaways(Array.isArray(data?.takeaways) ? data.takeaways : []);
                setStateInsuranceData(Array.isArray(data?.state_insurance_data) ? data.state_insurance_data : []);
                setFaqsData(Array.isArray(data?.faqs) ? data.faqs : []);
                setAuthorName(data?.author_name || 'James Shaffer');
                setAuthorBio(
                    data?.author_bio ||
                    'James Shaffer is a writer for InsurancePanda.com and a well-seasoned auto insurance industry veteran.'
                );
                setAuthorImageUrl(data?.author_image_url || '/images/james-shaffer.png');
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        }
        load();
        return () => { ignore = true };
    }, []);
    const toggleItem = (index) => setOpenIndex(index === openIndex ? null : index);

    // 1. Use State to manage the collapse/expand feature
    const [isOpen, setIsOpen] = useState(true); // Set to true to be open by default
    const toggleTOC = () => setIsOpen(!isOpen);

    return (
        <div className="min-h-screen bg-white flex justify-center py-12 px-4 sm:px-6 lg:px-8">

            <div className="max-w-4xl w-full">

                <article className="space-y-6 lg:space-y-8">

                    <header className="pb-4 border-b border-gray-200">
                        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight">
                            {title}
                        </h1>
                        <p className="mt-2 text-sm text-gray-500 font-medium">
                            Last Updated on {lastUpdated}
                        </p>
                    </header>

                    <section className="text-lg text-gray-700 leading-relaxed space-y-6">
                        {(introParagraphs.length ? introParagraphs : []).map((p, idx) => (
                            <p key={idx}>{p}</p>
                        ))}
                    </section>

                    <aside className="bg-gray-50 border-l-4 border-red-600 p-6 rounded-r-md shadow-sm">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Key Takeaways:</h2>
                        <ul className="list-disc list-outside text-gray-700 leading-relaxed space-y-4 pl-5">
                            {(takeaways.length ? takeaways : []).map((t, idx) => (
                                <li key={idx}>{t}</li>
                            ))}
                        </ul>
                    </aside>

                    {/* === 4. Collapsible Table of Contents (TOC) === */}
                    <div className="py-6">
                        <div className="border border-gray-300 rounded-lg bg-white shadow-md">

                            {/* TOC Header/Button */}
                            <button
                                onClick={toggleTOC}
                                className="w-full text-left p-6 flex justify-between items-center text-lg font-bold text-gray-800 hover:bg-gray-50 transition duration-150 rounded-t-lg focus:outline-none"
                                aria-expanded={isOpen}
                                aria-controls="toc-list"
                            >
                                Table Of Contents
                                <svg
                                    className={`w-5 h-5 transition-transform duration-300 ${isOpen ? 'transform rotate-180' : ''} text-red-600`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                                </svg>
                            </button>

                            {/* Collapsible Content Area */}
                            <div
                                id="toc-list"
                                className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? 'max-h-fit p-6 pt-0' : 'max-h-0'}`}
                            >
                                {/* Main TOC List */}
                                <ul className="space-y-2 text-base">
                                    <li>
                                        <a href="#how-it-works" className="text-gray-700 hover:text-red-600">How Does Insurance Panda Work?</a>
                                        <ul className="mt-2 space-y-1 ml-4 list-disc list-inside">
                                            <li><a href="#three-step" className="text-gray-600 hover:text-red-600 text-sm">It’s a Three-Step Process:</a></li>
                                        </ul>
                                    </li>

                                    <li>
                                        <a href="#quote-calculation" className="text-gray-700 hover:text-red-600">How Are Your Car Insurance Quotes Calculated?</a>
                                        <ul className="mt-2 space-y-1 ml-4 list-disc list-inside">
                                            <li><a href="#major-factors" className="text-gray-600 hover:text-red-600 text-sm">The Major Factors that Can Determine Your Rates</a></li>
                                        </ul>
                                    </li>

                                    <li>
                                        <a href="#faq" className="text-gray-700 hover:text-red-600">Frequently Asked Questions About Insurance Quotes</a>
                                        <ul className="mt-2 space-y-1 ml-4">
                                            <li className="list-disc list-inside"><a href="#safe-online" className="text-gray-600 hover:text-red-600 text-sm">Is getting a car insurance quote online safe?</a></li>
                                            <li className="list-disc list-inside"><a href="#credit-check" className="text-gray-600 hover:text-red-600 text-sm">Do you need a credit check to get a car insurance quote online?</a></li>
                                            <li className="list-disc list-inside"><a href="#free-quote" className="text-gray-600 hover:text-red-600 text-sm">Is getting a car insurance quote online free?</a></li>
                                            <li className="list-disc list-inside"><a href="#personal-info" className="text-gray-600 hover:text-red-600 text-sm">Do you need to use your personal information to get an insurance quote?</a></li>
                                            <li className="list-disc list-inside"><a href="#ssn" className="text-gray-600 hover:text-red-600 text-sm">Do you need to provide your social security number (SSN) to get an insurance quote?</a></li>
                                        </ul>
                                    </li>

                                    <li><a href="#validity" className="text-gray-700 hover:text-red-600">How long are car insurance quotes valid for?</a></li>
                                    <li><a href="#high-quotes" className="text-gray-700 hover:text-red-600">Why are my car insurance quotes so high?</a></li>
                                    <li><a href="#save-premiums" className="text-gray-700 hover:text-red-600">Are You Ready to Save on Your Auto Insurance Premiums?</a></li>
                                </ul>
                            </div>

                        </div>
                    </div>


                    {/* 2. SECTION: What Is Insurance Panda? */}
                    <section className="py-0">
                        <h2 className="text-2xl font-bold mb-4 text-red-500">
                            What Is Insurance Panda?
                        </h2>

                        {/* Adjusting layout for a simpler, less graphical look, closer to the source image's text column */}
                        <div className="text-gray-600 leading-relaxed">
                            <p className="mb-6">
                                Insurance Panda is your go-to platform for finding reliable and affordable car insurance.
                                As a trusted leader in the industry, we’re dedicated to helping you find comprehensive coverage
                                options starting at low rates. Our commitment to simplicity and transparency makes securing your
                                insurance straightforward and stress-free.
                            </p>

                            <h3 className="text-lg font-bold mb-3 text-gray-700">
                                Using Insurance Panda is a simple three-step process:
                            </h3>
                            {/* Using a simple list style to mimic the original bullet-point feel */}
                            <ul className="list-disc ml-6 space-y-1 text-gray-700 font-medium">
                                <li>Enter your zip code</li>
                                <li>Enter some basic information</li>
                                <li>Compare auto insurance rates and find the cheapest one</li>
                            </ul>

                            {/* Placeholder for the video embed at the bottom of the section content */}
                            <p className="text-gray-600 mt-6 mb-4">
                                To get a better idea of how Insurance Panda works, check out this video:
                            </p>
                            {/* === VIDEO EMBED CODE START === */}
                            {/* Responsive 16:9 video wrapper (requires @tailwindcss/aspect-ratio plugin if not using Tailwind 3.0+ native utilities) */}
                            <div className="relative pt-[30.25%]"> {/* pt-[56.25%] forces a 16:9 aspect ratio */}
                                <iframe
                                    className="absolute top-0 left-0 w-fit h-fit md:w-100 md:h-60  rounded-lg shadow-xl"
                                    src="https://www.youtube.com/embed/x7KLhLn7HeY?si=GjMQXIRB4wDWOq6M"
                                    title="YouTube video player"
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                    referrerPolicy="strict-origin-when-cross-origin"
                                    allowFullScreen
                                ></iframe>
                                <p className='text-gray-600 mt-16 md:mt-0'>
                                    It works like this – once you give us your basic information, we send it to the insurance companies fighting for your business. They will run their risk assessment calculations and shoot their quotes back to us. We will then present them to you so you can decide which company to go with.

                                    This is the most painless way to shop for auto insurance as a consumer. Let us do all the heavy lifting for you and get the insurance companies scrambling for your business. Remember – the consumer always gets the best price when the competition is fierce.
                                </p>
                            </div>
                            {/* === VIDEO EMBED CODE END === */}
                        </div>
                    </section>
                    {/* === 3. SECTION: How Are Your Car Insurance Quotes Calculated? === */}
                    <section id="quote-calculation" className="py-8">
                        <h2 className="text-3xl font-bold mb-6 text-gray-900 border-b border-red-200 pb-2">
                            How Are Your Car Insurance Quotes Calculated?
                        </h2>

                        <div className="text-lg text-gray-700 leading-relaxed space-y-6">
                            <p>
                                As mentioned above, the Insurance Panda quote tool will calculate your insurance quote for you. But how exactly are these insurance rates determined? Which factors can play a role in determining your auto insurance rates?
                            </p>

                            <h3 id="major-factors" className="text-xl font-bold mb-3 text-gray-800 pt-4">
                                The Major Factors That Can Determine Your Rates
                            </h3>
                            <p className="mb-6">
                                Car insurance companies consider thousands of factors when calculating car insurance premiums. Here are some of the most important factors that go into your premiums:
                            </p>

                            {/* Sub-Factors List */}
                            <div className="space-y-6 pl-4 border-l-4 border-red-300">
                                {/* 3.1 Your Vehicle's Value */}
                                <div>
                                    <h4 className="text-xl font-bold text-gray-900 mb-2">
                                        Your Vehicle's Value
                                    </h4>
                                    <p className="text-gray-600">
                                        Certain <strong className="font-semibold">types of vehicles</strong> are more expensive to insure than others. For example, a Maserati is generally more expensive to insure than a <strong className="font-semibold">Honda Civic</strong>. Your vehicle’s value can significantly raise your collision and comprehensive coverage premiums. It costs more to repair a higher-end vehicle, and these costs get passed from the insurer to the policyholder.
                                    </p>
                                </div>

                                {/* 3.2 Your Vehicle Type and Size */}
                                <div>
                                    <h4 className="text-xl font-bold text-gray-900 mb-2">
                                        Your Vehicle Type and Size
                                    </h4>
                                    <p className="text-gray-600">
                                        The size and type of your vehicle can impact your liability insurance premiums. Why? Well, certain cars can cause more damage than others. A Ford F-350 driving at 65mph can cause significant damage to anything it encounters, for example, while a Ford Fiesta will not.
                                    </p>
                                </div>

                                {/* 3.3 Your Vehicle's Safety Rating */}
                                <div>
                                    <h4 className="text-xl font-bold text-gray-900 mb-2">
                                        Your Vehicle's Safety Rating
                                    </h4>
                                    <p className="text-gray-600">
                                        Your vehicle’s safety rating can also impact insurance premiums. Your insurer may be required to <a href="#" className="text-red-600 hover:text-red-800 font-medium hover:underline">pay for medical bills after an accident</a>. Your insurer may also need to cover death benefits for you or your passengers. A vehicle with a good safety rating is less likely to leave passengers dead or seriously injured, which can reduce costs for insurers.
                                    </p>
                                </div>
                                <div>
                                    <h4 className="text-xl font-bold text-gray-900 mb-2">
                                        Repair Costs
                                    </h4>
                                    <p className="text-gray-600">
                                        Certain vehicles are more expensive to repair than others. Popular models, including major domestic and important models, are the cheapest to repair. Repair shops have plenty of parts on hand and firsthand experience dealing with these types of vehicles. An exotic, less-popular vehicle is more expensive to repair. It may need to visit a specialty repair shop, for example. That means higher repair costs for your insurer and higher premiums for you.
                                    </p>
                                </div>
                                <div>
                                    <h4 className="text-xl font-bold text-gray-900 mb-2">
                                        Your State

                                    </h4>
                                    <div className="text-gray-600 space-y-4">
                                        <p>
                                        Certain vehicles are more expensive to repair than others. Popular models, including major domestic and important models, are the cheapest to repair. Repair shops have plenty of parts on hand and firsthand experience dealing with these types of vehicles. An exotic, less-popular vehicle is more expensive to repair. It may need to visit a specialty repair shop, for example. That means higher repair costs for your insurer and higher premiums for you.Insurance laws in the United States are governed at the state level. Today, drivers in the most expensive states pay 2x to 3x as much for car insurance as drivers in the least expensive states. For example, certain states, including Maine, North Carolina, and Virginia, are consistently among the cheapest states for car insurance, with drivers paying less than $600 per year on average. Other states, like Michigan, Louisiana, and Florida, are all some of the most expensive states for car insurance, with drivers paying over $1,200 per year. Why is there such a big difference? Some states use no-fault insurance systems. Others require higher or lower coverage limits. Some states have high rates of accidents, bad weather, or insurance fraud.
                                        </p>
                                        <p>
                                            The following table shows the liability requirements and average insurance rates by state. The states with higher insurance requirements usually have higher average insurance rates. Note that the requirements are presented in a three-number format (i.e., 30/50/30). Using this format, 30/50/30 means you must carry $30,000 bodily injury liability coverage (BIL) per person, $50,000 BIL per accident, and $30,000 in property damage liability coverage.
                                        </p>
                                    </div>
                                </div>
                                {/* Add More Sub-Factors Here (e.g., Your Location, Your Driving Record, etc.) if the full article includes them */}
                            </div>
                        </div>

                        <section className="py-8">
                            <h2 className="text-3xl font-bold mb-6 text-gray-900 border-b border-red-600 pb-2">
                                State Insurance Requirements and Average Rates
                            </h2>

                            <div className="overflow-x-auto shadow-lg rounded-lg border border-gray-200">
                                <table className="min-w-full divide-y divide-gray-200">
                                    {/* Table Header */}
                                    <thead className="bg-red-600 text-white">
                                        <tr>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider"
                                            >
                                                State
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider"
                                            >
                                                Insurance Requirements
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider"
                                            >
                                                Avg Min Coverage Rates ($)
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider"
                                            >
                                                Avg Full Coverage Rates ($)
                                            </th>
                                        </tr>
                                    </thead>
                                    {/* Table Body */}
                                    <tbody className="bg-white divide-y divide-gray-100">
                                        {stateInsuranceData.map((data, index) => (
                                            <tr key={data.state} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    {data.state}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                    {data.reqs}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-600">
                                                    {Number(data.minRate).toLocaleString('en-US')}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-600">
                                                    {Number(data.fullRate).toLocaleString('en-US')}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Table Note */}
                            <div className="mt-4 p-4 bg-gray-50 text-sm text-gray-700 border-l-4 border-red-500 rounded-sm">
                                <p className="font-semibold">*Note:</p>
                                <p>Auto insurance isn’t required in New Hampshire. If you do buy a policy, however, the minimum coverage you can buy is 25/50/25.</p>
                            </div>
                        </section>

                        {/* === 5. SECTION: Continuation of Major Factors Determining Rates (Full List) === */}
                        <section className="py-8 border-t border-gray-200 mt-8">
                            <h2 className="text-3xl font-bold mb-6 text-gray-900 border-b border-red-200 pb-2">
                                Additional Factors Influencing Your Car Insurance Premiums
                            </h2>

                            <div className="text-lg text-gray-700 leading-relaxed space-y-8">

                                {/* 5.1 Your ZIP Code */}
                                <div className="space-y-2">
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                                        Your ZIP Code
                                    </h3>
                                    <p className="text-gray-600">
                                        Certain ZIP codes have higher rates of break-ins and vandalism than other neighborhoods. Some ZIP codes have high accident rates or fatality rates. Your **ZIP code** plays a significant role in calculating insurance premiums.
                                    </p>
                                </div>

                                {/* 5.2 Where You Park Your Car at Night */}
                                <div className="space-y-2">
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                                        Where You Park Your Car at Night
                                    </h3>
                                    <p className="text-gray-600">
                                        Where do you park your car at night? Is it stored in a locked garage? Or is it parked on the street? Many insurance companies offer discounts based on your vehicle’s **parking location**.
                                    </p>
                                </div>

                                {/* 5.3 Your Coverage */}
                                <div className="space-y-2">
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                                        Your Coverage
                                    </h3>
                                    <p className="text-gray-600">
                                        Do you want the bare minimum liability coverage that lets you legally drive on the road? Or do you want <strong className="font-semibold">full coverage</strong> with high limits? Most states only require you to have property damage and bodily injury liability coverage. Many drivers, however, opt for full coverage car insurance, which includes liability, collision, and comprehensive coverage. Adding collision and comprehensive coverage can cause rates to double or triple.
                                    </p>
                                </div>

                                {/* 5.4 Your Driving Record */}
                                <div className="space-y-2">
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                                        Your Driving Record
                                    </h3>
                                    <p className="text-gray-600">
                                        A driver with a <strong className="font-semibold">long history of safe driving</strong> will pay less for car insurance than a driver with two at-fault claims in the last five years. Insurers check your driving history to determine your risk as a driver. Generally, your driving history only goes back five to seven years. However, more severe violations – like DUIs or reckless driving citations – may last ten years. The more speeding tickets, citations, accidents, and claims you have on your record, the more you’ll pay for car insurance.
                                    </p>
                                </div>

                                {/* 5.5 Your Credit Score */}
                                <div className="space-y-2">
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                                        Your Credit Score
                                    </h3>
                                    <p className="text-gray-600">
                                        Yes, your credit score impacts car insurance premiums. Insurers use something called <strong className="font-semibold">your credit-based insurance score</strong> to assess your insurance premiums. Drivers with a higher (better) credit score will always pay less for car insurance than drivers with a lower (worse) credit score, all other things being equal.
                                    </p>
                                </div>

                                {/* 5.6 Discounts */}
                                <div className="space-y-2">
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                                        Discounts
                                    </h3>
                                    <p className="text-gray-600">
                                        Some drivers qualify for <strong className="font-semibold">an extensive range of discounts</strong>, while others won’t qualify for any. Homeowners can enjoy <strong className="font-semibold">bundling discounts</strong>, for example, and students can earn good grade discounts. Most insurance companies offer dozens of discounts, so check with your insurer to see if you qualify.
                                    </p>
                                </div>

                                {/* 5.7 Your Age */}
                                <div className="space-y-2">
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                                        Your Age
                                    </h3>
                                    <p className="text-gray-600">
                                        It’s no secret that younger drivers pay **higher rates for car insurance**. On average, drivers in their teens pay around $$3,500$ per year for car insurance. As you get older and gain more experience, car insurance premiums gradually drop. Assuming you maintain a clean record, you’ll pay your lowest insurance rates between ages **30 and 70**. However, insurance premiums may rise slightly as you move into your 70s and 80s.
                                    </p>
                                </div>

                                {/* 5.8 Marital Status */}
                                <div className="space-y-2">
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                                        Marital Status
                                    </h3>
                                    <p className="text-gray-600">
                                        <strong className="font-semibold">Married drivers</strong> pay less for car insurance than single drivers, especially at a younger age. Statistics show that married drivers are less likely to make a claim, which makes them less risky to insure.
                                    </p>
                                </div>

                                {/* 5.9 Homeowner Status */}
                                <div className="space-y-2">
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                                        Homeowner Status
                                    </h3>
                                    <p className="text-gray-600">
                                        Renters generally pay higher insurance premiums than <strong className="font-semibold">homeowners</strong>. With most insurers, this difference isn’t significant (about $$30$ to $$50$ per year). However, homeowners can also take advantage of homeowners’ insurance bundling opportunities to save even more money.
                                    </p>
                                </div>

                                {/* 5.10 Education */}
                                <div className="space-y-2">
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                                        Education
                                    </h3>
                                    <p className="text-gray-600">
                                        Statistics show that drivers with post-secondary degrees are less likely to make a claim. They’re safer drivers who are less risky to insure. The more education you have, the more you’ll save. For example, a driver with a high school diploma will pay less than a driver without one. Rates continue dropping as you get a <strong className="font-semibold">bachelor’s degree</strong>, <strong className="font-semibold">master’s degree</strong>, and **Ph.D**.
                                    </p>
                                </div>

                                {/* 5.11 Telematics and Driver Tracking Systems */}
                                <div className="space-y-2">
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                                        Telematics and Driver Tracking Systems
                                    </h3>
                                    <p className="text-gray-600">
                                        Today, most major insurance companies in America offer some **driver tracking or ‘telematics’ system**. If you agree to use this system, the insurance company could drop rates as much as **25%** based on your safe driving habits. You install a tracking device that analyzes your mileage, driving times, braking and acceleration, and more. Based on this data, the insurance company will charge customized premiums.
                                    </p>
                                </div>

                                {/* 5.12 Violations */}
                                <div className="space-y-2">
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                                        Violations
                                    </h3>
                                    <p className="text-gray-600">
                                        Speeding tickets, <strong className="font-semibold">DUIs</strong>, and <strong className="font-semibold">other incidents</strong> will significantly impact insurance premiums. A single DUI, for example, could raise insurance premiums as much as **50%**, and DUIs remain on your record for up to ten years. Less serious violations, like speeding tickets, may also impact premiums, although not as much.
                                    </p>
                                </div>

                                {/* 5.13 Annual Mileage */}
                                <div className="space-y-2">
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                                        Annual Mileage
                                    </h3>
                                    <p className="text-gray-600">
                                        The average American drives approximately **10,000 miles** annually (although this figure varies by region). Insurance companies will assume you drive the average number of miles per year and will charge you based on that number. However, some people are retired or work from home. Others bike or walk to work. In this case, <strong className="font-semibold">your annual mileage</strong> may be significantly less than the average.
                                    </p>
                                </div>

                                {/* 5.14 Driving Times */}
                                <div className="space-y-2">
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                                        Driving Times
                                    </h3>
                                    <p className="text-gray-600">
                                        Some people only drive outside of rush hour. If you work from home, for example, you might prefer to shop during the day and get out on weekends. You avoid the 9 to 5 rush hour chaos. This significantly lowers your risk of making a claim. Insurance companies may consider this information when calculating insurance premiums.
                                    </p>
                                </div>

                                {/* Concluding Paragraph */}
                                <p className="mt-8 text-base text-gray-800 p-4 border-t border-b border-red-100 bg-red-50 rounded-md">
                                    To learn more about how to save on your insurance and which factors affect your insurance rates, explore the <a href={SITE_URL ? `${SITE_URL}/insurance-guide/` : "/insurance-guide/"} className="text-red-600 hover:text-red-800 font-medium hover:underline">insurance guide at InsurancePanda.com</a>. We will equip you with all the tools you need to make an informed decision about your auto insurance coverage.
                                </p>

                            </div>
                        </section>

                        {/* === 6. Collapsible FAQ Section (Accordion) === */}
                        <section id="faq" className="py-8">
                            <h2 className="text-3xl font-bold mb-6 text-gray-900 border-b border-red-600 pb-2">
                                Frequently Asked Questions About Insurance Quotes
                            </h2>

                            <div className="space-y-4">

                                {faqsData.map((item, index) => {
                                    const isItemOpen = index === openIndex;

                                    return (
                                        <div key={item.id} className="border border-gray-300 rounded-lg overflow-hidden">
                                            <button
                                                onClick={() => toggleItem(index)}
                                                className="w-full text-left p-4 flex justify-between items-center text-base font-semibold text-gray-800 hover:bg-red-50 transition duration-150 focus:outline-none"
                                                aria-expanded={isItemOpen}
                                                aria-controls={`faq-answer-${item.id}`}
                                            >
                                                {item.question}
                                                <ChevronDown
                                                    className={`w-5 h-5 transition-transform duration-300 ${isItemOpen ? 'transform rotate-180 text-red-600' : 'text-gray-500'}`}
                                                />
                                            </button>

                                            <div
                                                id={`faq-answer-${item.id}`}
                                                className={`transition-all duration-300 ease-in-out overflow-hidden ${isItemOpen ? 'max-h-screen p-4 pt-0 border-t border-gray-200' : 'max-h-0'}`}
                                                style={{
                                                    // Optional: for better transition performance, though max-h-screen/max-h-0 usually works well with Tailwind.
                                                    maxHeight: isItemOpen ? '500px' : '0'
                                                }}
                                            >
                                                <p className="text-sm text-gray-600 leading-relaxed">
                                                    {item.answer}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </section>
                        {/* === 7. Concluding Section / Call to Action and Author Bio === */}
                        <section id="save-premiums" className="py-8 space-y-8">


                            {/* Author Bio */}
                            <div className="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-4 p-6 border border-gray-200 rounded-lg shadow-md bg-white">
                                {/* Author Image/Placeholder */}
                                <div className="flex-shrink-0">
                                    {/* The image should be replaced with an <Image> component in a Next.js environment */}
                                    {/* Author Image using Next.js Image Component */}
                                    <div className="flex-shrink-0">
                                        <Image
                                            src={authorImageUrl}
                                            alt={`${authorName} profile picture`}
                                            width={64}
                                            height={64}
                                            className="rounded-full object-cover"
                                        />
                                    </div>                                </div>

                                <div className="flex-1 min-w-0">
                                    <h3 className="text-xl font-bold text-gray-900 mb-1">
                                        {authorName}
                                    </h3>
                                    <p className="text-sm text-gray-600 leading-relaxed">
                                        {authorBio}
                                    </p>
                                </div>
                            </div>

                        </section>
                    </section>
                </article>

            </div>
        </div>
    );
};

export default ArticleLayout;
import { SITE_URL } from "@/lib/config";