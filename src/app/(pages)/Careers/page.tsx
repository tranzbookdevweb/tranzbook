import Image from "next/image";
import React from "react";
import CareerDriver from '../../../../public/CareerDriver.png'
import CargoDriver from '../../../../public/CargoTruckDriver.png'

function IndexPage() {
    return (
        <>
            <div className="md:mx-auto md:container px-4">
                <div className="pt-4 md:pt-5">
                    <div className="container mx-auto">
                        <div className="flex flex-wrap items-center pb-12">
                            <div className="md:w-1/2 lg:w-2/3 w-full xl:pr-20 md:pr-6">
                                <div className="py-2 text-color">
                                    <h1 className="text-2xl lg:text-4xl md:leading-snug tracking-tighter f-f-l font-black">Join the TranzBook Team!</h1>
                                    <h2 className="text-lg lg:text-xl lg:leading-7 md:leading-10 f-f-r py-4 md:py-8">Ready to be part of a company reshaping both travel and logistics across West Africa? At TranzBook, we’re on a mission to simplify and enhance cross-border transportation and logistics. Join us and help connect people and goods with ease and reliability across the region.</h2>
                                    <h3 className="text-lg lg:text-xl lg:leading-7 md:leading-10 f-f-r py-4 md:py-8">Why TranzBook?</h3>
                                    <ul className="list-disc ml-6">
                                        <li>Innovative Spirit: We leverage technology to streamline transportation and logistics.</li>
                                        <li>Customer Focus: We're dedicated to providing seamless, reliable experiences.</li>
                                        <li>Collaborative Culture: Join a passionate, diverse team that values your ideas.</li>
                                        <li>Growth-Driven: We're paving the way for the future of African transportation and logistics.</li>
                                    </ul>
                                    <h3 className="text-lg lg:text-xl lg:leading-7 md:leading-10 f-f-r py-4 md:py-8">What We Offer</h3>
                                    <ul className="list-disc ml-6">
                                        <li>Professional Development: Career advancement programs and in-depth training.</li>
                                        <li>Flexible Work Options: Work remotely and enjoy flexible hours.</li>
                                        <li>Health & Wellness Benefits: Comprehensive health coverage to keep you at your best.</li>
                                        <li>Travel and Shipping Discounts: Enjoy exclusive discounts on our services!</li>
                                    </ul>
                                    <h3 className="text-lg lg:text-xl lg:leading-7 md:leading-10 f-f-r py-4 md:py-8">Ready to Start Your Journey?</h3>
                                    <p>If you’re excited to contribute to a transformative journey in African transport and logistics, we want to hear from you! Check out our open positions below and see how you can make an impact with TranzBook.</p>
                                    <div className="flex items-center cursor-pointer pb-4 md:pb-0">
                                        <h3 className="f-f-r text-lg lg:text-2xl font-semibold underline text-indigo-700">Apply Now</h3>
                                        <div className="pl-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none">
                                                <path d="M13.1719 12L8.22192 7.04999L9.63592 5.63599L15.9999 12L9.63592 18.364L8.22192 16.95L13.1719 12Z" fill="#D53F8C" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="lg:w-1/3 md:w-1/2 w-full relative h-96 flex items-end justify-center">
                                <Image className="absolute w-full h-full inset-0 object-cover object-center rounded-md" src={CareerDriver} alt="" />
                                <div className="relative z-10 bg-white rounded shadow p-6 w-10/12 -mb-20">
                                    <div className="flex items-center justify-between w-full sm:w-full mb-8">
                                        <div className="flex items-center">
                                            <div className="p-4 bg-yellow-200 rounded-md">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-discount" width={32} height={32} viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                                    <path stroke="none" d="M0 0h24v24H0z" />
                                                    <line x1={9} y1={15} x2={15} y2={9} />
                                                    <circle cx="9.5" cy="9.5" r=".5" />
                                                    <circle cx="14.5" cy="14.5" r=".5" />
                                                    <path d="M5 7.2a2.2 2.2 0 0 1 2.2 -2.2h1a2.2 2.2 0 0 0 1.55 -.64l.7 -.7a2.2 2.2 0 0 1 3.12 0l.7 .7a2.2 2.2 0 0 0 1.55 .64h1a2.2 2.2 0 0 1 2.2 2.2v1a2.2 2.2 0 0 0 .64 1.55l.7 .7a2.2 2.2 0 0 1 0 3.12l-.7 .7a2.2 2.2 0 0 0 -.64 1.55 v1a2.2 2.2 0 0 1 -2.2 2.2h-1a2.2 2.2 0 0 0 -1.55 .64l-.7 .7a2.2 2.2 0 0 1 -3.12 0l-.7 -.7a2.2 2.2 0 0 0 -1.55 -.64h-1a2.2 2.2 0 0 1 -2.2 -2.2v-1a2.2 2.2 0 0 0 -.64 -1.55l-.7 -.7a2.2 2.2 0 0 1 0 -3.12l.7 -.7a2.2 2.2 0 0 0 .64 -1.55 v-1" />
                                                </svg>
                                            </div>
                                            <div className="ml-6">
                                                <h3 className="mb-1 leading-5 text-gray-800 font-bold text-2xl">Join Our Team</h3>
                                                <p className="text-gray-600 text-sm tracking-normal font-normal leading-5">Bus Drivers Needed</p>
                                            </div>
                                        </div>
                                        <div>
                                            <div className="flex items-center pl-3 text-green-400">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-trending-up" width={24} height={24} viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                                    <path stroke="none" d="M0 0h24v24H0z" />
                                                    <polyline points="3 17 9 11 13 15 21 7" />
                                                    <polyline points="14 7 21 7 21 14" />
                                                </svg>
                                                <p className="text-green-400 text-xs tracking-wide font-bold leading-normal pl-1">Apply Now</p>
                                            </div>
                                            <p className="font-normal text-xs text-right leading-4 text-green-400 tracking-normal">Urgent</p>
                                        </div>
                                    </div>
                                    <div className="relative mb-3">
                                        <hr className="h-1 rounded-sm bg-gray-200" />
                                        <hr className="absolute top-0 h-1 w-7/12 rounded-sm bg-indigo-700" />
                                    </div>
                                    <h4 className="text-base text-gray-600 font-normal tracking-normal leading-5">Join Our Team Today!</h4>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="pb-32 pt-16">
                    <div className="mx-auto">
                        <div className="flex flex-wrap flex-row-reverse items-center">
                            <div className="md:w-1/2 lg:w-2/3 w-full lg:pl-20 md:pl-10 sm:pl-0 pl-0">
                                <div className="py-2">
                                    <h1 className="text-2xl lg:text-4xl md:leading-snug tracking-tighter f-f-l font-black">Transport Logistics</h1>
                                    <h2 className="text-lg lg:text-xl lg:leading-7 md:leading-10 f-f-r py-4 md:py-8">TranzBook also provides specialized logistics services for heavy cargo and cross-border shipments. Looking for reliable drivers? We’re hiring!</h2>
                                </div>
                            </div>
                            <div className="lg:w-1/3 md:w-1/2 w-full relative flex items-end justify-center">
                                <Image className="absolute w-full h-94 inset-0 object-cover object-center rounded-md" src={CargoDriver} alt="" />
                                <div className="relative z-10 bg-white rounded shadow p-6 w-10/12 -mb-20">
                                    <div className="flex items-center justify-between w-full sm:w-full mb-8">
                                        <div className="flex items-center">
                                            <div className="p-4 bg-yellow-200 rounded-md">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-discount" width={32} height={32} viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                                    <path stroke="none" d="M0 0h24v24H0z" />
                                                    <line x1={9} y1={15} x2={15} y2={9} />
                                                    <circle cx="9.5" cy="9.5" r=".5" />
                                                    <circle cx="14.5" cy="14.5" r=".5" />
                                                    <path d="M5 7.2a2.2 2.2 0 0 1 2.2 -2.2h1a2.2 2.2 0 0 0 1.55 -.64l.7 -.7a2.2 2.2 0 0 1 3.12 0l.7 .7a2.2 2.2 0 0 0 1.55 .64h1a2.2 2.2 0 0 1 2.2 2.2v1a2.2 2.2 0 0 0 .64 1.55l.7 .7a2.2 2.2 0 0 1 0 3.12l-.7 .7a2.2 2.2 0 0 0 -.64 1.55 v1a2.2 2.2 0 0 1 -2.2 2.2h-1a2.2 2.2 0 0 0 -1.55 .64l-.7 .7a2.2 2.2 0 0 1 -3.12 0l-.7 -.7a2.2 2.2 0 0 0 -1.55 -.64h-1a2.2 2.2 0 0 1 -2.2 -2.2v-1a2.2 2.2 0 0 0 -.64 -1.55l-.7 -.7a2.2 2.2 0 0 1 0 -3.12l.7 -.7a2.2 2.2 0 0 0 .64 -1.55 v-1" />
                                                </svg>
                                            </div>
                                            <div className="ml-6">
                                                <h3 className="mb-1 leading-5 text-gray-800 font-bold text-2xl">Cargo Truck Driver</h3>
                                                <p className="text-gray-600 text-sm tracking-normal font-normal leading-5">Logistics Driver Positions</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="relative mb-3">
                                        <hr className="h-1 rounded-sm bg-gray-200" />
                                        <hr className="absolute top-0 h-1 w-7/12 rounded-sm bg-indigo-700" />
                                    </div>
                                    <h4 className="text-base text-gray-600 font-normal tracking-normal leading-5">Drive For TranzBook</h4>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default IndexPage;
