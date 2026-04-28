import Link from 'next/link';
import { BookOpen, CreditCard, Wallet, Network, ShieldAlert, Code, ArrowRight, Sparkles } from 'lucide-react';

export default function HomePage() {
  const tabs = [
    {
      name: 'Concepts',
      href: '/docs/paycom-concepts',
      icon: BookOpen,
      description: 'Sessions, charges, holds, refunds, payouts, and 3DS — the core building blocks of the Pay.com payment model.',
    },
    {
      name: 'Payments',
      href: '/docs/payments',
      icon: CreditCard,
      description: 'Charges, pre-auth holds, 3DS, refunds, and webhooks — the full payment lifecycle engine.',
    },
    {
      name: 'API Reference',
      href: '/docs/api-reference',
      icon: Code,
      description: 'REST API with resource-oriented URLs covering charges, holds, refunds, payouts, and sessions.',
    },
    {
      name: 'Payment Methods',
      href: '/docs/payment-methods',
      icon: Wallet,
      description: 'Cards, digital wallets, and alternative payment methods accepted globally.',
    },
    {
      name: 'Orchestration',
      href: '/docs/orchestration',
      icon: Network,
      description: 'Route transactions dynamically across multiple processors to maximize authorization rates.',
    },
    {
      name: 'Risk, Disputes & Fraud',
      href: '/docs/risk-disputes-fraud',
      icon: ShieldAlert,
      description: 'Configure velocity checks, manage 3DS flows, and respond to chargebacks and disputes.',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <div className="mb-16 text-center">
        <h1 className="text-4xl font-bold tracking-tight mb-4">
          Payments. Made. Simple.
        </h1>
        <p className="text-lg text-fd-muted-foreground mb-6">
          Access the full power of Pay.com global payment gateway and orchestration engine.
        </p>
        <Link
          href="/docs/introduction"
          className="inline-flex items-center gap-2 rounded-lg bg-fd-primary px-5 py-2.5 text-sm font-medium text-fd-primary-foreground hover:opacity-90 transition-opacity"
        >
          Get started
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tabs.map((tab) => (
          <Link
            key={tab.name}
            href={tab.href}
            className="flex flex-col rounded-xl border border-fd-border bg-fd-card p-5 gap-3 hover:shadow-lg transition-shadow duration-200"
          >
            <tab.icon className="w-7 h-7 text-fd-primary" />
            <div className="flex flex-col gap-1">
              <h2 className="text-base font-semibold">{tab.name}</h2>
              <p className="text-sm text-fd-muted-foreground leading-relaxed">{tab.description}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-6">
        <Link
          href="/documentation/introduction/mcp"
          className="flex items-center gap-4 rounded-xl border border-fd-border bg-fd-card p-5 hover:shadow-lg transition-shadow duration-200"
        >
          <Sparkles className="w-7 h-7 text-fd-primary shrink-0" />
          <div className="flex flex-col gap-1">
            <h2 className="text-base font-semibold">AI-powered help</h2>
            <p className="text-sm text-fd-muted-foreground leading-relaxed">
              Give your AI coding tool direct access to Pay.com documentation for real-time answers about the API, SDKs, and payment flows.
            </p>
          </div>
          <ArrowRight className="w-4 h-4 text-fd-muted-foreground ml-auto shrink-0" />
        </Link>
      </div>
    </div>
  );
}
