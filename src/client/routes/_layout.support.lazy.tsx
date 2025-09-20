import { createLazyFileRoute } from '@tanstack/react-router';
import { memo } from 'react';
import ResponsiveLayout from '../components/ResponsiveLayout';
import Footer from '../components/Footer';
import { useSuspenseQuery } from '@tanstack/react-query';
import { supporterPricesQueryOptions } from './_layout.support';
import { api } from '../online/api';
import { useRouteProtection } from '../router/useRouteProtection';
import { useOnline } from '../contexts/OnlineContext';
import SupporterBadge from '../components/SupporterBadge';
import { toRelativeDate } from '../uiHelper';

export const Route = createLazyFileRoute('/_layout/support')({
  component: memo(function RouteComponent() {
    useRouteProtection('login');
    const { me } = useOnline();
    const { data: supporterPrices } = useSuspenseQuery(
      supporterPricesQueryOptions
    );

    return (
      <ResponsiveLayout footer={<Footer />}>
        <div className="flex items-center flex-wrap justify-center mt-12 gap-8 [&>*]:shrink-0">
          <div className="flex flex-col gap-8 flex-1 min-w-96">
            <div className="text-4xl text-accent">Supporting Logic Pad</div>
            <div className="text-lg">
              {me?.supporterUntil
                ? `Your supporter status expires ${toRelativeDate(new Date(me?.supporterUntil), 'day')}`
                : `You haven't ever had supporter status`}
            </div>
            <progress
              className="progress progress-accent h-4 w-full"
              value={
                me?.supporterUntil
                  ? new Date(me?.supporterUntil).getTime() -
                    new Date().getTime()
                  : 0
              }
              max={1000 * 60 * 60 * 24 * 365}
            ></progress>
          </div>
          <SupporterBadge supporter={me?.supporter ?? 0} />
        </div>

        {supporterPrices.map(price => (
          <div
            key={price.priceId}
            className="p-4 border rounded-lg shadow-md w-full max-w-md mx-auto my-4"
          >
            <h2 className="text-xl font-bold mb-2">
              {price.months} Month{price.months > 1 ? 's' : ''}
            </h2>
            <p className="text-lg font-semibold">
              {new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: price.currency,
              }).format(price.price)}
            </p>
            <button
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              onClick={() => {
                api.checkoutSupporter(
                  price.priceId,
                  window.location.origin + '/supporter',
                  window.location.origin + '/supporter'
                );
              }}
            >
              Subscribe
            </button>
          </div>
        ))}
      </ResponsiveLayout>
    );
  }),
});
