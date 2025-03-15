"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import {
  Building,
  MapPin,
  Phone,
  Mail,
  Globe,
  Star,
  MessageSquare,
  Award,
  Share2,
  CheckCircle,
  Camera,
  Users,
  Briefcase,
  Clock,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Define company interface to match API response and schema
interface Company {
  publicId: string;
  name: string;
  logo?: string;
  tagline?: string;
  description?: string;
  businessType: string;
  foundedYear?: number;
  address: {
    street: string;
    city: string;
    stateOrProvince: string;
    postalCodeOrZip: string;
    country: string;
  };
  phone: string;
  email: string;
  website?: string;
  socialMedia?: {
    facebook?: string;
    twitter?: string;
    linkedin?: string;
    instagram?: string;
  };
  services: string[];
  images: string[];
  testimonials?: {
    id: string;
    name: string;
    company: string;
    comment: string;
    rating: number;
    imageUrl?: string;
  }[];
  employees?: string[]; // Changed to string[] for counting
  certifications?: string[];
}

const PublicCompanyPage = () => {
  const { publicId } = useParams();
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeImage, setActiveImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchCompany = async () => {
      if (!publicId) {
        setError("No public ID provided");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/public/${publicId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Failed to fetch company data: ${errorText}`);
        }

        const data = await response.json();
        setCompany(data);
        if (data.images && data.images.length > 0) {
          setActiveImage(data.images[0]);
        }
      } catch (err) {
        console.error("Error fetching company:", err);
        setError("Failed to load company data");
      } finally {
        setLoading(false);
      }
    };

    fetchCompany();
  }, [publicId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-zinc-950">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-700 border-t-teal-500"></div>
          <p className="text-zinc-300">Loading company profile...</p>
        </div>
      </div>
    );
  }

  if (error || !company) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-zinc-950">
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 max-w-md">
          <Building className="h-12 w-12 text-amber-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white text-center mb-2">
            Company Not Found
          </h2>
          <p className="text-zinc-300 text-center mb-4">
            {error || "We couldn't find the company you're looking for."}
          </p>
          <Button className="w-full" onClick={() => window.history.back()}>
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const renderStars = (rating: number) => {
    return Array(5)
      .fill(0)
      .map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${
            i < rating ? "text-amber-400 fill-amber-400" : "text-zinc-600"
          }`}
        />
      ));
  };

  // Calculate years in business based on foundedYear
  const currentYear = new Date().getFullYear();
  const yearsInBusiness = company.foundedYear
    ? currentYear - company.foundedYear
    : null;

  // Count employees (assuming employees is an array)
  const employeeCount = company.employees ? company.employees.length : null;

  return (
    <div className="min-h-screen bg-zinc-950 pb-16">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-zinc-900 to-zinc-800 py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="relative h-32 w-32 md:h-40 md:w-40 rounded-full overflow-hidden border-4 border-teal-500 bg-zinc-800 flex-shrink-0">
              <Image
                src={company.logo || "/placeholder.svg?height=160&width=160"}
                alt={company.name}
                fill
                className="object-cover"
                priority
              />
            </div>
            <div className="text-center md:text-left">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                {company.name}
              </h1>
              <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-4">
                <Badge className="bg-teal-500 text-white">
                  {company.businessType}
                </Badge>
                {company.foundedYear && (
                  <Badge className="bg-zinc-700 text-zinc-100">
                    Est. {company.foundedYear}
                  </Badge>
                )}
              </div>
              {company.tagline && (
                <p className="text-lg text-zinc-300 mb-4">{company.tagline}</p>
              )}
              <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                <Button className="bg-teal-500 hover:bg-teal-600 text-white">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Contact Us
                </Button>
                <Button variant="outline" className="border-zinc-600">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
                {company.website && (
                  <Button
                    variant="outline"
                    className="border-zinc-600"
                    onClick={() => window.open(company.website, "_blank")}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Visit Website
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="bg-zinc-800 py-4 px-4 border-y border-zinc-700">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {yearsInBusiness !== null && (
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-teal-500/20 flex items-center justify-center flex-shrink-0">
                  <Clock className="h-5 w-5 text-teal-400" />
                </div>
                <div>
                  <p className="text-xl font-bold text-white">
                    {yearsInBusiness}
                  </p>
                  <p className="text-xs text-zinc-400">Years in Business</p>
                </div>
              </div>
            )}
            {employeeCount !== null && (
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-teal-500/20 flex items-center justify-center flex-shrink-0">
                  <Users className="h-5 w-5 text-teal-400" />
                </div>
                <div>
                  <p className="text-xl font-bold text-white">
                    {employeeCount}
                  </p>
                  <p className="text-xs text-zinc-400">Team Members</p>
                </div>
              </div>
            )}
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-teal-500/20 flex items-center justify-center flex-shrink-0">
                <Briefcase className="h-5 w-5 text-teal-400" />
              </div>
              <div>
                <p className="text-xl font-bold text-white">
                  {company.services.length}
                </p>
                <p className="text-xs text-zinc-400">Services Offered</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-teal-500/20 flex items-center justify-center flex-shrink-0">
                <Camera className="h-5 w-5 text-teal-400" />
              </div>
              <div>
                <p className="text-xl font-bold text-white">
                  {company.images.length}
                </p>
                <p className="text-xs text-zinc-400">Gallery Images</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Gallery Section - Moved to top, right after header */}
      {company.images && company.images.length > 0 && (
        <div className="container mx-auto max-w-6xl px-4 mt-8">
          <Card className="bg-zinc-900 border-zinc-800 overflow-hidden">
            <CardHeader className="bg-zinc-800/50 border-b border-zinc-700">
              <CardTitle className="text-xl text-white">Gallery</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              {/* Main Image */}
              {activeImage && (
                <div className="relative h-[300px] md:h-[400px] w-full mb-4 rounded-lg overflow-hidden">
                  <Image
                    src={activeImage || "/placeholder.svg"}
                    alt={`${company.name} featured image`}
                    fill
                    className="object-cover"
                  />
                </div>
              )}

              {/* Thumbnails */}
              <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2">
                {company.images.map((image, index) => (
                  <div
                    key={index}
                    className={`relative h-16 w-full cursor-pointer rounded-md overflow-hidden border-2 ${
                      activeImage === image
                        ? "border-teal-500"
                        : "border-transparent"
                    }`}
                    onClick={() => setActiveImage(image)}
                  >
                    <Image
                      src={image || "/placeholder.svg"}
                      alt={`${company.name} gallery thumbnail ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Content */}
      <div className="container mx-auto max-w-6xl px-4 mt-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content Area */}
          <div className="lg:w-2/3 space-y-8">
            {/* About Section */}
            <Card className="bg-zinc-900 border-zinc-800 overflow-hidden">
              <CardHeader className="bg-zinc-800/50 border-b border-zinc-700">
                <CardTitle className="text-xl text-white">About Us</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                {company.description ? (
                  <p className="text-zinc-300 leading-relaxed">
                    {company.description}
                  </p>
                ) : (
                  <p className="text-zinc-500 italic">
                    No company description available.
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Services Section */}
            {company.services && company.services.length > 0 && (
              <Card className="bg-zinc-900 border-zinc-800 overflow-hidden">
                <CardHeader className="bg-zinc-800/50 border-b border-zinc-700">
                  <CardTitle className="text-xl text-white">
                    Our Services
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    {company.services.map((service, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-3 p-3 rounded-lg bg-zinc-800/50 hover:bg-zinc-800 transition-colors"
                      >
                        <div className="h-8 w-8 rounded-full bg-teal-500/20 flex items-center justify-center mt-0.5 flex-shrink-0">
                          <CheckCircle className="h-4 w-4 text-teal-400" />
                        </div>
                        <div>
                          <h3 className="font-medium text-white">{service}</h3>
                          <p className="text-sm text-zinc-400 mt-1">
                            Professional {service.toLowerCase()} services
                            tailored to your needs.
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Testimonials Section */}
            {company.testimonials && company.testimonials.length > 0 && (
              <Card className="bg-zinc-900 border-zinc-800 overflow-hidden">
                <CardHeader className="bg-zinc-800/50 border-b border-zinc-700">
                  <CardTitle className="text-xl text-white">
                    Client Testimonials
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    {company.testimonials.map((testimonial) => (
                      <Card
                        key={testimonial.id}
                        className="bg-zinc-800 border-zinc-700"
                      >
                        <CardContent className="pt-6">
                          <div className="flex items-center gap-4 mb-4">
                            <Avatar className="h-12 w-12">
                              <AvatarImage
                                src={testimonial.imageUrl}
                                alt={testimonial.name}
                              />
                              <AvatarFallback className="bg-teal-500 text-white">
                                {testimonial.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="font-medium text-white">
                                {testimonial.name}
                              </h3>
                              <p className="text-sm text-zinc-400">
                                {testimonial.company}
                              </p>
                            </div>
                          </div>
                          <div className="flex mb-3">
                            {renderStars(testimonial.rating)}
                          </div>
                          <p className="text-zinc-300 italic">
                            "{testimonial.comment}"
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:w-1/3 space-y-6">
            {/* Contact Card */}
            <Card className="bg-zinc-900 border-zinc-800 overflow-hidden">
              <CardHeader className="bg-zinc-800/50 border-b border-zinc-700">
                <CardTitle className="text-xl text-white">Contact Us</CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-teal-400 mt-0.5 flex-shrink-0" />
                  <div className="text-zinc-300">
                    {company.address.street}
                    <br />
                    {company.address.city}, {company.address.stateOrProvince}{" "}
                    {company.address.postalCodeOrZip}
                    <br />
                    {company.address.country}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-teal-400 flex-shrink-0" />
                  <a
                    href={`tel:${company.phone}`}
                    className="text-zinc-300 hover:text-teal-400"
                  >
                    {company.phone}
                  </a>
                </div>

                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-teal-400 flex-shrink-0" />
                  <a
                    href={`mailto:${company.email}`}
                    className="text-zinc-300 hover:text-teal-400 break-all"
                  >
                    {company.email}
                  </a>
                </div>

                {company.website && (
                  <div className="flex items-center gap-3">
                    <Globe className="h-5 w-5 text-teal-400 flex-shrink-0" />
                    <a
                      href={company.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-teal-400 hover:underline break-all"
                    >
                      {company.website.replace(/^https?:\/\//, "")}
                    </a>
                  </div>
                )}

                <Button className="w-full bg-teal-500 hover:bg-teal-600 text-white mt-4">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Send Message
                </Button>
              </CardContent>
            </Card>

            {/* Social Media Card */}
            {company.socialMedia && (
              <Card className="bg-zinc-900 border-zinc-800 overflow-hidden">
                <CardHeader className="bg-zinc-800/50 border-b border-zinc-700">
                  <CardTitle className="text-xl text-white">
                    Connect With Us
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-2 gap-4">
                    {company.socialMedia.facebook && (
                      <a
                        href={company.socialMedia.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 rounded-lg bg-zinc-800/50 hover:bg-zinc-800 transition-colors"
                      >
                        <div className="h-10 w-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                          <svg
                            className="h-5 w-5 text-blue-400"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                          </svg>
                        </div>
                        <div>
                          <p className="font-medium text-white">Facebook</p>
                          <p className="text-xs text-zinc-400">Follow Us</p>
                        </div>
                      </a>
                    )}

                    {company.socialMedia.twitter && (
                      <a
                        href={company.socialMedia.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 rounded-lg bg-zinc-800/50 hover:bg-zinc-800 transition-colors"
                      >
                        <div className="h-10 w-10 rounded-full bg-sky-500/20 flex items-center justify-center">
                          <svg
                            className="h-5 w-5 text-sky-400"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                          </svg>
                        </div>
                        <div>
                          <p className="font-medium text-white">Twitter</p>
                          <p className="text-xs text-zinc-400">Follow Us</p>
                        </div>
                      </a>
                    )}

                    {company.socialMedia.linkedin && (
                      <a
                        href={company.socialMedia.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 rounded-lg bg-zinc-800/50 hover:bg-zinc-800 transition-colors"
                      >
                        <div className="h-10 w-10 rounded-full bg-blue-600/20 flex items-center justify-center">
                          <svg
                            className="h-5 w-5 text-blue-500"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                          </svg>
                        </div>
                        <div>
                          <p className="font-medium text-white">LinkedIn</p>
                          <p className="text-xs text-zinc-400">Connect</p>
                        </div>
                      </a>
                    )}

                    {company.socialMedia.instagram && (
                      <a
                        href={company.socialMedia.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 rounded-lg bg-zinc-800/50 hover:bg-zinc-800 transition-colors"
                      >
                        <div className="h-10 w-10 rounded-full bg-pink-500/20 flex items-center justify-center">
                          <svg
                            className="h-5 w-5 text-pink-400"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" />
                          </svg>
                        </div>
                        <div>
                          <p className="font-medium text-white">Instagram</p>
                          <p className="text-xs text-zinc-400">Follow Us</p>
                        </div>
                      </a>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Certifications Card */}
            {company.certifications && company.certifications.length > 0 && (
              <Card className="bg-zinc-900 border-zinc-800 overflow-hidden">
                <CardHeader className="bg-zinc-800/50 border-b border-zinc-700">
                  <CardTitle className="text-xl text-white">
                    Certifications
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-3">
                    {company.certifications.map((cert, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-2 rounded-lg bg-zinc-800/50"
                      >
                        <div className="h-8 w-8 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                          <Award className="h-4 w-4 text-amber-400" />
                        </div>
                        <span className="text-zinc-300">{cert}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Quick Links Card */}
            <Card className="bg-zinc-900 border-zinc-800 overflow-hidden">
              <CardHeader className="bg-zinc-800/50 border-b border-zinc-700">
                <CardTitle className="text-xl text-white">
                  Quick Links
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-zinc-300 hover:text-white hover:bg-zinc-800"
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Contact Us
                    <ChevronRight className="h-4 w-4 ml-auto" />
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-zinc-300 hover:text-white hover:bg-zinc-800"
                  >
                    <Briefcase className="h-4 w-4 mr-2" />
                    Our Services
                    <ChevronRight className="h-4 w-4 ml-auto" />
                  </Button>
                  {company.website && (
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-zinc-300 hover:text-white hover:bg-zinc-800"
                      onClick={() => window.open(company.website, "_blank")}
                    >
                      <Globe className="h-4 w-4 mr-2" />
                      Visit Website
                      <ChevronRight className="h-4 w-4 ml-auto" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicCompanyPage;
