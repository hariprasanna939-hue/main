import React from "react";
import { Button } from "@/components/ui/button";
import { 
  ShieldCheck, 
  Lock, 
  Key, 
  Server, 
  RefreshCw, 
  Database, 
  EyeOff, 
  FileText, 
  Download, 
  HelpCircle,
  FileCheck,
  ArrowRight
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export const AiAccountingSecurity = () => {
  const navigate = useNavigate();
  const securityItems = [
    {
      title: "Secure Account Access",
      desc: "User accounts are protected through secure authentication and password controls. Includes email verification, OTP login, two-factor authentication, session timeout and account recovery.",
      icon: Key,
      color: "text-purple-600 bg-purple-50 border-purple-100"
    },
    {
      title: "Encrypted Data Transfer",
      desc: "Information transferred between the user’s browser and AIBASS is protected using secure HTTPS and verified TLS encryption protocols.",
      icon: RefreshCw,
      color: "text-blue-600 bg-blue-50 border-blue-100"
    },
    {
      title: "Encrypted Data Storage",
      desc: "Stored accounting and business information is encrypted at rest using industry-standard protocols to reduce the risk of unauthorised access.",
      icon: Lock,
      color: "text-emerald-650 bg-emerald-50 border-emerald-100"
    },
    {
      title: "Controlled User Access",
      desc: "Businesses can control who is allowed to access financial information and software functions with role-based permissions (administrators, user roles, access removal).",
      icon: EyeOff,
      color: "text-indigo-650 bg-indigo-50 border-indigo-100"
    },
    {
      title: "Regular Data Backups",
      desc: "Business information is backed up regularly to support recovery in the event of accidental deletion, system failure or service disruption.",
      icon: Database,
      color: "text-orange-655 bg-orange-50 border-orange-100"
    },
    {
      title: "Secure Cloud Infrastructure",
      desc: "AIBASS operates on professionally managed cloud infrastructure with real-time server monitoring, security updates and controlled administrative access.",
      icon: Server,
      color: "text-rose-600 bg-rose-50 border-rose-100"
    },
    {
      title: "Login and Session Protection",
      desc: "Session expiry, failed login monitoring, password reset protection and automatic sign-out after extended inactivity safeguard active accounts.",
      icon: ShieldCheck,
      color: "text-cyan-600 bg-cyan-50 border-cyan-100"
    },
    {
      title: "Customer Data Ownership",
      desc: "Customers retain full ownership of the accounting and business information entered into AIBASS. Data processing follows a strict privacy policy.",
      icon: FileCheck,
      color: "text-teal-600 bg-teal-50 border-teal-100"
    },
    {
      title: "Data Export and Deletion",
      desc: "Users can request full data exports, account closure or complete deletion of eligible financial records through our approved support processes.",
      icon: Download,
      color: "text-blue-650 bg-blue-50 border-blue-100"
    },
    {
      title: "Security Monitoring and Updates",
      desc: "Continuous monitoring for unusual activity, software vulnerabilities and patches. Security updates are applied through managed maintenance windows.",
      icon: FileText,
      color: "text-amber-600 bg-amber-50 border-amber-100"
    },
    {
      title: "Customer Support",
      desc: "Access our technical assistance and dedicated support team for help with login issues, account access, and data queries.",
      icon: HelpCircle,
      color: "text-slate-655 bg-slate-100 border-slate-200"
    }
  ];

  return (
    <section className="py-6 md:py-8 border-t border-slate-100 bg-transparent">
      <div className="max-w-[1380px] mx-auto px-4 sm:px-8 lg:px-12 space-y-16">
        
        {/* Header */}
        <div className="space-y-4 text-center max-w-3xl mx-auto">
          <span className="text-xs font-bold tracking-[0.2em] text-indigo-655 uppercase block">Enterprise Security</span>
          <h2 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            Security Designed to Protect Your Business Financial Data
          </h2>
          <p className="text-sm font-medium leading-relaxed text-slate-700 sm:text-base">
            AIBASS uses a layered security approach to help protect accounting records, invoices, GST information, inventory data, financial reports and other sensitive business information.
          </p>
          <div className="w-12 h-1 bg-indigo-600 rounded-full mx-auto" />
        </div>

        {/* Security Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {securityItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <div 
                key={index}
                className="bg-white border border-slate-150 rounded-[24px] p-6 flex items-start gap-4 hover:shadow-[0_10px_30px_rgba(0,0,0,0.02)] transition-all text-left"
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${item.color} shrink-0`}>
                  <Icon className="h-4.5 w-4.5" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-slate-900 leading-snug">{item.title}</h3>
                  <p className="text-sm text-slate-600 font-medium leading-relaxed">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Callout banner */}
        <div className="max-w-4xl mx-auto bg-slate-50 border border-slate-200/60 rounded-[32px] p-8 text-center space-y-6">
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-slate-900">Your Data. Your Access. Your Control.</h3>
            <p className="text-sm font-semibold text-slate-600 max-w-xl mx-auto leading-relaxed">
              AIBASS helps businesses manage important financial information while keeping account access and business decisions under user control.
            </p>
          </div>
          <Button
            onClick={() => window.dispatchEvent(new CustomEvent("openTrialModal"))}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold h-12 px-8 rounded-full text-sm shadow-md transition-all hover:-translate-y-0.5"
          >
            Start Your 30 Day Free Trial
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

      </div>
    </section>
  );
};
