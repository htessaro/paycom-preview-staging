import Link from 'next/link';
import { BookOpen, CreditCard, Wallet, Network, ShieldAlert, BarChart, Code, TerminalSquare } from 'lucide-react';

export default function HomePage() {
  const tabs = [
    { name: 'Introduction', href: '/docs/introduction', icon: BookOpen },
    { name: 'Payments', href: '/docs/payments', icon: CreditCard },
    { name: 'Payment Methods', href: '/docs/payment-methods', icon: Wallet },
    { name: 'Orchestration', href: '/docs/orchestration', icon: Network },
    { name: 'Risk, Disputes, & Fraud', href: '/docs/risk-disputes-fraud', icon: ShieldAlert },
    { name: 'Reporting & Reconciliation', href: '/docs/reporting-reconciliation', icon: BarChart },
    { name: 'API Reference', href: '/docs/api-reference', icon: Code },
    { name: 'SDK Reference', href: '/docs/sdk-reference', icon: TerminalSquare },
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-8">Welcome to the Documentation</h1>
      <p className="text-lg text-muted-foreground mb-12">
        Explore our guides and API reference to integrate payments seamlessly.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
        {tabs.map((tab) => (
          <Link
            key={tab.name}
            href={tab.href}
            className="flex flex-col items-center p-6 bg-card border rounded-xl hover:shadow-lg transition-shadow"
          >
            <tab.icon className="w-10 h-10 mb-4 text-primary" />
            <h2 className="text-lg font-semibold">{tab.name}</h2>
          </Link>
        ))}
      </div>
    </div>
  );
}
