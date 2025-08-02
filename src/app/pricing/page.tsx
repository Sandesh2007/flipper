'use client';

import React from 'react';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components';

const features = [
  'Upload and publish PDFs',
  'Public sharing link',
  'Responsive viewer',
  'Unlimited publications',
  'Basic analytics (views only)',
];

const Pricing = () => {
  return (
    <div className="min-h-screen bg-background text-foreground py-20 px-4">
      <div className="max-w-4xl mx-auto text-center space-y-6">
        <h1 className="text-4xl font-bold">Our Pricing</h1>
        <p className="text-muted-foreground text-lg">
          Simple, transparent pricing. Get started for free — no credit card required.
        </p>

        <div className="mt-10 flex justify-center">
          <div className="w-full max-w-sm rounded-2xl border border-border shadow-md bg-card p-8 text-left">
            <div
            className='w-full flex justify-between'
            >
              <h2 className="text-2xl font-semibold mb-4">Basic Plan</h2>
              <CheckCircle className='text-green-500 w-5 h-5 ' />
            </div>
            <p className="text-4xl font-bold mb-2">Free</p>
            <p className="text-muted-foreground mb-6">Perfect for individuals getting started.</p>
            <ul className="space-y-3 mb-6">
              {features.map((feature, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle className="text-green-500 w-5 h-5 mt-0.5" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <Button className="w-full bg-green-400 hover:bg-green-500" variant="default">
              Currently active
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
