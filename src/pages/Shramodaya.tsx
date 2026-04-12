import React from 'react'

const Shramodaya = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 px-4">
      {/* Top Center Heading */}
      <div className="text-center space-y-6">
        <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight uppercase">
          Shramodaya School <span className="text-blue-600">Entrance Exam</span>
        </h1>
        
        <p className="text-slate-500 max-w-lg mx-auto text-lg">
          Prepare for the future with our comprehensive study materials and expert guidance.
        </p>

        {/* Read More Button with Dummy Link */}
        <div className="pt-4">
          <a 
            href="https://shramodayavidyalayagwl.in/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-8 h-14 rounded-full bg-primary text-white font-bold hover:bg-primary/90 transition-all shadow-lg hover:shadow-primary/20 active:scale-95 uppercase tracking-wider text-sm"
          >
            Read More
          </a>
        </div>
      </div>
    </div>
  )
}

export default Shramodaya
