import React from 'react'

const Sainik = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 px-4">
      {/* Top Center Heading */}
      <div className="text-center space-y-6">
        <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight uppercase">
          Sainik School <span className="text-blue-600">Entrance Exam</span>
        </h1>
        
        <p className="text-slate-500 max-w-lg mx-auto text-lg font-medium">
          "Join the prestigious ranks of future leaders with our dedicated preparation module."
        </p>

        {/* Read More Button with Dummy Link */}
        <div className="pt-4">
          <a 
            href="https://sainikschoolsociety.in/" 
            className="inline-flex items-center justify-center px-10 h-14 rounded-full bg-blue-600 text-white font-black hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-200 active:scale-95 uppercase tracking-widest text-xs border-b-4 border-blue-800"
          >
            Read More
          </a>
        </div>
      </div>
    </div>
  )
}

export default Sainik