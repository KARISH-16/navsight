import React from 'react';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export default function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="bg-white p-8 rounded-[40px] border-2 border-slate-50 shadow-sm hover:shadow-xl transition-all group">
      <div className="mb-6 p-4 bg-slate-50 w-fit rounded-2xl group-hover:scale-110 transition-transform">{icon}</div>
      <h3 className="text-lg font-black mb-2 text-slate-900 uppercase tracking-tight">{title}</h3>
      <p className="text-sm text-slate-500 leading-relaxed font-medium">{description}</p>
    </div>
  );
}
