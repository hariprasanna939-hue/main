import { motion } from "framer-motion";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";

const ThankYou = () => {
  return (
    <div className="min-h-screen w-full bg-white relative flex flex-col text-slate-950">
      {/* Light Sky Blue Glow */}
      <div 
        className="fixed inset-0 z-0 pointer-events-none" 
        style={{
          backgroundImage: `
            radial-gradient(circle at center, #a5cfffff, transparent)
          `,
        }} 
      />
      
      <Header />

      <main className="flex-1 flex items-center justify-center relative z-10 px-5 sm:px-6 pt-32 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl w-full mx-auto text-center bg-white/80 backdrop-blur-xl p-10 sm:p-16 rounded-[36px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100"
        >
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 20 }}
            className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8"
          >
            <CheckCircle2 className="w-12 h-12 text-green-500" />
          </motion.div>
          
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 mb-6">
            Thank you for choosing us!
          </h1>
          
          <p className="text-lg text-slate-600 mb-10 max-w-lg mx-auto leading-relaxed">
            We have received your application. Our team will reach out to you shortly to help you get set up.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/">
              <Button className="h-12 px-8 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-base">
                Return to Home
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default ThankYou;
