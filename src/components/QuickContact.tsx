import { useState, useEffect, useRef } from "react";
import { Send, MapPin, Mail, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { FloatingMolecules } from "@/components/FloatingMolecules";

export const QuickContact = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload = {
      formType: 'contact',
      name: formData.name,
      email: formData.email,
      subject: formData.subject,
      message: formData.message,
    };

    try {
      const res = await fetch('http://localhost:5000/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      
      if (res.ok) {
        toast.success("Message sent successfully! We'll get back to you soon.");
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        toast.error("Failed to send message. Please try again.");
      }
    } catch (error) {
      console.error('Error sending email:', error);
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: "Visit Us",
      details: ["3rd floor, No.76, East Power House Road", "Gandhipuram, Coimbatore - 641012"],
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: Mail,
      title: "Email Us",
      details: ["info@dropschemicals.com", "sales@dropschemicals.com"],
      color: "from-green-500 to-green-600"
    },
    {
      icon: Clock,
      title: "Business Hours",
      details: ["Monday - Saturday: 9:00 AM - 8:00 PM", "Sunday: Closed"],
      color: "from-purple-500 to-purple-600"
    }
  ];

  return (
    <section 
      ref={sectionRef}
      className="relative py-20 premium-page-bg text-white"
      style={{
        backgroundImage: "url('https://www.ionos.com/startupguide/fileadmin/_processed_/c/0/csm_data-analysis-laptop-t_4483ab6cad.webp')",
        backgroundSize: "cover",
        backgroundPosition: "center"
      }}
    >
      <FloatingMolecules />
      <div className="absolute inset-0 bg-black/50" />
      
      <div className="relative container mx-auto px-4 z-10">
        <div className={`text-center mb-16 transition-all duration-800`}>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Get In Touch
          </h2>
          <div className="section-divider bg-white"></div>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Ready to discuss your chemical solution needs? Contact our expert team today
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-bold text-white mb-6">Contact Information</h3>
              <p className="text-blue-100 mb-8 leading-relaxed">
                Connect with our team for personalized chemical solutions and expert consultation.
              </p>
            </div>

            <div className="flex flex-col gap-4">
              {contactInfo.map((info, index) => (
                <Card 
                  key={index}
                  className={`professional-card bg-black/60 backdrop-blur-md border-white/20 text-white transition-all duration-500 ${
                    isVisible ? 'modern-scale-in' : 'opacity-0 scale-95'
                  }`}
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <CardContent className="py-4 px-8 flex flex-row items-center h-full">
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${info.color} flex items-center justify-center flex-shrink-0 mr-6`}>
                      <info.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 text-left">
                      <h4 className="text-lg font-semibold text-white mb-1">{info.title}</h4>
                      {info.details.map((detail, idx) => (
                        <p key={idx} className="text-blue-100 text-sm">{detail}</p>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Enhanced Contact Form */}
          <div>
            <Card className="bg-black/60 backdrop-blur-md border-white/20 shadow-lg">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-white mb-6">Send us a Message</h3>
                
                <form onSubmit={handleContactSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-blue-100">Full Name</label>
                      <Input
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Your full name"
                        required
                        className="bg-white/20 border-white/30 text-white placeholder:text-blue-200 focus:border-blue-400 professional-input"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-blue-100">Email Address</label>
                      <Input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="your.email@company.com"
                        required
                        className="bg-white/20 border-white/30 text-white placeholder:text-blue-200 focus:border-blue-400 professional-input"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-blue-100">Subject</label>
                    <Input
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      placeholder="How can we help you?"
                      required
                      className="bg-white/20 border-white/30 text-white placeholder:text-blue-200 focus:border-blue-400 professional-input"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-blue-100">Message</label>
                    <Textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Tell us about your requirements..."
                      required
                      rows={5}
                      className="bg-white/20 border-white/30 text-white placeholder:text-blue-200 focus:border-blue-400 professional-textarea resize-none"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full professional-button text-lg py-4"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Sending...
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        <Send className="w-5 h-5 mr-2" />
                        Send Message
                      </div>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};