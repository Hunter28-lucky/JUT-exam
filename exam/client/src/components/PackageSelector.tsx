import React from 'react';
import { Check } from 'lucide-react';
import { Package } from '@/pages/home';

interface PackageSelectorProps {
  semester: string;
  branch: string;
  onPurchase: (pkg: Package) => void;
}

export default function PackageSelector({ semester, branch, onPurchase }: PackageSelectorProps) {
  const packages: Package[] = [
    {
      id: 'confirm',
      name: '100% Confirm Questions',
      price: 299,
      description: 'Guaranteed exam questions',
      features: [
        'Confirmed examination questions',
        'Previous year question papers',
        'Important questions compilation',
        'Model answers with explanations'
      ]
    },
    {
      id: 'guest',
      name: 'Guest Questions',
      price: 50,
      description: 'Guest questions collection',
      features: [
        'Guest question papers',
        'Important topic questions',
        'Quick revision material',
        'Basic answer guidelines'
      ]
    },
    {
      id: 'single',
      name: '100% Confirm One Question',
      price: 10,
      description: 'Single confirmed question',
      features: [
        'One guaranteed exam question',
        'Detailed answer explanation',
        'Topic-wise selection',
        'Instant download'
      ]
    }
  ];

  return (
    <div className="space-y-4" data-testid="package-selector">
      <h3 className="text-lg font-bold text-foreground mb-4" data-testid="text-packages-title">📦 Available Study Packages</h3>
      
      {packages.map((pkg, index) => (
        <div 
          key={pkg.id}
          className={`border rounded-lg p-4 hover:shadow-md transition-shadow bg-white dark:bg-gray-700 relative ${
            index === 1 ? 'border-2 border-primary' : 'border border-border'
          }`}
          data-testid={`card-package-${pkg.id}`}
        >
          {index === 1 && (
            <div className="absolute -top-3 left-4 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-medium" data-testid="badge-most-popular">
              Most Popular
            </div>
          )}
          
          <div className="flex justify-between items-start mb-3">
            <div>
              <h4 className="font-semibold text-foreground" data-testid={`text-package-name-${pkg.id}`}>{pkg.name}</h4>
              <p className="text-sm text-muted-foreground" data-testid={`text-package-description-${pkg.id}`}>{pkg.description}</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-primary" data-testid={`text-package-price-${pkg.id}`}>₹{pkg.price}</div>
              <div className="text-xs text-muted-foreground" data-testid={`text-package-payment-type-${pkg.id}`}>One-time payment</div>
            </div>
          </div>
          
          <ul className="space-y-2 mb-4">
            {pkg.features.map((feature, featureIndex) => (
              <li key={featureIndex} className="flex items-center text-sm text-muted-foreground" data-testid={`text-package-feature-${pkg.id}-${featureIndex}`}>
                <Check className="text-green-600 mr-2 h-4 w-4 flex-shrink-0" data-testid={`icon-check-${pkg.id}-${featureIndex}`} />
                {feature}
              </li>
            ))}
          </ul>
          
          <button 
            onClick={() => onPurchase(pkg)}
            className="w-full bg-primary text-primary-foreground py-2 px-4 rounded-lg font-medium hover:bg-primary/90 transition-colors"
            data-testid={`button-purchase-${pkg.id}`}
          >
            Purchase Now
          </button>
        </div>
      ))}
    </div>
  );
}
