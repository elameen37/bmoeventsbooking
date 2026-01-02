import { Link } from "react-router-dom";
import { Calendar, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
const Footer = () => {
  return <footer className="bg-secondary/30 border-t border-border">
      <div className="container mx-auto px-6 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-lg gold-gradient flex items-center justify-center">
                <Calendar className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <span className="font-display text-xl font-bold">B.M.O</span>
                <span className="text-xs block text-muted-foreground">Events Arena</span>
              </div>
            </Link>
            <p className="text-muted-foreground text-sm mb-4">
              Premium event venues across Abuja. Your perfect event starts here.
            </p>
            <div className="flex gap-3">
              <SocialIcon Icon={Facebook} href="#" />
              <SocialIcon Icon={Twitter} href="#" />
              <SocialIcon Icon={Instagram} href="#" />
              <SocialIcon Icon={Linkedin} href="#" />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <FooterLink to="/arenas">Our Arenas</FooterLink>
              <FooterLink to="/calendar">Booking Calendar</FooterLink>
              <FooterLink to="/pricing">Pricing</FooterLink>
              <FooterLink to="/about">About Us</FooterLink>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-display font-semibold mb-4">Support</h4>
            <ul className="space-y-2">
              <FooterLink to="/faq">FAQ</FooterLink>
              <FooterLink to="/terms">Terms of Service</FooterLink>
              <FooterLink to="/privacy">Privacy Policy</FooterLink>
              <FooterLink to="/contact">Contact Us</FooterLink>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4 text-primary" />
                Plot 174, Riverplate  Park, Wuse II, Abuja, Nigeria
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="w-4 h-4 text-primary" />
                +234 801 234 5678
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="w-4 h-4 text-primary" />
                info@bmoarena.com
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} B.M.O Events Arena. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground">
            Designed with ❤️ in Abuja
          </p>
        </div>
      </div>
    </footer>;
};
const SocialIcon = ({
  Icon,
  href
}: {
  Icon: React.ElementType;
  href: string;
}) => <a href={href} className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors">
    <Icon className="w-4 h-4" />
  </a>;
const FooterLink = ({
  to,
  children
}: {
  to: string;
  children: React.ReactNode;
}) => <li>
    <Link to={to} className="text-sm text-muted-foreground hover:text-primary transition-colors">
      {children}
    </Link>
  </li>;
export default Footer;