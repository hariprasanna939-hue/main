import React from "react";
import { Button } from "@/components/ui/button";
import { MessageSquare, Mic, Play, Keyboard, Sparkles, CheckCheck } from "lucide-react";

export const AiAccountingCommands = () => {
  const textCommands = [
    { cmd: "Create a sales invoice for this customer.", resp: "The platform creates the invoice and calculates the applicable GST." },
    { cmd: "Show my profit and loss for this month.", resp: "The platform displays monthly income, expenses and profit status." },
    { cmd: "Which products are running low?", resp: "The platform displays current stock information and identifies low stock products." }
  ];

  const voiceCommands = [
    { cmd: "Generate my balance sheet.", resp: "The platform displays the available balance sheet information for review." },
    { cmd: "Show my future cash position.", resp: "The platform displays cash flow predictions based on the available financial data." },
    { cmd: "Display category wise expenses.", resp: "The platform presents the expense information organised by category." }
  ];

  return (
    <section id="ai-commands" className="py-6 md:py-8 border-t border-slate-100 bg-transparent scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Header */}
        <div className="space-y-4 text-center max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            Manage Accounting Through Voice or Text Commands
          </h2>
          <p className="text-sm font-medium leading-relaxed text-slate-700 sm:text-base">
            AIBASS makes accounting information easier to access by allowing users to communicate with the platform naturally.
            Enter or speak the accounting activity you need. The AI accounting assistant processes the instruction and either completes the supported action or displays the requested business information.
          </p>
          <div className="w-12 h-1 bg-indigo-600 rounded-full mx-auto" />
        </div>

        {/* Side-by-Side Command Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Column 1: Type Your Command */}
          <div className="bg-slate-50/50 border border-slate-200/60 rounded-[32px] p-6 md:p-8 flex flex-col justify-between space-y-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center text-purple-650">
                  <Keyboard className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Type Your Command</h3>
                  <p className="text-xs text-slate-500 font-medium">Enter a simple instruction using the text command box.</p>
                </div>
              </div>

              {/* Chat Simulation */}
              <div className="space-y-3.5 pt-4">
                {textCommands.map((item, index) => (
                  <div key={index} className="space-y-2">
                    {/* User command bubble */}
                    <div className="flex justify-end">
                      <div className="bg-indigo-600 text-white rounded-2xl rounded-tr-none px-4 py-2.5 shadow-sm text-sm font-semibold max-w-[85%]">
                        <p>{item.cmd}</p>
                        <div className="flex justify-end gap-1 mt-1 opacity-80 text-[9px] font-normal">
                          <span>11:32 AM</span>
                          <CheckCheck className="h-3 w-3 inline-block" />
                        </div>
                      </div>
                    </div>
                    {/* System response bubble */}
                    <div className="flex justify-start">
                      <div className="bg-white border border-slate-100 rounded-2xl rounded-tl-none px-4 py-2.5 shadow-sm text-sm font-medium text-slate-700 max-w-[90%] flex gap-2">
                        <Sparkles className="h-3.5 w-3.5 text-indigo-500 shrink-0 mt-0.5" />
                        <p>{item.resp}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Column 2: Speak Your Command */}
          <div className="bg-slate-50/50 border border-slate-200/60 rounded-[32px] p-6 md:p-8 flex flex-col justify-between space-y-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-655">
                  <Mic className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Speak Your Command</h3>
                  <p className="text-xs text-slate-500 font-medium">Use the voice command option to access supported information without manually searching.</p>
                </div>
              </div>

              {/* Chat Simulation */}
              <div className="space-y-3.5 pt-4">
                {voiceCommands.map((item, index) => (
                  <div key={index} className="space-y-2">
                    {/* User command bubble */}
                    <div className="flex justify-end">
                      <div className="bg-slate-950 text-white rounded-2xl rounded-tr-none px-4 py-2.5 shadow-sm text-sm font-semibold max-w-[85%] flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <p className="italic">“{item.cmd}”</p>
                      </div>
                    </div>
                    {/* System response bubble */}
                    <div className="flex justify-start">
                      <div className="bg-white border border-slate-100 rounded-2xl rounded-tl-none px-4 py-2.5 shadow-sm text-sm font-medium text-slate-700 max-w-[90%] flex gap-2">
                        <Sparkles className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                        <p>{item.resp}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* CTA section bottom */}
        <div className="text-center space-y-4 pt-4">
          <p className="text-sm font-semibold text-slate-600 max-w-2xl mx-auto leading-relaxed">
            This voice enabled accounting software experience helps business owners complete supported activities and access financial information faster.
          </p>
          <Button 
            onClick={() => {
              const element = document.getElementById("gst-calculation-section");
              if (element) {
                element.scrollIntoView({ behavior: "smooth" });
              }
            }}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold h-11 px-6 rounded-full inline-flex items-center gap-2 group transition-all shadow-md"
          >
            Watch AIBASS in Action
            <Play className="h-4 w-4 fill-white" />
          </Button>
        </div>

      </div>
    </section>
  );
};
